import React from 'react';
import { Link } from 'react-router-dom';

const HomeProveedor = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido a tu Dashboard</h1>
        <p className="mt-2 text-gray-600">Gestiona tus servicios y productos desde aquí</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Publicaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Publicaciones</h2>
          <p className="text-gray-600 mb-4">Administra tus servicios y productos publicados</p>
          <Link
            to="/dashboard/publicaciones"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver publicaciones
          </Link>
        </div>

        {/* Tarjeta de Solicitudes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Solicitudes</h2>
          <p className="text-gray-600 mb-4">Revisa las solicitudes de contacto de tus clientes</p>
          <Link
            to="/dashboard/solicitudes"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver solicitudes
          </Link>
        </div>

        {/* Tarjeta de Membresía */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Membresía</h2>
          <p className="text-gray-600 mb-4">Gestiona tu plan y estado de membresía</p>
          <Link
            to="/dashboard/membresia"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver detalles
          </Link>
        </div>

        {/* Tarjeta de Estadísticas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
          <p className="text-gray-600 mb-4">Visualiza el rendimiento de tus publicaciones</p>
          <Link
            to="/dashboard/estadisticas"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver estadísticas
          </Link>
        </div>

        {/* Tarjeta de Perfil */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Perfil</h2>
          <p className="text-gray-600 mb-4">Actualiza la información de tu negocio</p>
          <Link
            to="/dashboard/perfil"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Editar perfil
          </Link>
        </div>

        {/* Tarjeta de Notificaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h2>
          <p className="text-gray-600 mb-4">Revisa tus notificaciones y alertas</p>
          <Link
            to="/dashboard/notificaciones"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver notificaciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeProveedor; 