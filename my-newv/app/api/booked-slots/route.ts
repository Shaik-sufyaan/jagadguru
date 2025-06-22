// app/api/booked-slots/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get('date');
    if (!date) {
      return NextResponse.json(
        { error: 'Missing date parameter' },
        { status: 400 }
      );
    }

    // Query Firestore for bookings on the given date
    const bookingsRef = db.collection('bookings');
    const snapshot = await bookingsRef
      .where('date', '==', date)
      .get();

    const bookedSlots: string[] = [];
    snapshot.forEach(doc => {
      const bookingData = doc.data();
      if (bookingData.time) {
        bookedSlots.push(bookingData.time);
      }
    });

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}