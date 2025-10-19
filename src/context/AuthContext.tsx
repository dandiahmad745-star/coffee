
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Define the shape of the user object
type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  mutate: () => void; // Keep mutate for compatibility if needed elsewhere
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'coffe-learning-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Gagal memuat pengguna dari localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
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

  // This function can be used to manually re-check localStorage if needed.
  const mutate = () => {
     setLoading(true);
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Gagal memuat ulang pengguna dari localStorage", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, mutate }}>
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
