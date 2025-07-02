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
  console.log('🔍 Request URL:', request.url);
  console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    
    console.log('🔍 Body length:', body.length);
    console.log('🔍 Signature present:', !!sig);
    console.log('🔍 Webhook secret configured:', !!endpointSecret);
    
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
      console.log('🔍 Event ID:', event.id);
      console.log('🔍 Event created:', new Date(event.created * 1000).toISOString());
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
  console.log('🔍 Session payment_status:', session.payment_status);
  console.log('🔍 Session customer_email:', session.customer_email);
  console.log('🔍 Session amount_total:', session.amount_total);
  console.log('🔍 Session metadata exists:', !!session.metadata);
  console.log('🔍 Session metadata:', JSON.stringify(session.metadata, null, 2));
  
  // Check if metadata exists and has bookingId
  if (!session.metadata || !session.metadata.bookingId) {
    console.error('❌ Missing bookingId in session metadata');
    console.log('❌ Available metadata:', session.metadata);
    
    // Try to get session details from Stripe API directly
    try {
      console.log('🔄 Fetching session details from Stripe API...');
      const stripeSession = await stripe.checkout.sessions.retrieve(session.id);
      console.log('🔍 Stripe API session metadata:', stripeSession.metadata);
    } catch (apiError) {
      console.error('❌ Failed to fetch from Stripe API:', apiError);
    }
    
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

  // Prepare booking data with extensive logging
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
    zoomMeetingCreated: false,
    emailsSent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log('📋 Complete booking data prepared:');
  console.log(JSON.stringify(bookingData, null, 2));

  // Test Firebase connection first
  console.log('🔧 Testing Firebase connection...');
  try {
    const testCollection = db.collection('test');
    const testDoc = await testCollection.add({ test: true, timestamp: new Date().toISOString() });
    console.log('✅ Firebase connection works. Test doc ID:', testDoc.id);
    
    // Clean up test doc
    await testDoc.delete();
    console.log('✅ Test doc cleaned up');
  } catch (firebaseError: any) {
    console.error('❌ Firebase connection failed:', firebaseError);
    console.error('❌ Firebase error message:', firebaseError.message);
    console.error('❌ Firebase error code:', firebaseError.code);
    return NextResponse.json({ 
      error: 'Firebase connection failed', 
      details: firebaseError.message 
    }, { status: 500 });
  }

  // Save initial booking to Firestore using Firebase Admin
  console.log('💾 ===== SAVING TO FIRESTORE =====');
  console.log('💾 Collection: bookings');
  console.log('💾 Document ID:', bookingId);
  
  try {
    const bookingRef = db.collection('bookings').doc(bookingId);
    console.log('💾 Booking reference created');
    
    // First, check if document already exists
    const existingDoc = await bookingRef.get();
    console.log('💾 Document exists check:', existingDoc.exists);
    if (existingDoc.exists) {
      console.log('💾 Existing document data:', existingDoc.data());
    }
    
    console.log('💾 About to save booking data...');
    const writeResult = await bookingRef.set(bookingData, { merge: true });
    console.log('💾 Write result:', writeResult);
    console.log('✅ Initial booking saved to Firestore with stripeSessionId:', session.id);
    
    // Immediately verify the save by reading it back
    console.log('🔍 Verifying save by reading document back...');
    const savedDoc = await bookingRef.get();
    if (savedDoc.exists) {
      const savedData = savedDoc.data();
      console.log('✅ Document saved successfully!');
      console.log('🔍 Saved stripeSessionId:', savedData?.stripeSessionId);
      console.log('🔍 Saved customerName:', savedData?.customerName);
      console.log('🔍 Saved service:', savedData?.service);
      console.log('🔍 Full saved data:');
      console.log(JSON.stringify(savedData, null, 2));
    } else {
      console.error('❌ Document was not saved - cannot read it back!');
      return NextResponse.json({ 
        error: 'Document save verification failed' 
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Failed to save initial booking:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    
    // Try to get more specific Firebase error info
    if (error.code) {
      console.error('❌ Firebase error code:', error.code);
    }
    if (error.details) {
      console.error('❌ Firebase error details:', error.details);
    }
    
    return NextResponse.json({ 
      error: 'Failed to save booking', 
      details: error.message,
      code: error.code || 'unknown'
    }, { status: 500 });
  }

  // Skip Zoom and email for now - focus on the Firebase save issue
  console.log('⏭️ Skipping Zoom and email creation to focus on Firebase issue');

  console.log('✅ ===== WEBHOOK PROCESSING COMPLETE =====');
  return NextResponse.json({ 
    received: true, 
    bookingId: bookingId,
    stripeSessionId: session.id,
    message: 'Booking saved successfully to Firebase',
    timestamp: new Date().toISOString()
  });
}

async function handleCheckoutSessionExpired(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('⏰ Handling expired session:', session.id);
  
  // Safe metadata access
  if (!session.metadata || !session.metadata.bookingId) {
    console.log('⏰ No metadata in expired session, skipping');
    return NextResponse.json({ received: true });
  }
  
  try {
    const bookingRef = db.collection('bookings').doc(session.metadata.bookingId);
    const doc = await bookingRef.get();
    
    if (doc.exists) {
      await bookingRef.update({
        paymentStatus: 'expired',
        stripeSessionId: session.id,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Marked booking ${session.metadata.bookingId} as expired`);
    } else {
      console.log(`⚠️ Booking ${session.metadata.bookingId} not found for expiration`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error updating expired booking:', error);
    return NextResponse.json({ received: true });
  }
}