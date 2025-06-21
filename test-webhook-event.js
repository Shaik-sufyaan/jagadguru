require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');
const fetch = require('node-fetch');

// Configuration
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const WEBHOOK_URL = 'http://localhost:3000/api/webhook';

if (!WEBHOOK_SECRET) {
  console.error('❌ STRIPE_WEBHOOK_SECRET is not set in .env.local');
  process.exit(1);
}

// Create a test checkout.session.completed event
const testEvent = {
  id: 'evt_test_' + Math.random().toString(36).substring(2, 15),
  object: 'event',
  api_version: '2024-04-10',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
      object: 'checkout.session',
      amount_subtotal: 1000,
      amount_total: 1000,
      currency: 'usd',
      customer: 'cus_test_' + Math.random().toString(36).substring(2, 15),
      customer_email: 'test@example.com',
      customer_details: {
        email: 'test@example.com',
        name: 'Test User'
      },
      metadata: {
        bookingId: 'test_booking_' + Math.random().toString(36).substring(2, 10),
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        date: '2025-06-22',
        time: '14:00',
        service: 'Consultation',
        duration: '30',
        timezone: 'America/New_York'
      },
      payment_status: 'paid',
      status: 'complete',
      payment_intent: 'pi_test_' + Math.random().toString(36).substring(2, 15),
      subscription: null
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_' + Math.random().toString(36).substring(2, 15),
    idempotency_key: null
  },
  type: 'checkout.session.completed'
};

// Generate Stripe signature
function generateStripeSignature(payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload, 'utf8')
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

// Send test webhook event
async function sendTestWebhook() {
  try {
    console.log('🚀 Sending test webhook event...');
    console.log(`🔗 Webhook URL: ${WEBHOOK_URL}`);
    
    const signature = generateStripeSignature(testEvent);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': signature
      },
      body: JSON.stringify(testEvent)
    });
    
    const responseData = await response.text();
    
    console.log('📤 Webhook response:');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('Body:', responseData);
    
    if (!response.ok) {
      console.error('❌ Webhook request failed');
    } else {
      console.log('✅ Webhook sent successfully!');
    }
  } catch (error) {
    console.error('❌ Error sending webhook:');
    console.error(error);
  }
}

// Run the test
sendTestWebhook();
