// app/api/booking-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

    // Query Firebase for booking with matching Stripe session ID
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('stripe_session_id', '==', sessionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get the first (and should be only) matching document
    const bookingDoc = querySnapshot.docs[0];
    const bookingData = bookingDoc.data();

    // Return the booking details
    return NextResponse.json({
      id: bookingDoc.id,
      ...bookingData,
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}