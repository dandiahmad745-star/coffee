

'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// THIS IS A MOCK USER CONTEXT AND SHOULD BE REPLACED WITH A REAL AUTHENTICATION PROVIDER

type User = {
  id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'coffe-learning-user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!loading && !user && (pathname.startsWith('/kursus') || pathname.startsWith('/admin'))) {
        router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const login = (name: string, email: string) => {
    const newUser: User = { id: `user-${Date.now()}`, name, email };
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      router.push('/kursus');
    } catch (error) {
       console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      router.push('/');
    } catch (error) {
       console.error("Failed to remove user from localStorage", error);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
        {!loading && children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
