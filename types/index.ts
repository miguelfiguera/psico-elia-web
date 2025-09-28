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