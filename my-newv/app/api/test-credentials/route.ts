// app/api/test-credentials/route.ts
import { NextRequest, NextResponse } from 'next/server';

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
}

export const runtime = 'nodejs';

export async function GET() {
  console.log('🧪 Testing credentials...');
  
  const results = {
    timestamp: new Date().toISOString(),
    zoom: { status: 'unknown', message: '' },
    email: { status: 'unknown', message: '' },
    firebase: { status: 'unknown', message: '' },
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

  // Test Email credentials - FIXED TYPO
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
      
      // FIXED: createTransport (not createTransporter)
      const transporter = nodemailer.createTransport({
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

  // Test Firebase Admin credentials
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      results.firebase = { 
        status: 'error', 
        message: 'Missing Firebase Admin environment variables' 
      };
    } else {
      console.log('🔄 Testing Firebase Admin connection...');
      console.log('🔍 Private key preview:', privateKey.substring(0, 50) + '...');
      
      try {
        const { db } = await import('@/lib/firebase-admin');
        
        // Test a simple operation
        await db.collection('test').limit(1).get();
        
        results.firebase = { 
          status: 'success', 
          message: 'Firebase Admin credentials are valid' 
        };
        console.log('✅ Firebase Admin working');
      } catch (error: any) {
        results.firebase = { 
          status: 'error', 
          message: `Firebase Admin error: ${error.message}` 
        };
        console.error('❌ Firebase Admin failed:', error);
      }
    }
  } catch (error: any) {
    results.firebase = { 
      status: 'error', 
      message: `Firebase test error: ${error.message}` 
    };
    console.error('❌ Firebase test exception:', error);
  }

  // Check environment variables (without exposing secrets)
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    
    // Firebase Client (Frontend)
    NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    
    // Firebase Admin (Backend)  
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    
    // Stripe
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    
    // Zoom
    ZOOM_CLIENT_ID: !!process.env.ZOOM_CLIENT_ID,
    ZOOM_CLIENT_SECRET: !!process.env.ZOOM_CLIENT_SECRET,
    ZOOM_ACCOUNT_ID: !!process.env.ZOOM_ACCOUNT_ID,
    
    // Email
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: !!process.env.EMAIL_APP_PASSWORD,
    
    // App
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT_SET',
    
    // Debug info
    privateKeyFormat: {
      hasQuotes: process.env.FIREBASE_PRIVATE_KEY?.includes('"'),
      hasEscapedSlashes: process.env.FIREBASE_PRIVATE_KEY?.includes('\\\\'),
      startsCorrectly: process.env.FIREBASE_PRIVATE_KEY?.startsWith('-----BEGIN'),
      length: process.env.FIREBASE_PRIVATE_KEY?.length || 0
    }
  };

  return NextResponse.json({
    ...results,
    environmentVariables: envCheck
  });
}