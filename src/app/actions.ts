
'use server';

import { getStore } from '@netlify/blobs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { sessionOptions, type SessionData } from '@/lib/session';

// We use a constant secret key. In a real-world scenario, 
// this should come from a secure environment variable.
const secretKey = new TextEncoder().encode(process.env.SECRET_COOKIE_PASSWORD);

async function hashPassword(password: string) {
  // We're using a JWT with a short expiration as a "hash".
  // The password is in the claims, and the signature is the "hash".
  return await new SignJWT({ password })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1s') // A very short-lived token, we only need the signature
    .sign(secretKey);
}

async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(hashedPassword, secretKey, {
      algorithms: ['HS256'],
    });
    return payload.password === password;
  } catch (e) {
    // This can happen if the token is malformed or the signature is invalid.
    return false;
  }
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
