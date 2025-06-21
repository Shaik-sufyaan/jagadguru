// app/api/webhook/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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
  
  if (!session.metadata?.bookingId) {
    console.error('❌ Missing bookingId in session metadata');
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
  }

  const bookingId = session.metadata.bookingId;
  console.log('📝 Processing booking ID:', bookingId);

  // First, save the initial booking data to Firestore
  const bookingRef = doc(db, 'bookings', bookingId);
  const initialBookingData = {
    bookingId: bookingId,
    customerName: session.metadata.customer_name || session.customer_details?.name || '',
    customerEmail: session.metadata.customer_email || session.customer_email || '',
    customerPhone: session.metadata.customer_phone || '',
    service: session.metadata.service || '',
    serviceId: session.metadata.service_id || '',
    date: session.metadata.date || '',
    time: session.metadata.time || '',
    duration: session.metadata.duration || '30',
    timezone: session.metadata.timezone || 'America/New_York',
    message: session.metadata.message || '',
    paymentStatus: 'completed',
    stripeSessionId: session.id,
    amountPaid: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency || 'usd',
    status: 'confirmed',
    zoomMeetingCreated: false,
    emailsSent: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    console.log('💾 Saving initial booking to Firestore...');
    await setDoc(bookingRef, initialBookingData, { merge: true });
    console.log('✅ Initial booking saved to Firestore');
  } catch (error) {
    console.error('❌ Failed to save initial booking:', error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }

  // Now create Zoom meeting and send emails
  try {
    console.log('🔄 ===== CREATING ZOOM MEETING AND SENDING EMAILS =====');
    
    // Use direct function call instead of HTTP request to avoid URL issues
    const result = await createZoomMeetingDirectly(initialBookingData);
    
    console.log('✅ Zoom meeting created successfully:', result.meetingId);
    
    // Update booking with Zoom details
    const updateData = {
      zoomMeetingId: result.meetingId,
      zoomJoinUrl: result.joinUrl,
      zoomStartUrl: result.startUrl,
      zoomPassword: result.password,
      zoomMeetingCreated: true,
      emailsSent: result.emailsSent,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(bookingRef, updateData, { merge: true });
    console.log('✅ Booking updated with Zoom details');
    
    return NextResponse.json({ 
      received: true, 
      bookingId: bookingId,
      zoomMeetingId: result.meetingId,
      emailsSent: result.emailsSent
    });
    
  } catch (error: any) {
    console.error('❌ FAILED to create Zoom meeting or send emails:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Update booking with error info
    await setDoc(bookingRef, {
      zoomMeetingCreated: false,
      zoomMeetingError: error.message,
      emailsSent: false,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Return success to Stripe (don't retry) but log the error
    return NextResponse.json({ 
      received: true, 
      error: error.message,
      bookingId: bookingId 
    });
  }
}

async function handleCheckoutSessionExpired(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('⏰ Handling expired session:', session.id);
  
  if (!session.metadata?.bookingId) {
    return NextResponse.json({ received: true });
  }
  
  const bookingRef = doc(db, 'bookings', session.metadata.bookingId);
  
  try {
    const docSnap = await getDoc(bookingRef);
    if (docSnap.exists()) {
      await setDoc(bookingRef, {
        paymentStatus: 'expired',
        stripeSessionId: session.id,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`✅ Marked booking ${session.metadata.bookingId} as expired`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error updating expired booking:', error);
    return NextResponse.json({ received: true });
  }
}

// Direct function to create Zoom meeting and send emails (no HTTP calls)
async function createZoomMeetingDirectly(bookingData: any) {
  console.log('🔄 Creating Zoom meeting directly...');
  
  try {
    // Create Zoom meeting
    const meetingData = await createZoomMeeting(bookingData);
    console.log('✅ Zoom meeting created:', meetingData.id);
    
    // Send emails
    let emailsSent = false;
    try {
      await sendConfirmationEmails(bookingData, meetingData);
      emailsSent = true;
      console.log('✅ Emails sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send emails:', emailError);
    }
    
    return {
      meetingId: meetingData.id,
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url,
      password: meetingData.password,
      emailsSent: emailsSent
    };
    
  } catch (error) {
    console.error('❌ Error in createZoomMeetingDirectly:', error);
    throw error;
  }
}

// Zoom meeting creation function (copy from your booking route)
async function createZoomMeeting(bookingData: any) {
  console.log('🔄 Getting Zoom access token...');
  
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    throw new Error('Missing Zoom credentials in environment variables');
  }

  // Get access token
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
    const error = await tokenResponse.text();
    throw new Error(`Failed to get Zoom access token: ${error}`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  
  console.log('✅ Zoom access token obtained');

  // Parse date and time
  const baseDate = new Date(bookingData.date + 'T00:00:00');
  const [time, modifier] = bookingData.time.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  baseDate.setHours(hours, minutes, 0, 0);

  const meetingData = {
    topic: `${bookingData.service} - ${bookingData.customerName}`,
    type: 2,
    start_time: baseDate.toISOString(),
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

  console.log('🔄 Creating Zoom meeting with data:', meetingData);

  const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  });

  if (!meetingResponse.ok) {
    const error = await meetingResponse.text();
    console.error('❌ Zoom API error:', error);
    throw new Error(`Failed to create Zoom meeting: ${error}`);
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

// Email sending function
async function sendConfirmationEmails(bookingData: any, meetingData: any) {
  console.log('📧 Sending confirmation emails...');
  
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const adminMailOptions = {
    from: {
      name: 'JAGADGURU Booking System',
      address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    },
    to: process.env.EMAIL_USER,
    subject: `🆕 New Booking: ${bookingData.customerName} - ${bookingData.service}`,
    html: generateAdminEmailContent(bookingData, meetingData),
  };

  const customerMailOptions = {
    from: {
      name: 'JAGADGURU',
      address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    },
    to: bookingData.customerEmail,
    subject: `✅ Meeting Confirmed: ${bookingData.service} on ${new Date(bookingData.date).toLocaleDateString()}`,
    html: generateCustomerEmailContent(bookingData, meetingData),
  };

  await Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(customerMailOptions),
  ]);
  
  console.log('✅ All emails sent successfully');
}

// Email template functions (simplified versions)
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