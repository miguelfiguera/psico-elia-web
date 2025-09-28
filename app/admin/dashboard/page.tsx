'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/admin/useAdmin';
import type { PaymentStats, AppointmentSummary } from '@/types';
import {
  TrendingUp,
  Calendar,
  Users,
  CreditCard,
  Clock,
  Download,
  AlertCircle,
  CalendarDays,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    loading,
    error,
    fetchPaymentStats,
    fetchAppointmentSummary,
    generatePaymentReport,
    formatCurrency,
    clearError
  } = useAdmin();

  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [appointmentSummary, setAppointmentSummary] = useState<AppointmentSummary | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    const [stats, summary] = await Promise.all([
      fetchPaymentStats(dateRange.startDate, dateRange.endDate),
      fetchAppointmentSummary(dateRange.startDate, dateRange.endDate)
    ]);

    setPaymentStats(stats);
    setAppointmentSummary(summary);
  };

  const handleGenerateReport = async () => {
    const report = await generatePaymentReport(dateRange.startDate, dateRange.endDate);
    if (report) {
      // Create a printable report
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(`
          <html>
            <head>
              <title>Reporte de Pagos - ${dateRange.startDate} a ${dateRange.endDate}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
                .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .stat-title { font-weight: bold; color: #666; }
                .stat-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
                .payments-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .payments-table th, .payments-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .payments-table th { background-color: #f5f5f5; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Reporte de Pagos</h1>
                <h3>Psico Elia - Consultoría Psicológica</h3>
                <p>Período: ${new Date(dateRange.startDate).toLocaleDateString('es-CO')} - ${new Date(dateRange.endDate).toLocaleDateString('es-CO')}</p>
              </div>

              <div class="stats">
                <div class="stat-box">
                  <div class="stat-title">Total Ingresos</div>
                  <div class="stat-value">${formatCurrency(report.stats?.total_amount || 0)}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-title">Pagos Confirmados</div>
                  <div class="stat-value">${formatCurrency(report.stats?.confirmed_amount || 0)}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-title">Total Transacciones</div>
                  <div class="stat-value">${report.stats?.total_count || 0}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-title">Pagos Pendientes</div>
                  <div class="stat-value">${formatCurrency(report.stats?.pending_amount || 0)}</div>
                </div>
              </div>

              <h3>Detalle de Pagos</h3>
              <table class="payments-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>Monto</th>
                    <th>Plataforma</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.payments.map(payment => `
                    <tr>
                      <td>${new Date(payment.payment_date).toLocaleDateString('es-CO')}</td>
                      <td>${(payment as any).patients?.first_name || ''} ${(payment as any).patients?.last_name || ''}</td>
                      <td>${formatCurrency(payment.amount)}</td>
                      <td>${payment.platform || 'N/A'}</td>
                      <td>${payment.status === 'confirmed' ? 'Confirmado' : payment.status === 'pending' ? 'Pendiente' : 'Rechazado'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div style="margin-top: 40px; text-align: center; color: #666;">
                <p>Reporte generado el ${new Date().toLocaleString('es-CO')}</p>
              </div>
            </body>
          </html>
        `);
        reportWindow.document.close();
      }
    }
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

      {/* Header with Date Range */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="mt-2 text-sm text-gray-700">
            Resumen de actividades y estadísticas del consultorio.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Desde:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Hasta:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

      {loading && !paymentStats ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Payment Statistics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Ingresos Totales
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {paymentStats ? formatCurrency(paymentStats.total_amount) : '---'}
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
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pagos Confirmados
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {paymentStats ? formatCurrency(paymentStats.confirmed_amount) : '---'}
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
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pagos Pendientes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {paymentStats ? formatCurrency(paymentStats.pending_amount) : '---'}
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
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Transacciones
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {paymentStats ? paymentStats.total_count : '---'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Statistics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Citas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {appointmentSummary ? appointmentSummary.total_count : '---'}
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
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Citas Programadas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {appointmentSummary ? appointmentSummary.scheduled_count : '---'}
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
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Citas Completadas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {appointmentSummary ? appointmentSummary.completed_count : '---'}
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
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Citas Canceladas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {appointmentSummary ? appointmentSummary.cancelled_count : '---'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/admin/patients"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestionar Pacientes
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Ver y administrar la lista de pacientes registrados.
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/appointments"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                      <Calendar className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestionar Citas
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Administrar citas programadas y crear nuevas citas.
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/payments"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600 ring-4 ring-white">
                      <CreditCard className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Revisar Pagos
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Confirmar y gestionar pagos de pacientes.
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/services"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestionar Servicios
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Administrar servicios del consultorio y precios.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}