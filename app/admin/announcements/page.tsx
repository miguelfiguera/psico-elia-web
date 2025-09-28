'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/admin/useAdmin';
import type { Announcement } from '@/types';
import { Megaphone, Plus, Search, Edit2, Trash2, AlertCircle, Calendar, Eye, EyeOff } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const {
    loading,
    error,
    fetchAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    formatDate,
    clearError
  } = useAdmin();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'promotion' | 'alert',
    is_active: true,
    valid_until: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    const filtered = announcements.filter(announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm]);

  const loadAnnouncements = async () => {
    const announcementsData = await fetchAllAnnouncements();
    setAnnouncements(announcementsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (editingAnnouncement) {
      success = await updateAnnouncement(editingAnnouncement.id, formData);
    } else {
      success = await createAnnouncement(formData);
    }

    if (success) {
      await loadAnnouncements();
      resetForm();
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      is_active: announcement.is_active,
      valid_until: announcement.valid_until ? new Date(announcement.valid_until).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      const success = await deleteAnnouncement(id);
      if (success) {
        await loadAnnouncements();
      }
    }
  };

  const toggleStatus = async (announcement: Announcement) => {
    const success = await updateAnnouncement(announcement.id, {
      ...announcement,
      is_active: !announcement.is_active
    });
    if (success) {
      await loadAnnouncements();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      is_active: true,
      valid_until: ''
    });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promotion':
        return 'bg-green-100 text-green-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'promotion':
        return 'Promoción';
      case 'alert':
        return 'Alerta';
      default:
        return 'General';
    }
  };

  const activeAnnouncements = announcements.filter(a => a.is_active);
  const expiredAnnouncements = announcements.filter(a => {
    if (!a.valid_until) return false;
    return new Date(a.valid_until) < new Date();
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Anuncios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra promociones, anuncios y alertas para los pacientes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancelar' : 'Nuevo Anuncio'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Anuncios
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {announcements.length}
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
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeAnnouncements.length}
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
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Expirados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {expiredAnnouncements.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {editingAnnouncement ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="promotion">Promoción</option>
                    <option value="alert">Alerta</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Contenido
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="valid_until" className="block text-sm font-medium text-gray-700">
                    Válido hasta (opcional)
                  </label>
                  <input
                    type="date"
                    id="valid_until"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Anuncio activo
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : (editingAnnouncement ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar anuncios por título, contenido o tipo..."
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredAnnouncements.map((announcement) => {
              const isExpired = announcement.valid_until && new Date(announcement.valid_until) < new Date();

              return (
                <li key={announcement.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {announcement.title}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                              {getTypeLabel(announcement.type)}
                            </span>
                            {announcement.is_active ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Eye className="h-3 w-3 mr-1" />
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Inactivo
                              </span>
                            )}
                            {isExpired && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Expirado
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-gray-600">{announcement.content}</p>

                        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                          <span>Creado: {formatDate(announcement.created_at)}</span>
                          {announcement.valid_until && (
                            <span>Válido hasta: {formatDate(announcement.valid_until)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleStatus(announcement)}
                          className={`inline-flex items-center px-3 py-1 border shadow-sm text-xs font-medium rounded-md ${
                            announcement.is_active
                              ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                              : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                          }`}
                        >
                          {announcement.is_active ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Activar
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(announcement)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron anuncios' : 'No hay anuncios registrados'}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? 'Intenta con un término de búsqueda diferente.'
                : 'Los anuncios aparecerán aquí cuando los crees.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}