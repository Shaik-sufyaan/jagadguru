// Create this file: app/api/test-credentials/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing credentials...');
  
  const results = {
    timestamp: new Date().toISOString(),
    zoom: { status: 'unknown', message: '' },
    email: { status: 'unknown', message: '' },
    environment: process.env.NODE_ENV
  };

  // Test Zoom credentials
  try {
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const accountId = process.env.ZOOM_ACCOUNT_ID;

    if (!clientId || !clientSecret || !accountId) {
      results.zoom = { 
        status: 'error', 
        message: 'Missing Zoom environment variables' 
      };
    } else {
      console.log('🔄 Testing Zoom token...');
      
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const response = await fetch('https://zoom.us/oauth/token', {
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

      if (response.ok) {
        results.zoom = { 
          status: 'success', 
          message: 'Zoom credentials are valid' 
        };
        console.log('✅ Zoom credentials working');
      } else {
        const error = await response.text();
        results.zoom = { 
          status: 'error', 
          message: `Zoom API error: ${error}` 
        };
        console.error('❌ Zoom credentials failed:', error);
      }
    }
  } catch (error: any) {
    results.zoom = { 
      status: 'error', 
      message: `Zoom test error: ${error.message}` 
    };
    console.error('❌ Zoom test exception:', error);
  }

  // Test Email credentials
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass) {
      results.email = { 
        status: 'error', 
        message: 'Missing email environment variables' 
      };
    } else {
      console.log('🔄 Testing email connection...');
      
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      // Verify the transporter
      await transporter.verify();
      
      results.email = { 
        status: 'success', 
        message: 'Email credentials are valid' 
      };
      console.log('✅ Email credentials working');
    }
  } catch (error: any) {
    results.email = { 
      status: 'error', 
      message: `Email test error: ${error.message}` 
    };
    console.error('❌ Email test failed:', error);
  }

  // Check environment variables (without exposing secrets)
  const envCheck = {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    ZOOM_CLIENT_ID: !!process.env.ZOOM_CLIENT_ID,
    ZOOM_CLIENT_SECRET: !!process.env.ZOOM_CLIENT_SECRET,
    ZOOM_ACCOUNT_ID: !!process.env.ZOOM_ACCOUNT_ID,
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: !!process.env.EMAIL_APP_PASSWORD,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT_SET'
  };

  console.log('🔍 Environment variables check:', envCheck);

  return NextResponse.json({
    ...results,
    environmentVariables: envCheck
  });
}