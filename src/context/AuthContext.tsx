
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import { getSession, logout as logoutAction, type SessionData } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: SessionData['user'] | null;
  loading: boolean;
  error: any;
  mutate: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple fetcher function for SWR
const fetcher = async () => {
  const session = await getSession();
  return session;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR('/api/session', fetcher);
  const { toast } = useToast();
  
  const logout = async () => {
    try {
        await logoutAction();
        await mutate(); // Re-fetch session to confirm logout
        toast({
            title: "Logout Berhasil",
            description: "Anda telah keluar dari akun Anda.",
        });
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: "Logout Gagal",
            description: e.message || "Terjadi kesalahan saat mencoba logout.",
        });
    }
  };

  return (
    <AuthContext.Provider value={{ user: data?.user || null, loading: isLoading, error, mutate, logout }}>
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
