'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/admin/useAdmin';
import type { Payment } from '@/types';
import { CreditCard, Search, AlertCircle, CheckCircle, Clock, XCircle, Download, Calendar } from 'lucide-react';

export default function AdminPaymentsPage() {
  const {
    loading,
    error,
    fetchAllPayments,
    changePaymentStatus,
    generatePaymentReport,
    formatCurrency,
    formatDate,
    clearError
  } = useAdmin();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment => {
        const patient = (payment as any).patients;
        return (
          patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.tx_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, dateRange]);

  const loadPayments = async () => {
    const paymentsData = await fetchAllPayments();
    setPayments(paymentsData);
  };

  const handleStatusChange = async (paymentId: string, status: Payment['status']) => {
    const result = await changePaymentStatus(paymentId, status);
    if (result) {
      loadPayments();
    }
  };

  const handleGenerateReport = async () => {
    const start = dateRange.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = dateRange.endDate || new Date().toISOString().split('T')[0];

    const report = await generatePaymentReport(start, end);
    if (report) {
      // Create a printable report
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(`
          <html>
            <head>
              <title>Reporte Detallado de Pagos - ${start} a ${end}</title>
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
                .status-confirmed { color: #059669; font-weight: bold; }
                .status-pending { color: #d97706; font-weight: bold; }
                .status-rejected { color: #dc2626; font-weight: bold; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Reporte Detallado de Pagos</h1>
                <h3>Psico Elia - Consultoría Psicológica</h3>
                <p>Período: ${new Date(start).toLocaleDateString('es-CO')} - ${new Date(end).toLocaleDateString('es-CO')}</p>
                <p>Generado el: ${new Date().toLocaleString('es-CO')}</p>
              </div>

              <div class="stats">
                <div class="stat-box">
                  <div class="stat-title">Total Ingresos</div>
                  <div class="stat-value">${formatCurrency(report.stats?.total_amount || 0)}</div>
                  <div style="color: #666; font-size: 14px;">${report.stats?.total_count || 0} transacciones</div>
                </div>
                <div class="stat-box">
                  <div class="stat-title">Pagos Confirmados</div>
                  <div class="stat-value">${formatCurrency(report.stats?.confirmed_amount || 0)}</div>
                  <div style="color: #666; font-size: 14px;">${report.stats?.confirmed_count || 0} pagos</div>
                </div>
                <div class="stat-box">
                  <div class="stat-title">Pagos Pendientes</div>
                  <div class="stat-value">${formatCurrency(report.stats?.pending_amount || 0)}</div>
                  <div style="color: #666; font-size: 14px;">${report.stats?.pending_count || 0} pagos</div>
                </div>
                <div class="stat-box">
                  <div class="stat-title">Pagos Rechazados</div>
                  <div class="stat-value">${formatCurrency(report.stats?.rejected_amount || 0)}</div>
                  <div style="color: #666; font-size: 14px;">${report.stats?.rejected_count || 0} pagos</div>
                </div>
              </div>

              <h3>Detalle de Transacciones</h3>
              <table class="payments-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>Email</th>
                    <th>Monto</th>
                    <th>Plataforma</th>
                    <th>TX ID</th>
                    <th>Estado</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  ${report.payments.map(payment => {
                    const patient = (payment as any).patients;
                    return `
                      <tr>
                        <td>${new Date(payment.payment_date).toLocaleDateString('es-CO')}</td>
                        <td>${patient?.first_name || ''} ${patient?.last_name || ''}</td>
                        <td>${patient?.email || ''}</td>
                        <td>${formatCurrency(payment.amount)}</td>
                        <td>${payment.platform || 'N/A'}</td>
                        <td>${payment.tx_id || 'N/A'}</td>
                        <td class="status-${payment.status}">
                          ${payment.status === 'confirmed' ? 'Confirmado' :
                            payment.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                        </td>
                        <td>${payment.notes || ''}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
                <p><strong>Resumen del Período</strong></p>
                <p>Ingresos Netos: ${formatCurrency((report.stats?.confirmed_amount || 0))}</p>
                <p>Tasa de Confirmación: ${report.stats?.total_count ? Math.round((report.stats.confirmed_count / report.stats.total_count) * 100) : 0}%</p>
              </div>
            </body>
          </html>
        `);
        reportWindow.document.close();
      }
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const confirmedAmount = filteredPayments.filter(p => p.status === 'confirmed').reduce((sum, payment) => sum + payment.amount, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra y confirma los pagos de los pacientes.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar por paciente, plataforma o TX ID..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="rejected">Rechazados</option>
        </select>

        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Fecha inicio"
        />

        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Fecha fin"
        />
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Filtrado
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalAmount)}
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
                    Confirmados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(confirmedAmount)}
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
                    Pendientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredPayments.filter(p => p.status === 'pending').length}
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
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Resultados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredPayments.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const patient = (payment as any).patients;
              return (
                <li key={payment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              <span className="ml-1">{getStatusText(payment.status)}</span>
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <p className="font-medium">
                              {patient?.first_name} {patient?.last_name} - {patient?.email}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Fecha: {formatDate(payment.payment_date)}</span>
                            {payment.platform && <span>Plataforma: {payment.platform}</span>}
                            {payment.tx_id && <span>TX ID: {payment.tx_id}</span>}
                          </div>
                          {payment.notes && (
                            <p className="mt-1 text-sm text-gray-600">
                              Notas: {payment.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(payment.id, 'confirmed')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleStatusChange(payment.id, 'rejected')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {payment.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(payment.id, 'pending')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                          >
                            Marcar Pendiente
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || dateRange.startDate || dateRange.endDate
                ? 'No se encontraron pagos'
                : 'No hay pagos registrados'
              }
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateRange.startDate || dateRange.endDate
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Los pagos aparecerán aquí cuando los pacientes los registren.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}