import { SessionOptions } from 'iron-session';

export interface SessionData {
  role: 'admin' | 'viewer';
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  role: 'viewer',
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || 'default_fallback_password_32_chars_long',
  cookieName: 'iphone-stock-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
