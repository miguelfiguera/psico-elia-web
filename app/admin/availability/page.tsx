'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/admin/useAdmin';
import type { Availability, TimeOff, CreateTimeOffData } from '@/types';
import { Clock, Calendar, Plus, Edit, X, AlertCircle, Plane, Beach } from 'lucide-react';

export default function AdminAvailabilityPage() {
  const {
    loading,
    error,
    fetchAvailability,
    modifyAvailability,
    fetchTimeOff,
    addTimeOff,
    modifyTimeOff,
    removeTimeOff,
    formatDate,
    clearError
  } = useAdmin();

  const [availability, setAvailability] = useState<Availability[]>([]);
  const [timeOff, setTimeOff] = useState<TimeOff[]>([]);
  const [showTimeOffForm, setShowTimeOffForm] = useState(false);
  const [editingTimeOff, setEditingTimeOff] = useState<TimeOff | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null);
  const [timeOffFormData, setTimeOffFormData] = useState<CreateTimeOffData>({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [availabilityData, timeOffData] = await Promise.all([
      fetchAvailability(),
      fetchTimeOff()
    ]);
    setAvailability(availabilityData);
    setTimeOff(timeOffData);
  };

  const handleAvailabilityUpdate = async (id: string, updates: Partial<Availability>) => {
    const result = await modifyAvailability(id, updates);
    if (result) {
      loadData();
      setEditingAvailability(null);
    }
  };

  const handleTimeOffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let result;
    if (editingTimeOff) {
      result = await modifyTimeOff(editingTimeOff.id, timeOffFormData);
    } else {
      result = await addTimeOff(timeOffFormData);
    }

    if (result) {
      setShowTimeOffForm(false);
      setEditingTimeOff(null);
      setTimeOffFormData({ title: '', description: '', start_date: '', end_date: '' });
      loadData();
    }
  };

  const handleTimeOffEdit = (timeOffItem: TimeOff) => {
    setEditingTimeOff(timeOffItem);
    setTimeOffFormData({
      title: timeOffItem.title,
      description: timeOffItem.description || '',
      start_date: timeOffItem.start_date,
      end_date: timeOffItem.end_date
    });
    setShowTimeOffForm(true);
  };

  const handleTimeOffDelete = async (id: string) => {
    if (confirm('¿Estás seguro que deseas eliminar este período de tiempo libre?')) {
      const success = await removeTimeOff(id);
      if (success) {
        loadData();
      }
    }
  };

  const closeTimeOffForm = () => {
    setShowTimeOffForm(false);
    setEditingTimeOff(null);
    setTimeOffFormData({ title: '', description: '', start_date: '', end_date: '' });
  };

  const getDayName = (dayOfWeek: number) => {
    const day = daysOfWeek.find(d => d.value === dayOfWeek);
    return day ? day.label : '';
  };

  const isTimeOffActive = (timeOffItem: TimeOff) => {
    const now = new Date();
    const start = new Date(timeOffItem.start_date);
    const end = new Date(timeOffItem.end_date);
    return timeOffItem.is_active && now >= start && now <= end;
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Disponibilidad</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra los horarios de atención y períodos de tiempo libre.
          </p>
        </div>
      </div>

      {/* Weekly Availability */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h2 className="text-lg font-medium text-gray-900">Horarios Semanales</h2>
            <p className="mt-1 text-sm text-gray-600">
              Configura los horarios de atención por día de la semana.
            </p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {availability.map((slot) => (
                <li key={slot.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getDayName(slot.day_of_week)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {slot.start_time} - {slot.end_time} • Máx: {slot.max_appointments} citas
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          slot.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {slot.is_active ? 'Activo' : 'Inactivo'}
                        </span>

                        {editingAvailability?.id === slot.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              defaultValue={slot.start_time}
                              onChange={(e) => setEditingAvailability({...editingAvailability, start_time: e.target.value})}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            />
                            <input
                              type="time"
                              defaultValue={slot.end_time}
                              onChange={(e) => setEditingAvailability({...editingAvailability, end_time: e.target.value})}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            />
                            <input
                              type="number"
                              min="1"
                              max="20"
                              defaultValue={slot.max_appointments}
                              onChange={(e) => setEditingAvailability({...editingAvailability, max_appointments: parseInt(e.target.value)})}
                              className="text-xs border border-gray-300 rounded px-2 py-1 w-16"
                            />
                            <button
                              onClick={() => handleAvailabilityUpdate(slot.id, {
                                start_time: editingAvailability.start_time,
                                end_time: editingAvailability.end_time,
                                max_appointments: editingAvailability.max_appointments
                              })}
                              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingAvailability(null)}
                              className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAvailabilityUpdate(slot.id, { is_active: !slot.is_active })}
                              className={`text-xs px-2 py-1 rounded ${
                                slot.is_active
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {slot.is_active ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => setEditingAvailability(slot)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Time Off Section */}
      <div className="mt-12">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h2 className="text-lg font-medium text-gray-900">Períodos de Tiempo Libre</h2>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona vacaciones, viajes y otros períodos no disponibles.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => setShowTimeOffForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tiempo Libre
            </button>
          </div>
        </div>

        {/* Time Off Form Modal */}
        {showTimeOffForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingTimeOff ? 'Editar Tiempo Libre' : 'Nuevo Tiempo Libre'}
                  </h3>
                  <button onClick={closeTimeOffForm} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleTimeOffSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={timeOffFormData.title}
                      onChange={(e) => setTimeOffFormData({ ...timeOffFormData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ej: Vacaciones de verano"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      value={timeOffFormData.description}
                      onChange={(e) => setTimeOffFormData({ ...timeOffFormData, description: e.target.value })}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Detalles adicionales..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      required
                      value={timeOffFormData.start_date}
                      onChange={(e) => setTimeOffFormData({ ...timeOffFormData, start_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      required
                      value={timeOffFormData.end_date}
                      onChange={(e) => setTimeOffFormData({ ...timeOffFormData, end_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : editingTimeOff ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={closeTimeOffForm}
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

        {/* Time Off List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {timeOff.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {timeOff.map((item) => (
                <li key={item.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {item.title.toLowerCase().includes('vacacion') ? (
                            <Beach className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Plane className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {item.title}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              isTimeOffActive(item)
                                ? 'bg-red-100 text-red-800'
                                : item.is_active
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isTimeOffActive(item) ? 'En curso' : item.is_active ? 'Programado' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(item.start_date)} - {formatDate(item.end_date)}
                            </div>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => modifyTimeOff(item.id, { is_active: !item.is_active })}
                          className={`text-xs px-2 py-1 rounded ${
                            item.is_active
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {item.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleTimeOffEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTimeOffDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay períodos de tiempo libre</h3>
              <p className="text-gray-500 mb-4">Agrega vacaciones, viajes o cualquier período no disponible.</p>
              <button
                onClick={() => setShowTimeOffForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Período
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}