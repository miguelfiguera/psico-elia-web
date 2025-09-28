'use client';

import { useEffect, useState } from 'react';
import { usePatient } from '@/hooks/patients/usePatient';
import type { Patient, Appointment, Payment } from '@/types';
import { Calendar, Clock, CreditCard, User, Plus, AlertCircle } from 'lucide-react';

export default function PatientDashboard() {
  const {
    loading,
    error,
    fetchProfile,
    fetchUpcomingAppointment,
    fetchPayments,
    formatAppointmentDateTime,
    formatPaymentAmount,
    getAppointmentStatusText,
    getPaymentStatusText,
    clearError
  } = usePatient();

  const [profile, setProfile] = useState<Patient | null>(null);
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [profileData, appointmentData, paymentsData] = await Promise.all([
        fetchProfile(),
        fetchUpcomingAppointment(),
        fetchPayments()
      ]);

      setProfile(profileData);
      setUpcomingAppointment(appointmentData);
      setRecentPayments(paymentsData.slice(0, 3)); // Show only last 3 payments
    };

    loadDashboardData();
  }, [fetchProfile, fetchUpcomingAppointment, fetchPayments]);

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {profile?.first_name || 'Usuario'}
        </h1>
        <p className="text-gray-600">
          Aquí puedes gestionar tus citas, pagos y información personal.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">

        {/* Upcoming Appointment Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Próxima Cita
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {upcomingAppointment ? (
                      <>
                        <div>{formatAppointmentDateTime(upcomingAppointment).date}</div>
                        <div className="text-sm text-gray-500">
                          {formatAppointmentDateTime(upcomingAppointment).time}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">No hay citas programadas</span>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href="/patients/appointments"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Ver todas las citas
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Acciones Rápidas
                  </dt>
                  <dd className="mt-3 space-y-2">
                    <a
                      href="/patients/appointments?action=create"
                      className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Agendar Cita
                    </a>
                    <a
                      href="/patients/payments?action=create"
                      className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Registrar Pago
                    </a>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Mi Información
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile ? (
                      <>
                        <div>{profile.first_name} {profile.last_name}</div>
                        <div className="text-sm text-gray-500">{profile.email}</div>
                        <div className="text-sm text-gray-500">CC: {profile.citizen_id}</div>
                      </>
                    ) : (
                      <span className="text-gray-500">Cargando...</span>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href="/patients/profile"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                Editar perfil
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Pagos Recientes
                </h3>
              </div>
              <a
                href="/patients/payments"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Ver todos
              </a>
            </div>

            {recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPaymentAmount(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString('es-CO')}
                        {payment.platform && ` - ${payment.platform}`}
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {getPaymentStatusText(payment.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No hay pagos registrados</p>
                <a
                  href="/patients/payments?action=create"
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Registrar primer pago
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Appointment Status */}
      {upcomingAppointment && (
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Recordatorio de Cita
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Tienes una cita programada para el{' '}
                  {formatAppointmentDateTime(upcomingAppointment).date} a las{' '}
                  {formatAppointmentDateTime(upcomingAppointment).time}
                </p>
                {upcomingAppointment.notes && (
                  <p className="text-sm text-blue-600 mt-1">
                    Notas: {upcomingAppointment.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}