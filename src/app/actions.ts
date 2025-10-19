
'use server';

import { getStore } from '@netlify/blobs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function registerUser(name: string, email: string, password: string) {
  const userStore = getStore('users');
  const existingUser = await userStore.get(email, { type: 'json' });

  if (existingUser) {
    throw new Error('Pengguna dengan email ini sudah terdaftar.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    hashedPassword,
    role: 'user', // Default role
  };

  await userStore.setJSON(email, newUser);

  return { success: true, message: `Pendaftaran berhasil! Selamat datang, ${name}!` };
}

export async function loginUser(email: string, password: string) {
    const userStore = getStore('users');
    const userData = await userStore.get(email, { type: 'json' });

    if (!userData) {
        throw new Error('Email atau password salah.');
    }

    const passwordMatch = await bcrypt.compare(password, userData.hashedPassword);

    if (!passwordMatch) {
        throw new Error('Email atau password salah.');
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
    };
    await session.save();
    
    return { success: true, message: 'Login berhasil!' };
}

export async function logout() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  redirect('/login');
}

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
