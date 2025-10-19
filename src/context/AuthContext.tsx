'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Define the shape of the user object
type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
};

// Define the shape of user progress
type UserProgress = {
  completedMaterials: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  userProgress: UserProgress | null;
  saveProgress: (progress: UserProgress) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'coffe-learning-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const loadUserProgress = useCallback((userId: string) => {
    try {
      const progressKey = `progress-${userId}`;
      const storedProgress = localStorage.getItem(progressKey);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      } else {
        setUserProgress({ completedMaterials: [] }); // Default progress
      }
    } catch (error) {
      console.error("Gagal memuat progres pengguna", error);
      setUserProgress({ completedMaterials: [] });
    }
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadUserProgress(parsedUser.id);
      }
    } catch (error) {
      console.error("Gagal memuat pengguna dari localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, [loadUserProgress]);

  const login = (userData: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      loadUserProgress(userData.id); // Load progress on login
      router.push('/kursus');
    } catch (error) {
       console.error("Gagal menyimpan pengguna ke localStorage", error);
       toast({
        variant: "destructive",
        title: "Login Gagal",
        description: "Tidak dapat menyimpan sesi Anda di browser ini.",
      });
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setUserProgress(null);
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun Anda.",
      });
      router.push('/login');
    } catch (error) {
       console.error("Gagal menghapus pengguna dari localStorage", error);
       toast({
        variant: "destructive",
        title: "Logout Gagal",
        description: "Terjadi kesalahan saat mencoba logout.",
      });
    }
  };

  const saveProgress = (progress: UserProgress) => {
    if (!user) return;
    try {
      const progressKey = `progress-${user.id}`;
      localStorage.setItem(progressKey, JSON.stringify(progress));
      setUserProgress(progress);
    } catch (error) {
      console.error("Gagal menyimpan progres pengguna", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, userProgress, saveProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
