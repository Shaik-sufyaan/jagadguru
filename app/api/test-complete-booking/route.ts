// Create this file: app/api/test-complete-booking/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  console.log('🧪 ===== TESTING COMPLETE BOOKING FLOW =====');
  
  try {
    const body = await request.json();
    const testEmail = body.email || 'test@example.com'; // Allow custom email for testing
    
    // Simulate the exact data structure from webhook
    const testBookingData = {
      bookingId: 'test-booking-' + Date.now(),
      customerName: body.name || 'Test User',
      customerEmail: testEmail,
      customerPhone: body.phone || '+1234567890',
      service: 'Test Consultation',
      serviceId: 'test-service',
      date: body.date || '2024-12-25', // Use future date
      time: body.time || '2:00 PM',
      duration: '30',
      timezone: 'America/New_York',
      message: 'This is a test booking from API',
      paymentStatus: 'completed',
      stripeSessionId: 'test_session_' + Date.now(),
      amountPaid: 100,
      currency: 'usd',
      status: 'confirmed',
      zoomMeetingCreated: false,
      emailsSent: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log('📝 Test booking data:', testBookingData);

    // Step 1: Save to Firestore
    console.log('💾 Step 1: Saving to Firestore...');
    const bookingRef = doc(db, 'bookings', testBookingData.bookingId);
    await setDoc(bookingRef, testBookingData, { merge: true });
    console.log('✅ Saved to Firestore');

    // Step 2: Create Zoom meeting
    console.log('🎥 Step 2: Creating Zoom meeting...');
    const meetingData = await createZoomMeeting(testBookingData);
    console.log('✅ Zoom meeting created:', meetingData.id);

    // Step 3: Send emails
    console.log('📧 Step 3: Sending emails...');
    let emailsSent = false;
    try {
      await sendConfirmationEmails(testBookingData, meetingData);
      emailsSent = true;
      console.log('✅ Emails sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }

    // Step 4: Update Firestore with results
    console.log('💾 Step 4: Updating Firestore with results...');
    const updateData = {
      zoomMeetingId: meetingData.id,
      zoomJoinUrl: meetingData.join_url,
      zoomStartUrl: meetingData.start_url,
      zoomPassword: meetingData.password,
      zoomMeetingCreated: true,
      emailsSent: emailsSent,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(bookingRef, updateData, { merge: true });
    console.log('✅ Firestore updated with results');

    console.log('🎉 ===== TEST COMPLETED SUCCESSFULLY =====');

    return NextResponse.json({
      success: true,
      message: 'Complete booking test successful',
      bookingId: testBookingData.bookingId,
      zoomMeeting: {
        id: meetingData.id,
        join_url: meetingData.join_url,
        password: meetingData.password
      },
      emailsSent: emailsSent,
      testData: testBookingData
    });

  } catch (error: any) {
    console.error('❌ ===== TEST FAILED =====');
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Zoom meeting creation function
async function createZoomMeeting(bookingData: any) {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    throw new Error('Missing Zoom credentials');
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
    throw new Error(`Failed to create Zoom meeting: ${error}`);
  }

  const meeting = await meetingResponse.json();

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
    subject: `🧪 TEST - New Booking: ${bookingData.customerName} - ${bookingData.service}`,
    html: generateAdminEmailContent(bookingData, meetingData),
  };

  const customerMailOptions = {
    from: {
      name: 'JAGADGURU',
      address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    },
    to: bookingData.customerEmail,
    subject: `🧪 TEST - Meeting Confirmed: ${bookingData.service} on ${new Date(bookingData.date).toLocaleDateString()}`,
    html: generateCustomerEmailContent(bookingData, meetingData),
  };

  console.log('📧 Sending emails to:', {
    admin: process.env.EMAIL_USER,
    customer: bookingData.customerEmail
  });

  await Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(customerMailOptions),
  ]);
}

// Email templates (simplified)
function generateAdminEmailContent(bookingData: any, meetingData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">🧪 TEST - New Booking Request</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <p><strong>👤 Name:</strong> ${bookingData.customerName}</p>
        <p><strong>✉️ Email:</strong> ${bookingData.customerEmail}</p>
        <p><strong>📞 Phone:</strong> ${bookingData.customerPhone}</p>
        <p><strong>🔧 Service:</strong> ${bookingData.service}</p>
        <p><strong>📅 Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> ${bookingData.time}</p>
        <p><strong>🆔 Booking ID:</strong> ${bookingData.bookingId}</p>
      </div>
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 15px;">
        <h3 style="color: #1976d2;">🎥 Zoom Meeting Details</h3>
        <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
        <p><strong>Password:</strong> ${meetingData.password}</p>
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
      <title>🧪 TEST - Booking Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center;">
        <h1>🧪 TEST - Booking Confirmed!</h1>
        <p>This is a test email for your consultation booking</p>
      </div>
      <div style="padding: 30px;">
        <h2>Hello ${bookingData.customerName},</h2>
        <p>This is a test email. Your Zoom meeting has been created successfully!</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📅 Appointment Details</h3>
          <p><strong>Service:</strong> ${bookingData.service}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingData.time}</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🎥 Zoom Meeting Information</h3>
          <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
          <p><strong>Password:</strong> ${meetingData.password}</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${meetingData.join_url}" style="display: inline-block; background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">🎥 Join Zoom Meeting</a>
          </div>
        </div>

        <p><strong>Best regards,<br>The JAGADGURU Team</strong></p>
      </div>
    </body>
    </html>
  `;
}

