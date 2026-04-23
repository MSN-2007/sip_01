import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockProjects, mockCommunities } from '../data/mockData';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, getProjects, getUsers } from '../services/db';

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
          } else {
            // Fallback if document missing
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Developer',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Dev')}&background=random`,
              tagline: 'ProjectSpace Builder',
            });
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
    // Fetch from Firebase, but mock data is already pre-loaded so the demo
    // is instantly functional even if Firestore is slow or empty.
    getProjects().then(fetchedProjects => {
      if (fetchedProjects.length > 0) setProjects(fetchedProjects);
    }).catch(err => console.error("Error fetching projects", err));

    getUsers().then(fetchedUsers => {
      if (fetchedUsers.length > 0) setUsers(fetchedUsers);
    }).catch(err => console.error("Error fetching users", err));
  }, []);

  const toggleFollow = (userId) => {
    setFollowing(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleJoinCommunity = (communityId) => {
    setJoinedCommunities(prev => {
      const isJoined = prev.includes(communityId);
      const next = isJoined ? prev.filter(id => id !== communityId) : [...prev, communityId];
      
      // Persistence placeholder - would normally call updateDoc(doc(db, 'users', user.id), ...)
      if (user) {
        console.log(`User ${user.id} ${isJoined ? 'left' : 'joined'} community ${communityId}`);
      }
      
      return next;
    });
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
    // Persistence would happen in Upload page service call
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addCommunity = (community) => {
    setCommunities(prev => [community, ...prev]);
    setJoinedCommunities(prev => [...prev, community.id]);
    
    // In a real app, we'd also call addDoc(collection(db, 'communities'), ...) here
    console.log("Added new community:", community.name);
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
      theme, toggleFollow, toggleJoinCommunity, toggleLike, addProject, addCommunity, loginAsDemo, markAllNotificationsRead, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
