import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockProjects, mockCommunities } from '../data/mockData';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, getProjects, getUsers, getCommunities } from '../services/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized. Ensure .env variables are loaded.");
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getUserProfile(firebaseUser.uid);
          if (userDoc) {
            setUser(userDoc);
            if (userDoc.joinedCommunities) setJoinedCommunities(userDoc.joinedCommunities);
            if (userDoc.likedProjects) setLikedProjects(userDoc.likedProjects);
            if (userDoc.following) setFollowing(userDoc.following);
          } else {
            // Fallback if document missing
            const newUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Developer',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Dev')}&background=random`,
              tagline: 'AcaDify Builder',
              joinedCommunities: [],
              likedProjects: [],
              following: []
            };
            setUser(newUser);
            // Optionally, we could create the user doc here
            try {
              const { setDoc, doc } = await import('firebase/firestore');
              const { db } = await import('../config/firebase');
              await setDoc(doc(db, 'users', firebaseUser.uid), newUser, { merge: true });
            } catch (e) { console.error("Error creating user doc", e); }
          }
        } catch (err) {
          console.error("Error fetching user profile", err);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  const [projects, setProjects] = useState(mockProjects);
  const [communities, setCommunities] = useState(mockCommunities);
  const [users, setUsers] = useState(mockUsers);
  const [following, setFollowing] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getProjects().then(fetchedProjects => {
      if (fetchedProjects.length > 0) {
        setProjects(prev => {
          const existingIds = new Set(fetchedProjects.map(p => p.id));
          return [...fetchedProjects, ...prev.filter(p => !existingIds.has(p.id))];
        });
      }
    }).catch(err => console.error("Error fetching projects", err));

    getUsers().then(fetchedUsers => {
      if (fetchedUsers.length > 0) {
        setUsers(prev => {
          const existingIds = new Set(fetchedUsers.map(u => u.id));
          return [...fetchedUsers, ...prev.filter(u => !existingIds.has(u.id))];
        });
      }
    }).catch(err => console.error("Error fetching users", err));

    getCommunities().then(fetchedCommunities => {
      if (fetchedCommunities.length > 0) {
        setCommunities(prev => {
          const existingIds = new Set(fetchedCommunities.map(c => c.id));
          return [...fetchedCommunities, ...prev.filter(c => !existingIds.has(c.id))];
        });
      }
    }).catch(err => console.error("Error fetching communities", err));
  }, []);

  const toggleFollow = async (userId) => {
    let next;
    setFollowing(prev => {
      next = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId];
      return next;
    });
    if (user && user.id !== 'u1') {
      try {
        const { updateDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../config/firebase');
        await updateDoc(doc(db, 'users', user.id), { following: next });
      } catch (e) { console.error("Failed to update following", e); }
    }
  };

  const toggleJoinCommunity = async (communityId) => {
    let next;
    setJoinedCommunities(prev => {
      const isJoined = prev.includes(communityId);
      next = isJoined ? prev.filter(id => id !== communityId) : [...prev, communityId];
      return next;
    });
    if (user && user.id !== 'u1') {
      try {
        const { updateDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../config/firebase');
        await updateDoc(doc(db, 'users', user.id), { joinedCommunities: next });
      } catch (e) { console.error("Failed to update joined communities", e); }
    }
  };

  const toggleLike = (projectId) => {
    setLikedProjects(prev => {
      const isCurrentlyLiked = prev.includes(projectId);
      const newLiked = isCurrentlyLiked ? prev.filter(id => id !== projectId) : [...prev, projectId];
      
      setProjects(prevProjects => prevProjects.map(p =>
        p.id === projectId
          ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ));
      
      return newLiked;
    });
  };

  const addProject = async (project) => {
    setProjects(prev => [project, ...prev]);
    // Persistence happened in the Upload service call
  };

  const updateProjectContext = async (projectId, updateData) => {
    const { updateProject } = await import('../services/db');
    await updateProject(projectId, updateData);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updateData } : p));
  };

  const deleteProject = async (projectId) => {
    // 1. Remove from database (Importing service)
    const { deleteProject: deleteFromDb } = await import('../services/db');
    await deleteFromDb(projectId);
    
    // 2. Update local state
    setProjects(prev => prev.filter(p => p.id !== projectId));
    return true;
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addCommunity = async (community) => {
    // Write to Firestore first
    try {
      const { setDoc, doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      await setDoc(doc(db, 'communities', community.id), community);
      
      // Update local state
      setCommunities(prev => [community, ...prev]);
      
      const newJoined = [...joinedCommunities, community.id];
      setJoinedCommunities(newJoined);
      
      if (user && user.id !== 'u1') {
        try {
          await updateDoc(doc(db, 'users', user.id), { joinedCommunities: newJoined });
        } catch (e) { console.error(e); }
      }
      
      console.log("Added new community:", community.name);
    } catch (err) {
      console.error("Failed to create community in database:", err);
      alert("Failed to create community.");
    }
  };

  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      return nextTheme;
    });
  };

  const loginAsDemo = () => {
    // We use the first mock user as our "Showcase" identity
    const demoUser = mockUsers[0];
    setUser(demoUser);
    
    // Ensure we have some data in the session even if Firestore is empty
    setProjects(mockProjects);
    setCommunities(mockCommunities);
    
    // Pre-join some communities for the demo user
    setJoinedCommunities(['c1', 'c2', 'c5']);
    
    // Add a welcome notification
    setNotifications([
      { id: 1, type: 'welcome', text: 'Welcome to SystemSpace Showcase! Feel free to explore the AI Resume and Communities.', read: false, time: 'Just now' }
    ]);
    
    console.log("Logged in as Demo User.");
  };

  return (
    <AppContext.Provider value={{
      user, authLoading, projects, communities, users,
      following, joinedCommunities, likedProjects, notifications,
      theme, toggleFollow, toggleJoinCommunity, toggleLike, addProject, deleteProject, updateProject: updateProjectContext, addCommunity, loginAsDemo, markAllNotificationsRead, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
