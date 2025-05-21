import React, { useState } from 'react';
import { Search, MessageSquare, Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

const Soporte = () => {
  const [tickets] = useState([
    {
      id: 1,
      asunto: "Problema con el pago de membresía",
      usuario: "Juan Pérez",
      email: "juan@email.com",
      fecha: "2024-03-15",
      estado: "abierto",
      prioridad: "alta",
      ultimaRespuesta: "2024-03-15 14:30",
      mensajes: 3
    },
    {
      id: 2,
      asunto: "No puedo subir fotos",
      usuario: "María García",
      email: "maria@email.com",
      fecha: "2024-03-14",
      estado: "en_proceso",
      prioridad: "media",
      ultimaRespuesta: "2024-03-14 16:45",
      mensajes: 5
    },
    {
      id: 3,
      asunto: "Duda sobre el plan premium",
      usuario: "Carlos López",
      email: "carlos@email.com",
      fecha: "2024-03-13",
      estado: "cerrado",
      prioridad: "baja",
      ultimaRespuesta: "2024-03-13 10:15",
      mensajes: 2
    }
  ]);

  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'abierto':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'en_proceso':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'cerrado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ticketsFiltrados = tickets.filter(ticket => {
    const cumpleEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    const cumplePrioridad = filtroPrioridad === 'todas' || ticket.prioridad === filtroPrioridad;
    const cumpleBusqueda = ticket.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
                          ticket.usuario.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumplePrioridad && cumpleBusqueda;
  });

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Centro de Soporte</h1>
        <p className="text-gray-600">Gestiona las solicitudes de ayuda y soporte</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar tickets..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="abierto">Abiertos</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrado">Cerrados</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de tickets */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Respuesta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ticketsFiltrados.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{ticket.asunto}</div>
                    <div className="text-sm text-gray-500">#{ticket.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ticket.usuario}</div>
                    <div className="text-sm text-gray-500">{ticket.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getEstadoIcon(ticket.estado)}
                      <span className="ml-2 text-sm text-gray-900">
                        {ticket.estado.replace('_', ' ').charAt(0).toUpperCase() + ticket.estado.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(ticket.prioridad)}`}>
                      {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket.ultimaRespuesta}</div>
                    <div className="text-sm text-gray-500">{ticket.mensajes} mensajes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Responder</button>
                    {ticket.estado !== 'cerrado' && (
                      <button className="text-red-600 hover:text-red-900">Cerrar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets Abiertos</p>
              <p className="text-2xl font-semibold text-yellow-600">12</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En Proceso</p>
              <p className="text-2xl font-semibold text-blue-600">8</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cerrados Hoy</p>
              <p className="text-2xl font-semibold text-green-600">15</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tiempo Promedio</p>
              <p className="text-2xl font-semibold text-purple-600">2.5h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Soporte; 