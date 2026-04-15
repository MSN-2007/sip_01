import { createContext, useContext, useState } from 'react';
import { mockUsers, mockProjects, mockCommunities, currentUser } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(currentUser);
  const [projects, setProjects] = useState(mockProjects);
  const [communities, setCommunities] = useState(mockCommunities);
  const [users] = useState(mockUsers);
  const [following, setFollowing] = useState(['u3']);
  const [joinedCommunities, setJoinedCommunities] = useState(['c1', 'c2', 'c6']);
  const [likedProjects, setLikedProjects] = useState(['p2', 'p6']);
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'collab', text: 'Deven Kapoor sent a Build With Me request on SoilSense', time: '2h ago', read: false },
    { id: 'n2', type: 'follow', text: 'Lena Torres started following you', time: '5h ago', read: false },
    { id: 'n3', type: 'like', text: 'Your project RainPredict received 12 new likes', time: '1d ago', read: true },
  ]);

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
