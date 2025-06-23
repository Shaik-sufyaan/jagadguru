// app/api/firebase-debug/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const projectId = process.env.FIREBASE_PROJECT_ID || '';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

  const results: any = {
    timestamp: new Date().toISOString(),
    firebaseVariables: {
      FIREBASE_PROJECT_ID: {
        exists: !!projectId,
        value: projectId || 'MISSING',
        length: projectId.length
      },
      FIREBASE_CLIENT_EMAIL: {
        exists: !!clientEmail,
        value: clientEmail || 'MISSING',
        isValidFormat: clientEmail.includes('@') && clientEmail.includes('.iam.gserviceaccount.com')
      },
      FIREBASE_PRIVATE_KEY: {
        exists: !!privateKey,
        length: privateKey.length,
        startsCorrectly: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
        endsCorrectly:
          privateKey.endsWith('-----END PRIVATE KEY-----\\n') ||
          privateKey.endsWith('-----END PRIVATE KEY-----\n'),
        hasEscapedNewlines: privateKey.includes('\\n'),
        preview: privateKey ? privateKey.substring(0, 50) + '...' : 'NO_KEY'
      }
    },
    firebaseTest: {
      status: 'unknown',
      message: '',
      details: null
    }
  };

  if (!projectId || !clientEmail || !privateKey) {
    results.firebaseTest = {
      status: 'error',
      message: 'Missing required environment variables',
      details: {
        missingVars: [
          !projectId ? 'FIREBASE_PROJECT_ID' : null,
          !clientEmail ? 'FIREBASE_CLIENT_EMAIL' : null,
          !privateKey ? 'FIREBASE_PRIVATE_KEY' : null
        ].filter(Boolean)
      }
    };
    return NextResponse.json(results, { status: 200 });
  }

  try {
    const admin = require('firebase-admin');

    if (admin.apps.length === 0) {
      const cleanPrivateKey = privateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: cleanPrivateKey
        })
      });
    }

    const db = admin.firestore();
    await db.collection('test').limit(1).get();

    results.firebaseTest = {
      status: 'success',
      message: 'Firebase Admin credentials are valid',
      details: {
        appCount: admin.apps.length
      }
    };
  } catch (err: any) {
    console.error('❌ Firebase Admin test failed:', err);

    results.firebaseTest = {
      status: 'error',
      message: `Firebase Admin error: ${err.message || 'Unknown error'}`,
      details: {
        errorType: err.constructor?.name || 'Unknown',
        stack: err.stack ? err.stack.split('\n').slice(0, 5) : ['No stack trace']
      }
    };
  }

  return NextResponse.json(results, { status: 200 });
}
