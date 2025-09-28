'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePatient } from '@/hooks/patients/usePatient';
import type { Payment, Appointment, CreatePaymentData } from '@/types';
import { CreditCard, Plus, X, AlertCircle, Receipt, Calendar } from 'lucide-react';

function PaymentsContent() {
  const searchParams = useSearchParams();
  const showCreateForm = searchParams?.get('action') === 'create';

  const {
    loading,
    error,
    fetchPayments,
    fetchAppointments,
    submitPayment,
    formatPaymentAmount,
    getPaymentStatusText,
    clearError
  } = usePatient();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(showCreateForm);
  const [formData, setFormData] = useState<CreatePaymentData>({
    appointment_id: '',
    payment_date: '',
    amount: 0,
    platform: '',
    tx_id: '',
    notes: ''
  });

  const paymentPlatforms = [
    'Nequi',
    'Daviplata',
    'Bancolombia',
    'BBVA',
    'Efectivo',
    'Transferencia',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'Otro'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [paymentsData, appointmentsData] = await Promise.all([
      fetchPayments(),
      fetchAppointments()
    ]);
    setPayments(paymentsData);
    setAppointments(appointmentsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData: CreatePaymentData = {
      ...formData,
      appointment_id: formData.appointment_id || undefined,
      payment_date: new Date(formData.payment_date).toISOString()
    };

    const result = await submitPayment(paymentData);

    if (result) {
      setShowForm(false);
      setFormData({
        appointment_id: '',
        payment_date: '',
        amount: 0,
        platform: '',
        tx_id: '',
        notes: ''
      });
      loadData();
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      appointment_id: '',
      payment_date: '',
      amount: 0,
      platform: '',
      tx_id: '',
      notes: ''
    });
  };

  const getAppointmentInfo = (appointmentId?: string) => {
    if (!appointmentId) return null;
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return null;
    return `${appointment.appointment_date} - ${appointment.appointment_time}`;
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
          <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Visualiza y registra tus pagos de consultas médicas.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar Pago
          </button>
        </div>
      </div>

      {/* Create Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Registrar Nuevo Pago
                </h3>
                <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cita Asociada (opcional)
                  </label>
                  <select
                    value={formData.appointment_id}
                    onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Seleccionar cita...</option>
                    {appointments
                      .filter(apt => apt.status === 'scheduled' || apt.status === 'completed')
                      .map(appointment => (
                        <option key={appointment.id} value={appointment.id}>
                          {appointment.appointment_date} - {appointment.appointment_time}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha del Pago *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monto *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plataforma de Pago
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Seleccionar plataforma...</option>
                    {paymentPlatforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID de Transacción
                  </label>
                  <input
                    type="text"
                    value={formData.tx_id}
                    onChange={(e) => setFormData({ ...formData, tx_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Número de referencia o transacción"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Información adicional sobre el pago"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Registrando...' : 'Registrar Pago'}
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

      {/* Payments Summary */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Pagos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatPaymentAmount(
                      payments
                        .filter(p => p.status === 'confirmed')
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pagos Pendientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {payments.filter(p => p.status === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Último Pago
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {payments.length > 0
                      ? new Date(payments[0].payment_date).toLocaleDateString('es-CO')
                      : 'N/A'
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="mt-8">
        {loading && payments.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : payments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <li key={payment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {formatPaymentAmount(payment.amount)}
                          </p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Fecha: {new Date(payment.payment_date).toLocaleDateString('es-CO')}</p>
                            {payment.platform && <p>Plataforma: {payment.platform}</p>}
                            {payment.tx_id && <p>Ref: {payment.tx_id}</p>}
                            {payment.appointment_id && (
                              <p>Cita: {getAppointmentInfo(payment.appointment_id)}</p>
                            )}
                            {payment.notes && <p>Notas: {payment.notes}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
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
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.created_at).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos registrados</h3>
            <p className="text-gray-500 mb-4">Comienza registrando tu primer pago.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primer Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}