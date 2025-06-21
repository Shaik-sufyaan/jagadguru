import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'set' : 'missing',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ? 'set' : 'missing',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'set' : 'missing',
    zoomClientId: process.env.ZOOM_CLIENT_ID ? 'set' : 'missing',
    zoomAccountId: process.env.ZOOM_ACCOUNT_ID ? 'set' : 'missing'
  });
}
