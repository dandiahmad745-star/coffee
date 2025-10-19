
'use server';

import { getStore } from '@netlify/blobs';

// Simple in-memory password hashing for simulation.
// In a real app, this would be a proper hashing library like bcrypt or argon2.
async function hashPassword(password: string) {
  // This is NOT a secure hash. For demonstration purposes only.
  return `hashed_${password}`;
}

async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  // This is NOT a secure verification. For demonstration purposes only.
  return hashedPassword === `hashed_${password}`;
}

export async function registerUser(name: string, email: string, password: string) {
  const userStore = getStore('users');
  const existingUser = await userStore.get(email, { type: 'json' });

  if (existingUser) {
    throw new Error('Pengguna dengan email ini sudah terdaftar.');
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    hashedPassword,
    role: 'user' as const, // Default role
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

    const passwordMatch = await verifyPassword(userData.hashedPassword, password);

    if (!passwordMatch) {
        throw new Error('Email atau password salah.');
    }
    
    // Instead of creating a server session, we'll return user data to be stored in localStorage by the client.
    return { 
        success: true, 
        message: 'Login berhasil!',
        user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
        }
    };
}
