export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected';

export interface Patient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  citizen_id: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  patient_id: string;
  appointment_id?: string;
  payment_date: string;
  amount: number;
  platform?: string;
  tx_id?: string;
  status: PaymentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  max_appointments: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  appointment_date?: string;
  appointment_time?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface CreatePaymentData {
  appointment_id?: string;
  payment_date: string;
  amount: number;
  platform?: string;
  tx_id?: string;
  notes?: string;
}

export interface TimeOff {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  content?: string;
  announcement_type: 'promotion' | 'workshop' | 'masterclass' | 'general';
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  priority: number;
  target_audience: 'patients' | 'public' | 'all';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  category: 'therapy' | 'evaluation' | 'workshop' | 'consultation';
  created_at: string;
  updated_at: string;
}

export interface PaymentStats {
  total_amount: number;
  confirmed_amount: number;
  pending_amount: number;
  rejected_amount: number;
  total_count: number;
  confirmed_count: number;
  pending_count: number;
  rejected_count: number;
}

export interface AppointmentSummary {
  total_count: number;
  scheduled_count: number;
  completed_count: number;
  cancelled_count: number;
}

export interface CreateTimeOffData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export interface CreateAnnouncementData {
  title: string;
  description?: string;
  content?: string;
  announcement_type: Announcement['announcement_type'];
  start_date?: string;
  end_date?: string;
  priority?: number;
  target_audience?: Announcement['target_audience'];
}

export interface CreateServiceData {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category: Service['category'];
}