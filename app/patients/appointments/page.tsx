'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePatient } from '@/hooks/patients/usePatient';
import type { Appointment, Availability, CreateAppointmentData } from '@/types';
import { Calendar, Clock, Plus, Edit, X, AlertCircle, Check } from 'lucide-react';

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const showCreateForm = searchParams?.get('action') === 'create';

  const {
    loading,
    error,
    fetchAppointments,
    fetchAvailability,
    scheduleAppointment,
    modifyAppointment,
    cancelScheduledAppointment,
    formatAppointmentDateTime,
    getAppointmentStatusText,
    getDayOfWeekText,
    clearError
  } = usePatient();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [showForm, setShowForm] = useState(showCreateForm);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<CreateAppointmentData>({
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [appointmentsData, availabilityData] = await Promise.all([
      fetchAppointments(),
      fetchAvailability()
    ]);
    setAppointments(appointmentsData);
    setAvailability(availabilityData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let result;
    if (editingAppointment) {
      result = await modifyAppointment(editingAppointment.id, formData);
    } else {
      result = await scheduleAppointment(formData);
    }

    if (result) {
      setShowForm(false);
      setEditingAppointment(null);
      setFormData({ appointment_date: '', appointment_time: '', notes: '' });
      loadData();
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      notes: appointment.notes || ''
    });
    setShowForm(true);
  };

  const handleCancel = async (appointmentId: string) => {
    if (confirm('¿Estás seguro que deseas cancelar esta cita?')) {
      const success = await cancelScheduledAppointment(appointmentId);
      if (success) {
        loadData();
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
    setFormData({ appointment_date: '', appointment_time: '', notes: '' });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
          <button onClick={clearError} className="ml-auto text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona tus citas médicas programadas.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agendar Cita
          </button>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAppointment ? 'Editar Cita' : 'Agendar Nueva Cita'}
                </h3>
                <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hora
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Motivo de la consulta, síntomas, etc."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : editingAppointment ? 'Actualizar' : 'Agendar'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Availability Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Horarios Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-700">
          {availability.map((slot) => (
            <div key={slot.id}>
              {getDayOfWeekText(slot.day_of_week)}: {slot.start_time} - {slot.end_time}
            </div>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="mt-8">
        {loading && appointments.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {appointments.map((appointment) => {
                const { date, time } = formatAppointmentDateTime(appointment);
                return (
                  <li key={appointment.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {date} - {time}
                            </p>
                            <p className="text-sm text-gray-500">
                              Estado: {getAppointmentStatusText(appointment.status)}
                            </p>
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              appointment.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {getAppointmentStatusText(appointment.status)}
                          </span>

                          {appointment.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleEdit(appointment)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleCancel(appointment.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas programadas</h3>
            <p className="text-gray-500 mb-4">Comienza agendando tu primera cita médica.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agendar Primera Cita
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AppointmentsContent />
    </Suspense>
  );
}