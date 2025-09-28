'use client';

import { useState, useCallback } from 'react';
import {
  getPatientProfile,
  updatePatientProfile,
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getPatientPayments,
  createPayment,
  getAvailability,
  getUpcomingAppointment
} from '@/lib/actions/patients';
import type {
  Patient,
  Appointment,
  Payment,
  Availability,
  CreateAppointmentData,
  UpdateAppointmentData,
  CreatePaymentData
} from '@/types';

export function usePatient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile management
  const fetchProfile = useCallback(async (): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getPatientProfile();
      return profile;
    } catch (err) {
      setError('Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePatientProfile(updates);
      if (!result.success) {
        setError(result.error || 'Failed to update profile');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Appointments management
  const fetchAppointments = useCallback(async (): Promise<Appointment[]> => {
    setLoading(true);
    setError(null);
    try {
      const appointments = await getPatientAppointments();
      return appointments;
    } catch (err) {
      setError('Failed to fetch appointments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingAppointment = useCallback(async (): Promise<Appointment | null> => {
    setLoading(true);
    setError(null);
    try {
      const appointment = await getUpcomingAppointment();
      return appointment;
    } catch (err) {
      setError('Failed to fetch upcoming appointment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleAppointment = useCallback(async (appointmentData: CreateAppointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createAppointment(appointmentData);
      if (!result.success) {
        setError(result.error || 'Failed to schedule appointment');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to schedule appointment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyAppointment = useCallback(async (appointmentId: string, updates: UpdateAppointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAppointment(appointmentId, updates);
      if (!result.success) {
        setError(result.error || 'Failed to update appointment');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to update appointment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelScheduledAppointment = useCallback(async (appointmentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelAppointment(appointmentId);
      if (!result.success) {
        setError(result.error || 'Failed to cancel appointment');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to cancel appointment');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Payments management
  const fetchPayments = useCallback(async (): Promise<Payment[]> => {
    setLoading(true);
    setError(null);
    try {
      const payments = await getPatientPayments();
      return payments;
    } catch (err) {
      setError('Failed to fetch payments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const submitPayment = useCallback(async (paymentData: CreatePaymentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPayment(paymentData);
      if (!result.success) {
        setError(result.error || 'Failed to submit payment');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to submit payment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Availability
  const fetchAvailability = useCallback(async (): Promise<Availability[]> => {
    setLoading(true);
    setError(null);
    try {
      const availability = await getAvailability();
      return availability;
    } catch (err) {
      setError('Failed to fetch availability');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const formatAppointmentDateTime = useCallback((appointment: Appointment) => {
    const date = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    return {
      date: date.toLocaleDateString('es-CO'),
      time: date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      datetime: date
    };
  }, []);

  const formatPaymentAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const getAppointmentStatusText = useCallback((status: Appointment['status']) => {
    const statusMap = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return statusMap[status] || status;
  }, []);

  const getPaymentStatusText = useCallback((status: Payment['status']) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      rejected: 'Rechazado'
    };
    return statusMap[status] || status;
  }, []);

  const getDayOfWeekText = useCallback((dayOfWeek: number) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayOfWeek] || '';
  }, []);

  return {
    // State
    loading,
    error,

    // Profile
    fetchProfile,
    updateProfile,

    // Appointments
    fetchAppointments,
    fetchUpcomingAppointment,
    scheduleAppointment,
    modifyAppointment,
    cancelScheduledAppointment,

    // Payments
    fetchPayments,
    submitPayment,

    // Availability
    fetchAvailability,

    // Utilities
    clearError,
    formatAppointmentDateTime,
    formatPaymentAmount,
    getAppointmentStatusText,
    getPaymentStatusText,
    getDayOfWeekText
  };
}