// Test script to verify Stripe webhook
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const crypto = require('crypto');

// Test data for the webhook
const testEvent = {
  id: 'evt_test_' + Date.now(),
  object: 'event',
  api_version: '2025-05-28.basil',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_' + Date.now(),
      object: 'checkout.session',
      payment_status: 'paid',
      customer_details: {
        email: 'test@example.com',
        name: 'Test User'
      },
      metadata: {
        bookingId: 'test-booking-' + Date.now(),
        customer_name: 'Test User',
        customer_email: 'test@example.com',
        service: 'Test Service',
        date: '2025-06-22',
        time: '02:00 PM',
        duration: '30',
        timezone: 'America/New_York'
      },
      amount_total: 1000,
      currency: 'usd'
    }
  },
  type: 'checkout.session.completed'
};

async function testWebhook() {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const webhookUrl = 'http://localhost:3000/api/webhook';

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not set in .env.local');
      return;
    }

    console.log('🔍 Testing webhook endpoint:', webhookUrl);
    
    // Create the signature
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify(testEvent);
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': `t=${timestamp},v1=${signature},v0=test`
      },
      body: payload
    });

    const responseText = await response.text();
    console.log(`\n📤 Response status: ${response.status} ${response.statusText}`);
    console.log('📝 Response body:', responseText);

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    console.log('✅ Webhook test completed successfully');
  } catch (error) {
    console.error('❌ Webhook test failed:');
    console.error(error);
  }
}

testWebhook();
