// Test script to verify Stripe API connection
require('dotenv').config({ path: '.env.local' });

const Stripe = require('stripe');

async function testStripe() {
  try {
    console.log('🔍 Testing Stripe API connection...');
    
    // Check if Stripe secret key is set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is not set in .env.local');
      return;
    }
    
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10', // Use the latest API version
    });
    
    // Test API connection by listing customers (limited to 1 for testing)
    console.log('🔑 Testing Stripe API with secret key...');
    const customers = await stripe.customers.list({ limit: 1 });
    
    console.log('✅ Stripe API connection successful!');
    console.log(`🔹 API Version: ${stripe.getApiField('version')}`);
    console.log(`🔹 Test Mode: ${process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'Yes' : 'No'}`);
    console.log(`🔹 Customers found: ${customers.data.length}`);
    
    // Test webhook signature verification
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('\n🔐 Webhook secret is set');
    } else {
      console.log('\n⚠️  STRIPE_WEBHOOK_SECRET is not set');
    }
    
  } catch (error) {
    console.error('❌ Stripe API test failed:');
    console.error(error);
    
    if (error.raw && error.raw.message) {
      console.error('\nStripe Error Details:');
      console.error(`- Type: ${error.type}`);
      console.error(`- Code: ${error.code || 'N/A'}`);
      console.error(`- Message: ${error.raw.message}`);
      
      if (error.raw.param) {
        console.error(`- Parameter: ${error.raw.param}`);
      }
    }
  }
}

testStripe();
