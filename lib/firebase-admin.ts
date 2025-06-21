import admin from 'firebase-admin'

// Improved environment variable handling
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''

if (!admin.apps.length) {
  try {
    // Add explicit database URL configuration
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL // Add this line
    })
    console.log("✅ Firebase Admin initialized")
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error)
  }
}

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

export { db }