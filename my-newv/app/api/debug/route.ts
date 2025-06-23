// app/api/webhook/route.ts - IMPROVED VERSION
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔵 ===== WEBHOOK RECEIVED =====');
  
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    
    if (!sig) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    
    if (!endpointSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log('✅ Webhook signature verified. Event type:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Quick response for unsupported events
    if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.expired') {
      console.log(`🤷 Unhandled event type: ${event.type}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Handle checkout.session.expired quickly
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('⏰ Handling expired session:', session.id);
      
      if (session.metadata?.bookingId) {
        try {
          await db.collection('bookings').doc(session.metadata.bookingId).update({
            paymentStatus: 'expired',
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error('❌ Error updating expired booking:', error);
        }
      }
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('🛒 Processing completed session:', session.id);
      
      // Validate metadata
      if (!session.metadata?.bookingId) {
        console.error('❌ Missing bookingId in session metadata');
        return NextResponse.json({ error: 'Missing booking data' }, { status: 400 });
      }

      const bookingId = session.metadata.bookingId;
      console.log('📝 Processing booking ID:', bookingId);

      // **CRITICAL: Respond to Stripe quickly (within 10 seconds)**
      // We'll process the booking asynchronously
      const responsePromise = handleBookingAsync(session, bookingId);
      
      // Don't wait for the async processing - respond immediately
      setTimeout(() => {
        responsePromise.catch(error => {
          console.error('❌ Async booking processing failed:', error);
        });
      }, 0);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Webhook responded in ${processingTime}ms`);
      
      return NextResponse.json({ 
        received: true, 
        bookingId: bookingId,
        processingAsync: true,
        responseTime: processingTime
      }, { status: 200 });
    }

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('❌ Webhook error after', processingTime, 'ms:', error);
    
    // Always return 200 to prevent Stripe retries for processing errors
    return NextResponse.json({ 
      received: true, 
      error: 'Processing error - will retry async',
      processingTime
    }, { status: 200 });
  }
}

// Async function to handle the booking creation
async function handleBookingAsync(session: Stripe.Checkout.Session, bookingId: string) {
  console.log('🔄 ===== ASYNC BOOKING PROCESSING =====');
  
  try {
    const metadata = session.metadata || {};
    
    // Create booking data
    const bookingData = {
      bookingId: bookingId,
      customerName: metadata.customer_name || session.customer_details?.name || '',
      customerEmail: metadata.customer_email || session.customer_email || '',
      customerPhone: metadata.customer_phone || '',
      service: metadata.service || '',
      serviceId: metadata.service_id || '',
      date: metadata.date || '',
      time: metadata.time || '',
      duration: metadata.duration || '30',
      timezone: metadata.timezone || 'America/New_York',
      message: metadata.message || '',
      paymentStatus: 'completed',
      stripeSessionId: session.id,
      amountPaid: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('💾 Saving booking to Firestore...');
    await db.collection('bookings').doc(bookingId).set(bookingData, { merge: true });
    console.log('✅ Booking saved successfully');

    // Create Zoom meeting and send emails (with error handling)
    try {
      console.log('🎥 Creating Zoom meeting...');
      const zoomResult = await createZoomMeeting(bookingData);
      
      console.log('📧 Sending emails...');
      await sendConfirmationEmails(bookingData, zoomResult);
      
      // Update booking with final results
      await db.collection('bookings').doc(bookingId).update({
        zoomMeetingId: zoomResult.id,
        zoomJoinUrl: zoomResult.join_url,
        zoomStartUrl: zoomResult.start_url,
        zoomPassword: zoomResult.password,
        zoomMeetingCreated: true,
        emailsSent: true,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Async booking processing completed successfully');
      
    } catch (zoomEmailError: any) {
      console.error('❌ Zoom/Email error (booking still saved):', zoomEmailError);
      
      // Update with error info but keep booking
      await db.collection('bookings').doc(bookingId).update({
        zoomMeetingCreated: false,
        emailsSent: false,
        processingError: zoomEmailError.message,
        updatedAt: new Date().toISOString()
      });
    }
    
  } catch (error: any) {
    console.error('❌ Critical async processing error:', error);
    
    // Try to update booking with error
    try {
      await db.collection('bookings').doc(bookingId).update({
        processingError: error.message,
        updatedAt: new Date().toISOString()
      });
    } catch (updateError) {
      console.error('❌ Failed to update booking with error:', updateError);
    }
  }
}

// Your existing createZoomMeeting and sendConfirmationEmails functions...
// (Keep the same functions from your current webhook file)
// Enhanced Zoom meeting creation function
async function createZoomMeeting(bookingData: any) {
  console.log('🔄 Getting Zoom access token...');
  
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    throw new Error('Missing Zoom credentials. Check ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, and ZOOM_ACCOUNT_ID in environment variables.');
  }

  // Get access token with better error handling
  let accessToken;
  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: accountId,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Zoom token response:', errorText);
      throw new Error(`Failed to get Zoom access token: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;
    
    if (!accessToken) {
      throw new Error('No access token received from Zoom API');
    }
    
    console.log('✅ Zoom access token obtained');
  } catch (error: any) {
    console.error('❌ Failed to get Zoom access token:', error);
    throw new Error(`Zoom authentication failed: ${error.message}`);
  }

  // Parse date and time with better validation
  let startTime;
  try {
    const baseDate = new Date(bookingData.date + 'T00:00:00');
    
    if (isNaN(baseDate.getTime())) {
      throw new Error(`Invalid date format: ${bookingData.date}`);
    }
    
    const [time, modifier] = bookingData.time.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Invalid time format: ${bookingData.time}`);
    }

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    baseDate.setHours(hours, minutes, 0, 0);
    startTime = baseDate;
    
    console.log('📅 Meeting scheduled for:', startTime.toISOString());
  } catch (error: any) {
    console.error('❌ Failed to parse date/time:', error);
    throw new Error(`Date/time parsing failed: ${error.message}`);
  }

  const meetingData = {
    topic: `${bookingData.service} - ${bookingData.customerName}`,
    type: 2,
    start_time: startTime.toISOString(),
    duration: parseInt(bookingData.duration) || 30,
    timezone: bookingData.timezone || 'America/New_York',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      waiting_room: true,
      audio: 'both',
      auto_recording: 'none',
    },
  };

  console.log('🔄 Creating Zoom meeting with data:', {
    topic: meetingData.topic,
    start_time: meetingData.start_time,
    duration: meetingData.duration,
    timezone: meetingData.timezone
  });

  const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  });

  if (!meetingResponse.ok) {
    const errorText = await meetingResponse.text();
    console.error('❌ Zoom meeting creation error:', errorText);
    throw new Error(`Failed to create Zoom meeting: ${meetingResponse.status} ${errorText}`);
  }

  const meeting = await meetingResponse.json();
  console.log('✅ Zoom meeting created successfully');

  return {
    id: meeting.id.toString(),
    password: meeting.password,
    join_url: meeting.join_url,
    start_url: meeting.start_url,
    topic: meeting.topic,
    start_time: meeting.start_time,
  };
}

