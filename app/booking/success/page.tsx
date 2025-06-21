// app/booking/success/page.tsx
"use client"

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BookingSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

// app/booking/success/page.tsx
useEffect(() => {
  const confirmBooking = async () => {
    if (!sessionId || !bookingId) return;
    
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        paymentStatus: 'completed',
        status: 'confirmed'
      });
      
      console.log('Booking confirmed successfully');
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  confirmBooking();
}, [sessionId, bookingId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your consultation has been booked successfully. You'll receive a confirmation email with the Zoom link shortly.
        </p>
        <div className="space-y-3">
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full">
              Return to Home
            </Button>
          </Link>
          <Link href="/schedule">
            <Button variant="outline" className="w-full border-gray-300">
              Book Another Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}