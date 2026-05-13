'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData, defaultSession } from './session';
import { redirect } from 'next/navigation';

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.role = defaultSession.role;
  }

  return session;
}

export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  const session = await getSession();

  const adminPass = process.env.ADMIN_PASSWORD;
  const viewerPass = process.env.VIEWER_PASSWORD;

  if (adminPass && password === adminPass) {
    session.role = 'admin';
    session.isLoggedIn = true;
    await session.save();
    redirect('/');
  } else if (viewerPass && password === viewerPass) {
    session.role = 'viewer';
    session.isLoggedIn = true;
    await session.save();
    redirect('/');
  } else {
    return { error: 'Contraseña incorrecta' };
  }
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}
