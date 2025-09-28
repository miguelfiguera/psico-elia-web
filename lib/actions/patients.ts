'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
  Appointment,
  Payment,
  Patient,
  Availability,
  CreateAppointmentData,
  UpdateAppointmentData,
  CreatePaymentData
} from '@/types';

export async function getPatientProfile(): Promise<Patient | null> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting patient profile:', error);
    return null;
  }
}

export async function updatePatientProfile(updates: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/patients');
    return { success: true, data };
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getPatientAppointments(): Promise<Appointment[]> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return [];

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting patient appointments:', error);
    return [];
  }
}

export async function createAppointment(appointmentData: CreateAppointmentData) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        ...appointmentData
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/patients');
    return { success: true, data };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: 'Failed to create appointment' };
  }
}

export async function updateAppointment(appointmentId: string, updates: UpdateAppointmentData) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId)
      .eq('patient_id', user.id) // Ensure patient can only update their own appointments
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/patients');
    return { success: true, data };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
}

export async function cancelAppointment(appointmentId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .eq('patient_id', user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/patients');
    return { success: true, data };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { success: false, error: 'Failed to cancel appointment' };
  }
}

export async function getPatientPayments(): Promise<Payment[]> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return [];

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('patient_id', user.id)
      .order('payment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting patient payments:', error);
    return [];
  }
}

export async function createPayment(paymentData: CreatePaymentData) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .insert({
        patient_id: user.id,
        ...paymentData
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/patients');
    return { success: true, data };
  } catch (error) {
    console.error('Error creating payment:', error);
    return { success: false, error: 'Failed to create payment' };
  }
}

export async function getAvailability(): Promise<Availability[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting availability:', error);
    return [];
  }
}

export async function getUpcomingAppointment(): Promise<Appointment | null> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .eq('status', 'scheduled')
      .gte('appointment_date', today)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data || null;
  } catch (error) {
    console.error('Error getting upcoming appointment:', error);
    return null;
  }
}