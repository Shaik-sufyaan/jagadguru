// app/api/booking-details/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking for booking with session ID:', sessionId);

    // Query Firebase Admin for booking with matching Stripe session ID
    // Use the correct field name that matches your webhook
    const snapshot = await db.collection('bookings')
      .where('stripeSessionId', '==', sessionId)  // Changed from 'stripe_session_id' to 'stripeSessionId'
      .get();

    if (snapshot.empty) {
      console.log('❌ No booking found with session ID:', sessionId);
      
      // Let's also try to check if any bookings exist at all for debugging
      const allBookingsSnapshot = await db.collection('bookings').limit(5).get();
      console.log('📊 Total bookings in database:', allBookingsSnapshot.size);
      
      if (!allBookingsSnapshot.empty) {
        const sampleBooking = allBookingsSnapshot.docs[0].data();
        console.log('📋 Sample booking fields:', Object.keys(sampleBooking));
        console.log('📋 Sample stripeSessionId:', sampleBooking.stripeSessionId);
      }
      
      return NextResponse.json(
        { error: 'Booking not found for this session' },
        { status: 404 }
      );
    }

    // Get the first (and should be only) matching document
    const bookingDoc = snapshot.docs[0];
    const bookingData = bookingDoc.data();

    console.log('✅ Booking found:', bookingDoc.id);

    // Format the data to match what your success page expects
    const formattedData = {
      id: bookingDoc.id,
      bookingId: bookingData.bookingId || bookingDoc.id,
      name: bookingData.customerName || bookingData.name,
      email: bookingData.customerEmail || bookingData.email,
      phone: bookingData.customerPhone || bookingData.phone || '',
      service: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration || '30',
      timezone: bookingData.timezone || 'America/New_York',
      message: bookingData.message || '',
      price: bookingData.amountPaid || 0,
      displayPrice: bookingData.amountPaid ? `$${bookingData.amountPaid.toFixed(2)}` : 'N/A',
      currency: bookingData.currency || 'usd',
      paymentStatus: bookingData.paymentStatus,
      status: bookingData.status,
      stripeSessionId: bookingData.stripeSessionId,
      zoomMeetingId: bookingData.zoomMeetingId,
      zoomJoinUrl: bookingData.zoomJoinUrl,
      zoomMeetingCreated: bookingData.zoomMeetingCreated || false,
      emailsSent: bookingData.emailsSent || false,
      createdAt: bookingData.createdAt,
      updatedAt: bookingData.updatedAt,
      // Include original data for debugging
      _original: bookingData
    };

    return NextResponse.json(formattedData);

  } catch (error: any) {
    console.error('❌ Error fetching booking details:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}