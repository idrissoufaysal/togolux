'use server';

import { cookies } from 'next/headers';
import { createAuthActions } from '@insforge/sdk/ssr';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Veuillez renseigner votre adresse e-mail et votre mot de passe.' };
  }

  try {
    const auth = createAuthActions({ cookies: await cookies() });
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Identifiants de connexion invalides.' };
    }

    return { success: true, user: data?.user };
  } catch (err: any) {
    console.error('Exception in loginAdmin:', err);
    return { success: false, error: err.message || 'Une erreur est survenue lors de la connexion.' };
  }
}

export async function logoutAdmin() {
  try {
    const auth = createAuthActions({ cookies: await cookies() });
    const { error } = await auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exception in logoutAdmin:', err);
    return { success: false, error: err.message };
  }
}
