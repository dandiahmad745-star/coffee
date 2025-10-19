'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
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
  register: (credentials: Record<"name" | "email" | "password", string>) => Promise<any>;
  userProgress: UserProgress | null;
  saveProgress: (progress: UserProgress) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a wrapper component that includes the SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthManager>{children}</AuthManager>
    </SessionProvider>
  );
}

// This component contains the actual logic and context provider
function AuthManager({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const loading = status === 'loading';

  const loadUserProgress = useCallback((userId: string) => {
    try {
      const progressKey = `progress-${userId}`;
      const storedProgress = localStorage.getItem(progressKey);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      } else {
        setUserProgress({ completedMaterials: [] });
      }
    } catch (error) {
      console.error("Gagal memuat progres pengguna", error);
      setUserProgress({ completedMaterials: [] });
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const currentUser = session.user as User;
      setUser(currentUser);
      loadUserProgress(currentUser.id);
    } else {
      setUser(null);
      setUserProgress(null);
    }
  }, [session, status, loadUserProgress]);

  const login = async (credentials: Record<"email" | "password", string>) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: result.error || "Email atau password salah.",
      });
      throw new Error(result.error);
    } else if (result?.ok) {
       toast({
        title: "Login Berhasil!",
        description: `Selamat datang kembali!`,
      });
      router.push('/kursus');
      router.refresh();
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    setUserProgress(null);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun Anda.",
    });
    router.push('/login');
    router.refresh();
  };

  const register = async (credentials: Record<"name" | "email" | "password", string>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat pendaftaran.');
      }
      return data;
    } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Pendaftaran Gagal",
          description: error.message,
        });
        throw error;
    }
  }

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
    <AuthContext.Provider value={{ user, loading, login, logout, register, userProgress, saveProgress }}>
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
