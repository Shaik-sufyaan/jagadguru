// Test script to verify Zoom API connection
import { NextResponse } from 'next/server';

async function testZoomConnection() {
  try {
    console.log('🔍 Testing Zoom API connection...');
    
    // Test environment variables
    const requiredVars = [
      'ZOOM_CLIENT_ID',
      'ZOOM_CLIENT_SECRET',
      'ZOOM_ACCOUNT_ID'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`- ${varName}`));
      console.log('\nPlease add these to your .env.local file and restart your server.');
      return;
    }
    
    console.log('✅ All required environment variables are present');
    
    // Test getting access token
    console.log('\n🔑 Testing Zoom OAuth token retrieval...');
    const accessToken = await getZoomAccessToken();
    console.log('✅ Successfully retrieved Zoom access token');
    
    // Test creating a meeting
    console.log('\n📅 Testing Zoom meeting creation...');
    const testMeeting = {
      bookingId: 'test-' + Date.now(),
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time: '02:00 PM',
      service: 'Test Service',
      duration: '30',
      timezone: 'America/New_York'
    };
    
    const meeting = await createZoomMeeting(testMeeting);
    console.log('✅ Successfully created Zoom meeting:');
    console.log({
      id: meeting.id,
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      password: meeting.password
    });
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

async function getZoomAccessToken() {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    throw new Error('Missing Zoom credentials in environment variables');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: accountId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Zoom access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function createZoomMeeting(bookingData: any) {
  const accessToken = await getZoomAccessToken();
  const [time, modifier] = bookingData.time.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  
  const startTime = new Date(bookingData.date);
  startTime.setHours(hours, minutes, 0, 0);

  const meetingData = {
    topic: `${bookingData.service} - ${bookingData.customerName}`,
    type: 2, // Scheduled meeting
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

  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meetingData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Zoom meeting: ${error}`);
  }

  return await response.json();
}

// Run the test
testZoomConnection();
