// lib/firebase-admin.ts - ROBUST VERSION WITH SINGLETON PATTERN
import admin from 'firebase-admin';

// Singleton pattern to ensure single initialization
class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: admin.app.App;
  private _db: admin.firestore.Firestore | null = null;

  private constructor() {
    if (admin.apps.length > 0) {
      this.app = admin.apps[0] as admin.app.App;
      console.log('✅ Firebase Admin already initialized');
    } else {
      try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        
        if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
          throw new Error('Missing Firebase Admin environment variables');
        }

        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
        });
        
        console.log('✅ Firebase Admin initialized successfully');
      } catch (error) {
        console.error('❌ Firebase Admin initialization error:', error);
        throw error;
      }
    }
  }

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  public get db(): admin.firestore.Firestore {
    if (!this._db) {
      this._db = this.app.firestore();
    }
    return this._db;
  }
}

// Export the singleton instance
const firebaseAdmin = FirebaseAdmin.getInstance();
export const db = firebaseAdmin.db;
export { admin };
export default admin;