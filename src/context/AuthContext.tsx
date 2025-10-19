'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
};

type UserProgress = {
  completedMaterials: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: Record<"email" | "password", string>) => Promise<void>;
  logout: () => void;
  register: (credentials: Record<"name" | "email" | "password", string>) => Promise<void>;
  userProgress: UserProgress | null;
  saveProgress: (progress: UserProgress) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_DB_KEY = 'coffee-learning-users';
const SESSION_KEY = 'coffee-learning-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProgress = useCallback((userId: string) => {
    try {
      const progressKey = `progress-${userId}`;
      const storedProgress = localStorage.getItem(progressKey);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      } else {
        const initialProgress = { completedMaterials: [] };
        setUserProgress(initialProgress);
        localStorage.setItem(progressKey, JSON.stringify(initialProgress));
      }
    } catch (error) {
      console.error("Gagal memuat progres pengguna", error);
      setUserProgress({ completedMaterials: [] });
    }
  }, []);

  useEffect(() => {
    try {
      const sessionUser = localStorage.getItem(SESSION_KEY);
      if (sessionUser) {
        const activeUser = JSON.parse(sessionUser);
        setUser(activeUser);
        loadUserProgress(activeUser.id);
      }
    } catch (error) {
      console.error("Gagal memuat sesi", error);
    } finally {
      setLoading(false);
    }
  }, [loadUserProgress]);
  
  const login = async (credentials: Record<"email" | "password", string>) => {
    try {
      const usersStr = localStorage.getItem(USERS_DB_KEY);
      const users = usersStr ? JSON.parse(usersStr) : [];
      const foundUser = users.find(
        (u: User) => u.email === credentials.email && u.password === credentials.password
      );

      if (foundUser) {
        const { password, ...userToSave } = foundUser;
        localStorage.setItem(SESSION_KEY, JSON.stringify(userToSave));
        setUser(userToSave);
        loadUserProgress(userToSave.id);
        toast({
          title: "Login Berhasil!",
          description: `Selamat datang kembali, ${userToSave.name}!`,
        });
      } else {
        throw new Error("Email atau password salah.");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan.",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setUserProgress(null);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun Anda.",
    });
    router.push('/login');
  };

  const register = async (credentials: Record<"name" | "email" | "password", string>) => {
    try {
      const usersStr = localStorage.getItem(USERS_DB_KEY);
      const users = usersStr ? JSON.parse(usersStr) : [];

      const existingUser = users.find((u: User) => u.email === credentials.email);
      if (existingUser) {
        throw new Error("Email ini sudah terdaftar.");
      }
      
      const isFirstUserOrAdmin = users.length === 0 || credentials.email.includes('admin');
      
      const newUser = {
        id: `user-${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        password: credentials.password, // In a real app, this should be hashed!
        role: isFirstUserOrAdmin ? 'admin' : 'user',
      };

      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: error.message || "Terjadi kesalahan.",
      });
      throw error;
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
  
  const value = { user, loading, login, logout, register, userProgress, saveProgress };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
