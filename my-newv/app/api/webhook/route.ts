export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase-admin';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log('🔵 ===== WEBHOOK RECEIVED =====');
  
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    
    if (!sig) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
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
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutSessionCompleted(event);
        
      case 'checkout.session.expired':
        return await handleCheckoutSessionExpired(event);
        
      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in webhook handler:', error);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Error processing webhook',
      message: error.message 
    }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('🛒 ===== PROCESSING CHECKOUT SESSION COMPLETED =====');
  console.log('🔍 Session ID:', session.id);
  console.log('🔍 Session metadata:', JSON.stringify(session.metadata, null, 2));
  
  // Check if metadata exists and has bookingId
  if (!session.metadata || !session.metadata.bookingId) {
    console.error('❌ Missing bookingId in session metadata');
    console.log('❌ Available metadata:', session.metadata);
    return NextResponse.json({ error: 'Missing bookingId in metadata' }, { status: 400 });
  }

  const bookingId = session.metadata.bookingId;
  console.log('📝 Processing booking ID:', bookingId);

  // Safely check metadata fields
  const metadata = session.metadata || {};
  const requiredFields = ['customer_name', 'customer_email', 'service', 'date', 'time'];
  const missingFields = requiredFields.filter(field => !metadata[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing required metadata fields:', missingFields);
    console.log('❌ Available metadata fields:', Object.keys(metadata));
    console.log('❌ Metadata content:', metadata);
    return NextResponse.json({ 
      error: 'Missing required booking data',
      missingFields,
      availableFields: Object.keys(metadata)
    }, { status: 400 });
  }

  // 🔧 FIX: Include stripeSessionId in the initial booking data
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
    stripeSessionId: session.id, // 🔧 FIX: Add this line!
    amountPaid: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency || 'usd',
    status: 'confirmed',
    zoomMeetingCreated: false,
    emailsSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log('📋 Booking data prepared:', {
    bookingId: bookingData.bookingId,
    customerName: bookingData.customerName,
    customerEmail: bookingData.customerEmail,
    service: bookingData.service,
    date: bookingData.date,
    time: bookingData.time,
    stripeSessionId: bookingData.stripeSessionId // 🔧 FIX: Log this too
  });

  // Save initial booking to Firestore using Firebase Admin
  try {
    console.log('💾 Saving initial booking to Firestore...');
    const bookingRef = db.collection('bookings').doc(bookingId);
    await bookingRef.set(bookingData, { merge: true });
    console.log('✅ Initial booking saved to Firestore with stripeSessionId:', session.id);
  } catch (error: any) {
    console.error('❌ Failed to save initial booking:', error);
    console.error('❌ Error details:', error.message);
    return NextResponse.json({ 
      error: 'Failed to save booking', 
      details: error.message 
    }, { status: 500 });
  }

  // Create Zoom meeting and send emails
  let zoomResult = null;
  let emailResult = false;

  try {
    console.log('🔄 ===== CREATING ZOOM MEETING =====');
    zoomResult = await createZoomMeetingWithRetry(bookingData);
    console.log('✅ Zoom meeting created successfully:', zoomResult.id);
  } catch (error: any) {
    console.error('❌ FAILED to create Zoom meeting:', error);
    
    // Update booking with error info
    try {
      const bookingRef = db.collection('bookings').doc(bookingId);
      await bookingRef.update({
        zoomMeetingCreated: false,
        zoomMeetingError: error.message,
        updatedAt: new Date().toISOString()
      });
    } catch (updateError) {
      console.error('❌ Failed to update booking with Zoom error:', updateError);
    }
  }

  // Send emails only if Zoom meeting was created
  if (zoomResult) {
    try {
      console.log('📧 ===== SENDING EMAILS =====');
      await sendConfirmationEmailsWithRetry(bookingData, zoomResult);
      emailResult = true;
      console.log('✅ Emails sent successfully');
    } catch (error: any) {
      console.error('❌ Failed to send emails:', error);
    }
  }

  // Update booking with final results (stripeSessionId already saved above)
  try {
    const bookingRef = db.collection('bookings').doc(bookingId);
    const updateData: any = {
      updatedAt: new Date().toISOString(),
      emailsSent: emailResult
    };

    if (zoomResult) {
      updateData.zoomMeetingId = zoomResult.id;
      updateData.zoomJoinUrl = zoomResult.join_url;
      updateData.zoomStartUrl = zoomResult.start_url;
      updateData.zoomPassword = zoomResult.password;
      updateData.zoomMeetingCreated = true;
    }

    await bookingRef.update(updateData);
    console.log('✅ Booking updated with final results');
  } catch (error) {
    console.error('❌ Failed to update booking with results:', error);
  }

  return NextResponse.json({ 
    received: true, 
    bookingId: bookingId,
    stripeSessionId: session.id, // 🔧 FIX: Include in response
    zoomMeetingCreated: !!zoomResult,
    zoomMeetingId: zoomResult?.id || null,
    emailsSent: emailResult
  });
}

async function handleCheckoutSessionExpired(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('⏰ Handling expired session:', session.id);
  
  // Safe metadata access
  if (!session.metadata || !session.metadata.bookingId) {
    return NextResponse.json({ received: true });
  }
  
  try {
    const bookingRef = db.collection('bookings').doc(session.metadata.bookingId);
    const doc = await bookingRef.get();
    
    if (doc.exists) {
      await bookingRef.update({
        paymentStatus: 'expired',
        stripeSessionId: session.id, // 🔧 FIX: Also add stripeSessionId for expired sessions
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Marked booking ${session.metadata.bookingId} as expired`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error updating expired booking:', error);
    return NextResponse.json({ received: true });
  }
}

// Rest of the functions remain unchanged...
// (createZoomMeetingWithRetry, sendConfirmationEmailsWithRetry, createZoomMeeting, sendConfirmationEmails, generateAdminEmailContent, generateCustomerEmailContent)

// Zoom meeting creation with retry logic
async function createZoomMeetingWithRetry(bookingData: any, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Zoom meeting creation attempt ${attempt}/${maxRetries}`);
      return await createZoomMeeting(bookingData);
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Zoom attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // 2s, 4s, 6s delays
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Email sending with retry logic  
async function sendConfirmationEmailsWithRetry(bookingData: any, meetingData: any, maxRetries = 2) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email sending attempt ${attempt}/${maxRetries}`);
      await sendConfirmationEmails(bookingData, meetingData);
      return;
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Email attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying emails in 3s...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  
  throw lastError;
}

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
    transporter = nodemailer.createTransporter({
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