// lib/firebase-admin.ts - CLEAN VERSION WITHOUT TLS OVERRIDE
import admin from 'firebase-admin';

// Singleton pattern to ensure single initialization
class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: admin.app.App;
  private _db: admin.firestore.Firestore | null = null;
  private _settingsConfigured = false;

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
      
      // Only configure settings once
      if (!this._settingsConfigured) {
        try {
          this._db.settings({
            ignoreUndefinedProperties: true,
          });
          this._settingsConfigured = true;
          console.log('✅ Firestore settings configured');
        } catch (error: any) {
          // Settings already configured, which is fine
          if (error.message?.includes('already been initialized')) {
            console.log('ℹ️ Firestore settings already configured');
            this._settingsConfigured = true;
          } else {
            console.warn('⚠️ Firebase settings warning:', error.message);
          }
        }
      }
    }
    return this._db;
  }
}

// Export the singleton instance
const firebaseAdmin = FirebaseAdmin.getInstance();
export const db = firebaseAdmin.db;
export { admin };
export default admin;