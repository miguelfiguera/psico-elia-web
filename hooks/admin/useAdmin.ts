'use client';

import { useState, useCallback } from 'react';
import {
  getPaymentStats,
  getAppointmentSummary,
  getAllPatients,
  updatePatientStatus,
  getAllAppointments,
  createAppointmentForPatient,
  updateAppointmentStatus,
  getAllPayments,
  updatePaymentStatus,
  getAllAvailability,
  updateAvailability,
  getAllTimeOff,
  createTimeOff,
  updateTimeOff,
  deleteTimeOff,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllServices,
  createService,
  updateService,
  deleteService
} from '@/lib/actions/admin';
import type {
  Patient,
  Appointment,
  Payment,
  Availability,
  TimeOff,
  Announcement,
  Service,
  PaymentStats,
  AppointmentSummary,
  CreateTimeOffData,
  CreateAnnouncementData,
  CreateServiceData,
  CreateAppointmentData,
  UpdateAppointmentData
} from '@/types';

export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard and Statistics
  const fetchPaymentStats = useCallback(async (startDate?: string, endDate?: string): Promise<PaymentStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getPaymentStats(startDate, endDate);
      return stats;
    } catch (err) {
      setError('Failed to fetch payment statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointmentSummary = useCallback(async (startDate?: string, endDate?: string): Promise<AppointmentSummary | null> => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getAppointmentSummary(startDate, endDate);
      return summary;
    } catch (err) {
      setError('Failed to fetch appointment summary');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Patient Management
  const fetchAllPatients = useCallback(async (): Promise<Patient[]> => {
    setLoading(true);
    setError(null);
    try {
      const patients = await getAllPatients();
      return patients;
    } catch (err) {
      setError('Failed to fetch patients');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePatientStatus = useCallback(async (patientId: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePatientStatus(patientId, isActive);
      if (!result.success) {
        setError(result.error || 'Failed to update patient status');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to update patient status');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Appointment Management
  const fetchAllAppointments = useCallback(async (): Promise<Appointment[]> => {
    setLoading(true);
    setError(null);
    try {
      const appointments = await getAllAppointments();
      return appointments;
    } catch (err) {
      setError('Failed to fetch appointments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatientAppointment = useCallback(async (patientId: string, appointmentData: CreateAppointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createAppointmentForPatient(patientId, appointmentData);
      if (!result.success) {
        setError(result.error || 'Failed to create appointment');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to create appointment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyAppointment = useCallback(async (appointmentId: string, updates: UpdateAppointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAppointmentStatus(appointmentId, updates);
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

  // Payment Management
  const fetchAllPayments = useCallback(async (): Promise<Payment[]> => {
    setLoading(true);
    setError(null);
    try {
      const payments = await getAllPayments();
      return payments;
    } catch (err) {
      setError('Failed to fetch payments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const changePaymentStatus = useCallback(async (paymentId: string, status: Payment['status']) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePaymentStatus(paymentId, status);
      if (!result.success) {
        setError(result.error || 'Failed to update payment status');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to update payment status');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Availability Management
  const fetchAvailability = useCallback(async (): Promise<Availability[]> => {
    setLoading(true);
    setError(null);
    try {
      const availability = await getAllAvailability();
      return availability;
    } catch (err) {
      setError('Failed to fetch availability');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyAvailability = useCallback(async (availabilityId: string, updates: Partial<Availability>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAvailability(availabilityId, updates);
      if (!result.success) {
        setError(result.error || 'Failed to update availability');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to update availability');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Time Off Management
  const fetchTimeOff = useCallback(async (): Promise<TimeOff[]> => {
    setLoading(true);
    setError(null);
    try {
      const timeOff = await getAllTimeOff();
      return timeOff;
    } catch (err) {
      setError('Failed to fetch time off');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addTimeOff = useCallback(async (timeOffData: CreateTimeOffData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createTimeOff(timeOffData);
      if (!result.success) {
        setError(result.error || 'Failed to create time off');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to create time off');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyTimeOff = useCallback(async (timeOffId: string, updates: Partial<CreateTimeOffData & { is_active: boolean }>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateTimeOff(timeOffId, updates);
      if (!result.success) {
        setError(result.error || 'Failed to update time off');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to update time off');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTimeOff = useCallback(async (timeOffId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteTimeOff(timeOffId);
      if (!result.success) {
        setError(result.error || 'Failed to delete time off');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to delete time off');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Announcements Management
  const fetchAnnouncements = useCallback(async (): Promise<Announcement[]> => {
    setLoading(true);
    setError(null);
    try {
      const announcements = await getAllAnnouncements();
      return announcements;
    } catch (err) {
      setError('Failed to fetch announcements');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addAnnouncement = useCallback(async (announcementData: CreateAnnouncementData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createAnnouncement(announcementData);
      if (!result.success) {
        setError(result.error || 'Failed to create announcement');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to create announcement');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyAnnouncement = useCallback(async (announcementId: string, updates: Partial<CreateAnnouncementData & { is_active: boolean }>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAnnouncement(announcementId, updates);
      if (!result.success) {
        setError(result.error || 'Failed to update announcement');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to update announcement');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAnnouncement = useCallback(async (announcementId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAnnouncement(announcementId);
      if (!result.success) {
        setError(result.error || 'Failed to delete announcement');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to delete announcement');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Services Management
  const fetchServices = useCallback(async (): Promise<Service[]> => {
    setLoading(true);
    setError(null);
    try {
      const services = await getAllServices();
      return services;
    } catch (err) {
      setError('Failed to fetch services');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = useCallback(async (serviceData: CreateServiceData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createService(serviceData);
      if (!result.success) {
        setError(result.error || 'Failed to create service');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to create service');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyService = useCallback(async (serviceId: string, updates: Partial<CreateServiceData & { is_active: boolean }>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateService(serviceId, updates);
      if (!result.success) {
        setError(result.error || 'Failed to update service');
        return null;
      }
      return result.data;
    } catch (err) {
      setError('Failed to update service');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeService = useCallback(async (serviceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteService(serviceId);
      if (!result.success) {
        setError(result.error || 'Failed to delete service');
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to delete service');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('es-CO');
  }, []);

  const formatDateTime = useCallback((date: string) => {
    return new Date(date).toLocaleString('es-CO');
  }, []);

  const getAnnouncementTypeText = useCallback((type: Announcement['announcement_type']) => {
    const typeMap = {
      promotion: 'Promoción',
      workshop: 'Taller',
      masterclass: 'Masterclass',
      general: 'General'
    };
    return typeMap[type] || type;
  }, []);

  const getServiceCategoryText = useCallback((category: Service['category']) => {
    const categoryMap = {
      therapy: 'Terapia',
      evaluation: 'Evaluación',
      workshop: 'Taller',
      consultation: 'Consulta'
    };
    return categoryMap[category] || category;
  }, []);

  const generatePaymentReport = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const [stats, payments] = await Promise.all([
        getPaymentStats(startDate, endDate),
        getAllPayments()
      ]);

      const filteredPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return paymentDate >= start && paymentDate <= end;
      });

      return {
        stats,
        payments: filteredPayments,
        period: { startDate, endDate }
      };
    } catch (err) {
      setError('Failed to generate payment report');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,

    // Dashboard
    fetchPaymentStats,
    fetchAppointmentSummary,

    // Patient Management
    fetchAllPatients,
    togglePatientStatus,

    // Appointment Management
    fetchAllAppointments,
    createPatientAppointment,
    modifyAppointment,

    // Payment Management
    fetchAllPayments,
    changePaymentStatus,

    // Availability Management
    fetchAvailability,
    modifyAvailability,

    // Time Off Management
    fetchTimeOff,
    addTimeOff,
    modifyTimeOff,
    removeTimeOff,

    // Announcements Management
    fetchAnnouncements,
    addAnnouncement,
    modifyAnnouncement,
    removeAnnouncement,

    // Services Management
    fetchServices,
    addService,
    modifyService,
    removeService,

    // Reports
    generatePaymentReport,

    // Utilities
    clearError,
    formatCurrency,
    formatDate,
    formatDateTime,
    getAnnouncementTypeText,
    getServiceCategoryText
  };
}