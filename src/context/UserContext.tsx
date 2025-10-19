
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_SESSION_KEY = 'kopiStartUserSession';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for a saved user session in localStorage when the app loads
    try {
      const savedUser = localStorage.getItem(USER_SESSION_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user session from localStorage", error);
      localStorage.removeItem(USER_SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
        setUser(userData);
    } catch (error) {
        console.error("Failed to save user session to localStorage", error);
    }
  };

  const logout = () => {
    try {
        localStorage.removeItem(USER_SESSION_KEY);
        // Optionally, also clear progress for the logged-out user
        if (user) {
          const progressKey = `kopiStartProgress_${user.email}`;
          // localStorage.removeItem(progressKey); // Uncomment if you want to clear progress on logout
        }
    } catch (error) {
        console.error("Failed to remove user session from localStorage", error);
    }
    setUser(null);
    router.push('/');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
