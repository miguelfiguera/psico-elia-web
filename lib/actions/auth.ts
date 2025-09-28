'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  citizenId: string;
}

export async function loginAction(credentials: LoginCredentials) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : 'Error al iniciar sesión. Intenta nuevamente.'
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Error al iniciar sesión. Intenta nuevamente.'
      };
    }

    // Check if user is admin by looking at their profile
    const { data: profile, error: profileError } = await supabase
      .from('patients')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();

    const isAdmin = profile?.is_admin || false;

    return {
      success: true,
      user: data.user,
      isAdmin,
      redirectTo: isAdmin ? '/admin/dashboard' : '/patients/dashboard'
    };

  } catch (error) {
    console.error('Login action error:', error);
    return {
      success: false,
      error: 'Error interno del servidor. Intenta nuevamente.'
    };
  }
}

export async function signupAction(signupData: SignupData) {
  const supabase = createClient();

  try {
    // First, sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
    });

    if (authError) {
      console.error('Signup error:', authError);
      return {
        success: false,
        error: authError.message === 'User already registered'
          ? 'Este email ya está registrado'
          : 'Error al crear la cuenta. Intenta nuevamente.'
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Error al crear la cuenta. Intenta nuevamente.'
      };
    }

    // Create patient profile
    const { error: profileError } = await supabase
      .from('patients')
      .insert({
        id: authData.user.id,
        email: signupData.email,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        phone: signupData.phone || null,
        citizen_id: signupData.citizenId,
        is_admin: false
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);

      return {
        success: false,
        error: profileError.code === '23505' && profileError.message.includes('citizen_id')
          ? 'Esta cédula ya está registrada'
          : 'Error al crear el perfil. Intenta nuevamente.'
      };
    }

    return {
      success: true,
      message: 'Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión.'
    };

  } catch (error) {
    console.error('Signup action error:', error);
    return {
      success: false,
      error: 'Error interno del servidor. Intenta nuevamente.'
    };
  }
}

export async function logoutAction() {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Logout action error:', error);
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}

export async function getCurrentUser() {
  const supabase = createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get user profile with admin status
    const { data: profile, error: profileError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return null;
    }

    return {
      ...user,
      profile
    };

  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function resetPasswordAction(email: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'Error al enviar el email de recuperación'
      };
    }

    return {
      success: true,
      message: 'Se ha enviado un email de recuperación a tu correo'
    };

  } catch (error) {
    console.error('Reset password action error:', error);
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}

export async function updatePasswordAction(password: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: 'Error al actualizar la contraseña'
      };
    }

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente'
    };

  } catch (error) {
    console.error('Update password action error:', error);
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}