import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, EmotionalStatus } from '../types';

interface AppContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  setEmotionalStatus: (status: EmotionalStatus) => void;
  resetApp: () => void;
}

const defaultUser: UserProfile = {
  name: '',
  ageRange: '',
  isOnboarded: false,
  emergencyContact: {
    name: '',
    phone: '',
    relationship: ''
  },
  permissions: {
    emergencyAlerts: false,
    locationSharing: false,
    autoCall: false
  },
  currentStatus: EmotionalStatus.Unknown
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hopeconnect_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('hopeconnect_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const setEmotionalStatus = (status: EmotionalStatus) => {
    setUser(prev => ({ ...prev, currentStatus: status }));
  };

  const resetApp = () => {
    setUser(defaultUser);
    localStorage.removeItem('hopeconnect_user');
  };

  return (
    <AppContext.Provider value={{ user, updateUser, setEmotionalStatus, resetApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
