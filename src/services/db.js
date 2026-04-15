import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, arrayUnion, arrayRemove, query, where, orderBy } from 'firebase/firestore';

// --- Projects ---
export async function getProjects() {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addProject(projectData) {
  // Add a new document with a generated id
  const docRef = await addDoc(collection(db, 'projects'), {
    ...projectData,
    likes: 0,
    views: 0,
    collaborationRequests: 0,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...projectData };
}

export async function toggleLikeProject(projectId, userId) {
  // In a full app, we'd keep a subcollection of likes. 
  // For this beta, we'll assume the context handles UI state and we just increment/decrement
  // We're keeping it simple for now as requested.
}

// --- Communities ---
export async function getCommunities() {
  const snapshot = await getDocs(collection(db, 'communities'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Users ---
export async function getUserProfile(userId) {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
  return null;
}

// --- Seeding Data (Temporary Admin tool) ---
import { mockProjects, mockCommunities } from '../data/mockData';

export async function seedDatabase() {
  console.log("Starting DB seed...");
  
  for (const p of mockProjects) {
    await setDoc(doc(db, 'projects', p.id), p);
  }
  console.log("Seeded projects!");

  for (const c of mockCommunities) {
    await setDoc(doc(db, 'communities', c.id), c);
  }
  console.log("Seeded communities!");

  return true;
}
