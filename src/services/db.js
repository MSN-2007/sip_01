import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, query, where, orderBy, onSnapshot } from 'firebase/firestore';

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

export async function updateProject(projectId, updateData) {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, updateData);
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

export function subscribeToCommunityMessages(communityId, callback) {
  const q = query(
    collection(db, 'communities', communityId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (err) => {
    console.error('subscribeToCommunityMessages error:', err);
  });
}

export async function sendCommunityMessage(communityId, messageData) {
  validate(messageData, ['senderId', 'text']);
  try {
    const docRef = await addDoc(collection(db, 'communities', communityId, 'messages'), {
      ...messageData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...messageData };
  } catch (err) {
    if (err.code === 'permission-denied') {
      alert('Message failed: Firestore rules are blocking this. Please deploy the updated firestore.rules to your Firebase console!');
    }
    throw err;
  }
}

export async function initDirectMessageChat(userId1, userId2) {
  const chatId = [userId1, userId2].sort().join('_');
  // Always store participants sorted so both users pass the participant check
  await setDoc(doc(db, 'direct_messages', chatId), {
    participants: [userId1, userId2].sort()
  }, { merge: true });
}

export function subscribeToDirectMessages(userId1, userId2, callback, onError) {
  const chatId = [userId1, userId2].sort().join('_');
  const q = query(
    collection(db, 'direct_messages', chatId, 'messages')
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs
      .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    callback(messages);
  }, (err) => {
    console.error('subscribeToDirectMessages error:', err.code, err.message);
    if (onError) onError(err);
  });
}

export async function sendDirectMessage(userId1, userId2, messageData) {
  validate(messageData, ['from', 'text']);
  const chatId = [userId1, userId2].sort().join('_');
  
  try {
    // Ensure the parent document exists (sometimes needed for rules/indexing)
    await setDoc(doc(db, 'direct_messages', chatId), {
      lastActivity: new Date().toISOString(),
      participants: [userId1, userId2]
    }, { merge: true });

    const docRef = await addDoc(collection(db, 'direct_messages', chatId, 'messages'), {
      ...messageData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...messageData };
  } catch (err) {
    if (err.code === 'permission-denied') {
      alert('Message failed: Firestore rules are blocking this. Please deploy the updated firestore.rules to your Firebase console!');
    }
    throw err;
  }
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
export async function sendConnectionRequest(fromUserId, toUserId, additionalData = {}) {
  const connectionId = additionalData.projectId ? `${fromUserId}_${toUserId}_${additionalData.projectId}` : `${fromUserId}_${toUserId}`;
  await setDoc(doc(db, 'connections', connectionId), {
    id: connectionId,
    from: fromUserId,
    to: toUserId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...additionalData
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

export function subscribeToPendingRequests(userId, callback) {
  const q = query(collection(db, 'connections'), where('to', '==', userId), where('status', '==', 'pending'));
  return onSnapshot(q, (snapshot) => {
    const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(reqs);
  });
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
