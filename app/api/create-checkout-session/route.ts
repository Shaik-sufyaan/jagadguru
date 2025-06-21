// app/api/create-checkout-session/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔵 Creating checkout session with data:', body);

    // Validate required fields
    const requiredFields = ['name', 'email', 'service', 'date', 'time', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate unique booking ID
    const bookingId = uuidv4();
    console.log('📝 Generated booking ID:', bookingId);

    // Format the date properly (ensure it's YYYY-MM-DD format)
    let formattedDate = body.date;
    if (body.date.includes('T')) {
      // If it's an ISO string, extract just the date part
      formattedDate = body.date.split('T')[0];
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: body.service,
              description: `Consultation scheduled for ${formattedDate} at ${body.time}`,
            },
            unit_amount: Math.round(body.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      customer_email: body.email,
      metadata: {
        // All the booking data needed for the webhook
        bookingId: bookingId,
        customer_name: body.name,
        customer_email: body.email,
        customer_phone: body.phone || '',
        service: body.service,
        service_id: body.serviceId || '',
        date: formattedDate, // Use formatted date
        time: body.time,
        duration: body.duration?.toString() || '30',
        timezone: body.timezone || 'America/New_York',
        message: body.message || '',
        currency: body.currency || 'USD',
      },
      // Add webhook metadata to session for easier debugging
      payment_intent_data: {
        metadata: {
          bookingId: bookingId,
          service: body.service,
        }
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      bookingId: bookingId,
      metadata: session.metadata
    });

    return NextResponse.json({
      sessionId: session.id,
      bookingId: bookingId,
      url: session.url
    });

  } catch (error: any) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error.message 
      },
      { status: 500 }
    );
  }
}