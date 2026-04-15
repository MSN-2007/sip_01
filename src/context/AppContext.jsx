import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockProjects, mockCommunities, currentUser } from '../data/mockData';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../services/db';

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
  const [projects, setProjects] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users] = useState([]);
  const [following, setFollowing] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch global projects from Firebase on mount
    import('../services/db').then(({ getProjects, getUsers }) => {
      getProjects().then(fetchedProjects => {
        setProjects(fetchedProjects);
      }).catch(err => console.error("Error fetching projects", err));
      
      getUsers().then(fetchedUsers => {
        setUsers(fetchedUsers);
      }).catch(err => console.error("Error fetching users", err));
    });
  }, []);

  const toggleFollow = (userId) => {
    setFollowing(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleJoinCommunity = (communityId) => {
    setJoinedCommunities(prev =>
      prev.includes(communityId) ? prev.filter(id => id !== communityId) : [...prev, communityId]
    );
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

  const addProject = (project) => {
    setProjects(prev => [project, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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

  return (
    <AppContext.Provider value={{
      user, projects, communities, users,
      following, joinedCommunities, likedProjects, notifications,
      theme, toggleFollow, toggleJoinCommunity, toggleLike, addProject, markAllNotificationsRead, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
