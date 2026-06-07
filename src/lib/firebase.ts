import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection as firestoreCollection, 
  addDoc as firestoreAddDoc, 
  onSnapshot as firestoreOnSnapshot, 
  query as firestoreQuery, 
  orderBy as firestoreOrderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we are running in the browser and have a configured Firebase project
const isFirebaseConfigured = typeof window !== "undefined" 
  ? !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY 
  : false;

let app;
let realDb: any;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    realDb = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// Custom Emitter for browser-side real-time update triggers
class LocalEmitter {
  private listeners: Record<string, Function[]> = {};

  addEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => cb());
  }
}

const localEmitter = typeof window !== "undefined" ? new LocalEmitter() : null;

// Export Firestore database instance (or mock)
export const db = realDb || { isMock: true };

// Export collection wrapper
export function collection(database: any, path: string) {
  if (!database.isMock) {
    return firestoreCollection(database, path);
  }
  return { path, isMock: true };
}

// Export addDoc wrapper
export async function addDoc(collectionRef: any, data: any) {
  if (!collectionRef.isMock) {
    return firestoreAddDoc(collectionRef, data);
  }
  
  if (typeof window !== "undefined") {
    const key = `mock_firestore_${collectionRef.path}`;
    const existingData = localStorage.getItem(key);
    const items = existingData ? JSON.parse(existingData) : [];
    
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    
    // Trigger updates locally and in other tabs
    localEmitter?.emit(collectionRef.path);
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: JSON.stringify(items)
    }));
    
    return { id: newItem.id };
  }
  return { id: "server-side-mock-id" };
}

// Export query wrapper (mock query just passes through the ref)
export function query(collectionRef: any, ...queryConstraints: any[]) {
  if (!collectionRef.isMock) {
    return firestoreQuery(collectionRef, ...queryConstraints);
  }
  return collectionRef;
}

// Export orderBy wrapper
export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
  return { type: 'orderBy', field, direction };
}

// Export onSnapshot wrapper (real-time updates)
export function onSnapshot(queryRef: any, callback: (snapshot: any) => void) {
  if (!queryRef.isMock) {
    return firestoreOnSnapshot(queryRef, callback);
  }

  if (typeof window === "undefined") {
    callback({
      docs: [],
      forEach: () => {}
    });
    return () => {};
  }

  const path = queryRef.path;
  const key = `mock_firestore_${path}`;
  
  const getSnapshot = () => {
    const rawData = localStorage.getItem(key);
    let items = rawData ? JSON.parse(rawData) : [];
    
    // Default sorting (newest first)
    items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const docs = items.map((item: any) => ({
      id: item.id,
      data: () => {
        const { id, ...rest } = item;
        return {
          ...rest,
          // Support toDate() call for timestamps compatibility
          createdAt: {
            toDate: () => new Date(item.createdAt)
          }
        };
      }
    }));
    
    return {
      docs,
      forEach: (cb: (doc: any) => void) => {
        docs.forEach(cb);
      }
    };
  };

  // Trigger initial fetch
  callback(getSnapshot());

  const handleUpdate = () => {
    callback(getSnapshot());
  };

  // Register listeners
  localEmitter?.addEventListener(path, handleUpdate);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === key) {
      handleUpdate();
    }
  };
  window.addEventListener('storage', handleStorage);

  // Return unsubscribe
  return () => {
    localEmitter?.removeEventListener(path, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
}
