
import type { SessionOptions } from 'iron-session';

export interface SessionData {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'coffe-learning-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

if (!process.env.SECRET_COOKIE_PASSWORD) {
  // In development, use a default secret. For production, this must be set.
  if (process.env.NODE_ENV !== 'production') {
      process.env.SECRET_COOKIE_PASSWORD = 'complex_password_at_least_32_characters_long_for_dev';
  } else {
      throw new Error('SECRET_COOKIE_PASSWORD is not set in production environment.');
  }
}