// Enhanced email sending function
async function sendConfirmationEmails(bookingData: any, meetingData: any) {
  console.log('📧 Sending confirmation emails...');
  
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_APP_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    throw new Error('Missing email credentials. Check EMAIL_USER and EMAIL_APP_PASSWORD in environment variables.');
  }
  
  const nodemailer = require('nodemailer');
  
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
    
    // Verify transporter
    await transporter.verify();
    console.log('✅ Email transporter verified');
  } catch (error: any) {
    console.error('❌ Email transporter setup failed:', error);
    throw new Error(`Email setup failed: ${error.message}`);
  }

  const adminMailOptions = {
    from: {
      name: 'JAGADGURU Booking System',
      address: emailUser,
    },
    to: emailUser,
    subject: `🆕 New Booking: ${bookingData.customerName} - ${bookingData.service}`,
    html: generateAdminEmailContent(bookingData, meetingData),
  };

  const customerMailOptions = {
    from: {
      name: 'JAGADGURU',
      address: emailUser,
    },
    to: bookingData.customerEmail,
    subject: `✅ Meeting Confirmed: ${bookingData.service} on ${new Date(bookingData.date).toLocaleDateString()}`,
    html: generateCustomerEmailContent(bookingData, meetingData),
  };

  console.log('📧 Sending emails to:', {
    admin: emailUser,
    customer: bookingData.customerEmail
  });

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);
    console.log('✅ All emails sent successfully');
  } catch (error: any) {
    console.error('❌ Failed to send emails:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

// Email template functions
function generateAdminEmailContent(bookingData: any, meetingData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">New Booking Request</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <p><strong>👤 Name:</strong> ${bookingData.customerName}</p>
        <p><strong>✉️ Email:</strong> ${bookingData.customerEmail}</p>
        <p><strong>📞 Phone:</strong> ${bookingData.customerPhone}</p>
        <p><strong>🔧 Service:</strong> ${bookingData.service}</p>
        <p><strong>📅 Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> ${bookingData.time}</p>
        <p><strong>🌍 Timezone:</strong> ${bookingData.timezone}</p>
        <p><strong>💰 Amount Paid:</strong> $${bookingData.amountPaid}</p>
        <p><strong>⏱️ Duration:</strong> ${bookingData.duration} minutes</p>
        <p><strong>🆔 Booking ID:</strong> ${bookingData.bookingId}</p>
      </div>
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 15px;">
        <h3 style="color: #1976d2;">🎥 Zoom Meeting Details</h3>
        <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
        <p><strong>Password:</strong> ${meetingData.password}</p>
        <p><strong>Host URL:</strong> <a href="${meetingData.start_url}">Start Meeting</a></p>
        <p><strong>Join URL:</strong> <a href="${meetingData.join_url}">Join Meeting</a></p>
      </div>
    </div>
  `;
}

function generateCustomerEmailContent(bookingData: any, meetingData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - JAGADGURU</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px; border: 1px solid #ddd; border-radius: 0 0 12px 12px; }
        .meeting-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .zoom-details { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
        .button { display: inline-block; background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px 5px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Booking Confirmed!</h1>
        <p>Your consultation with JAGADGURU has been scheduled</p>
      </div>
      <div class="content">
        <h2>Hello ${bookingData.customerName},</h2>
        <p>Thank you for booking a consultation with us! Your Zoom meeting has been created and is ready.</p>
        
        <div class="meeting-details">
          <h3>📅 Appointment Details</h3>
          <p><strong>Service:</strong> ${bookingData.service}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingData.time} (${bookingData.timezone})</p>
          <p><strong>Duration:</strong> ${bookingData.duration} minutes</p>
        </div>

        <div class="zoom-details">
          <h3>🎥 Zoom Meeting Information</h3>
          <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
          <p><strong>Password:</strong> ${meetingData.password}</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${meetingData.join_url}" class="button">🎥 Join Zoom Meeting</a>
          </div>
        </div>

        <p style="margin-top: 30px;">We look forward to speaking with you!</p>
        <p><strong>Best regards,<br>The JAGADGURU Team</strong></p>
      </div>
    </body>
    </html>
  `;
}