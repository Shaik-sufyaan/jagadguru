// app/api/test-firebase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('🔄 Test 1: Basic connection test');
    const testRef = db.collection('test-connection');
    const testDoc = await testRef.add({
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test'
    });
    console.log('✅ Test 1 passed: Document created with ID:', testDoc.id);
    
    // Test 2: Read it back
    console.log('🔄 Test 2: Reading document back');
    const retrievedDoc = await testDoc.get();
    if (retrievedDoc.exists) {
      console.log('✅ Test 2 passed: Document retrieved:', retrievedDoc.data());
    } else {
      console.error('❌ Test 2 failed: Document not found');
    }
    
    // Test 3: Update it
    console.log('🔄 Test 3: Updating document');
    await testDoc.update({
      updated: true,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Test 3 passed: Document updated');
    
    // Test 4: Test bookings collection specifically
    console.log('🔄 Test 4: Testing bookings collection');
    const bookingRef = db.collection('bookings').doc('test-booking-' + Date.now());
    const testBookingData = {
      bookingId: 'test-123',
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      service: 'Test Service',
      date: '2025-07-15',
      time: '2:00 PM',
      stripeSessionId: 'cs_test_12345',
      paymentStatus: 'completed',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await bookingRef.set(testBookingData);
    console.log('✅ Test 4 passed: Booking document created');
    
    // Test 5: Query the booking
    console.log('🔄 Test 5: Querying booking by stripeSessionId');
    const query = await db.collection('bookings')
      .where('stripeSessionId', '==', 'cs_test_12345')
      .get();
    
    if (!query.empty) {
      console.log('✅ Test 5 passed: Query found documents:', query.size);
      query.forEach(doc => {
        console.log('📄 Found document:', doc.id, doc.data());
      });
    } else {
      console.error('❌ Test 5 failed: No documents found in query');
    }
    
    // Clean up test documents
    console.log('🧹 Cleaning up test documents...');
    await testDoc.delete();
    await bookingRef.delete();
    console.log('✅ Cleanup complete');
    
    return NextResponse.json({
      success: true,
      message: 'All Firebase tests passed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Firebase test failed:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.stack
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🧪 Testing specific booking save scenario...');
  
  try {
    const body = await request.json();
    const testSessionId = body.sessionId || 'cs_test_' + Date.now();
    const testBookingId = body.bookingId || 'test-booking-' + Date.now();
    
    console.log('🔄 Testing with sessionId:', testSessionId);
    console.log('🔄 Testing with bookingId:', testBookingId);
    
    // Simulate exact webhook scenario
    const bookingData = {
      bookingId: testBookingId,
      customerName: body.customerName || 'Test Customer',
      customerEmail: body.customerEmail || 'test@example.com',
      customerPhone: body.customerPhone || '',
      service: body.service || 'Test Consultation',
      serviceId: body.serviceId || 'test-service',
      date: body.date || '2025-07-15',
      time: body.time || '2:00 PM',
      duration: body.duration || '30',
      timezone: body.timezone || 'America/New_York',
      message: body.message || 'Test booking',
      paymentStatus: 'completed',
      stripeSessionId: testSessionId, // This is the key field!
      amountPaid: body.amountPaid || 100,
      currency: body.currency || 'usd',
      status: 'confirmed',
      zoomMeetingCreated: false,
      emailsSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('📋 Saving test booking data:');
    console.log(JSON.stringify(bookingData, null, 2));
    
    // Save to bookings collection
    const bookingRef = db.collection('bookings').doc(testBookingId);
    await bookingRef.set(bookingData, { merge: true });
    console.log('✅ Test booking saved');
    
    // Verify save
    const savedDoc = await bookingRef.get();
    if (savedDoc.exists) {
      const savedData = savedDoc.data();
      console.log('✅ Verification successful');
      console.log('🔍 Saved stripeSessionId:', savedData?.stripeSessionId);
      
      // Test the query that the success page uses
      console.log('🔄 Testing success page query...');
      const query = await db.collection('bookings')
        .where('stripeSessionId', '==', testSessionId)
        .get();
      
      if (!query.empty) {
        console.log('✅ Success page query would work! Found:', query.size, 'documents');
        query.forEach(doc => {
          console.log('📄 Query result:', doc.id, {
            stripeSessionId: doc.data().stripeSessionId,
            customerName: doc.data().customerName,
            service: doc.data().service
          });
        });
      } else {
        console.error('❌ Success page query would fail - no documents found');
      }
      
      return NextResponse.json({
        success: true,
        message: 'Test booking scenario successful',
        bookingId: testBookingId,
        stripeSessionId: testSessionId,
        queryWorks: !query.empty,
        savedData: savedData
      });
      
    } else {
      console.error('❌ Document was not saved!');
      return NextResponse.json({
        success: false,
        error: 'Document was not saved'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Test booking scenario failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}