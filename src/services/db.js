import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, query, where, orderBy } from 'firebase/firestore';

// Helper: Data Validation
function validate(data, requiredFields) {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new Error(`Security Exception: Missing required field "${field}"`);
    }
  }
}

// --- Projects ---
export async function getProjects() {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addProject(projectData) {
  validate(projectData, ['userId', 'title', 'stage']);
  const docRef = await addDoc(collection(db, 'projects'), {
    ...projectData,
    likes: 0,
    views: 0,
    collaborationRequests: 0,
    createdAt: projectData.createdAt || new Date().toISOString()
  });
  return { id: docRef.id, ...projectData };
}

export async function deleteProject(projectId) {
  await deleteDoc(doc(db, 'projects', projectId));
  return true;
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

import { onSnapshot } from 'firebase/firestore';

export function subscribeToCommunityMessages(communityId, callback) {
  const q = query(
    collection(db, 'communities', communityId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
}

export async function sendCommunityMessage(communityId, messageData) {
  validate(messageData, ['userId', 'text']);
  const docRef = await addDoc(collection(db, 'communities', communityId, 'messages'), {
    ...messageData,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...messageData };
}

// --- Users ---
export async function getUserProfile(userId) {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
  return null;
}

export async function getUsers() {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Connections (Social Graph) ---
export async function sendConnectionRequest(fromUserId, toUserId) {
  const connectionId = `${fromUserId}_${toUserId}`;
  await setDoc(doc(db, 'connections', connectionId), {
    id: connectionId,
    from: fromUserId,
    to: toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  return true;
}

export async function acceptConnectionRequest(connectionId) {
  const docRef = doc(db, 'connections', connectionId);
  await updateDoc(docRef, { status: 'accepted', updatedAt: new Date().toISOString() });
  return true;
}

export async function getPendingRequests(userId) {
  const q = query(collection(db, 'connections'), where('to', '==', userId), where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Seeding Data (Temporary Admin tool) ---
import { mockProjects, mockCommunities, mockUsers } from '../data/mockData';

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

  for (const u of mockUsers) {
    await setDoc(doc(db, 'users', u.id), u);
  }
  console.log("Seeded users!");

  return true;
}
