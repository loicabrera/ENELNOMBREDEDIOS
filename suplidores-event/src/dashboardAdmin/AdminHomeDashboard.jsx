import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, CalendarCheck } from 'lucide-react';

export default function AdminHomeDashboard() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusedCard, setFocusedCard] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        setProveedores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Calcular datos reales
  const totalProviders = proveedores.length;
  const activos = proveedores.filter(p => p.activo !== false).length;
  const inactivos = totalProviders - activos;

  const handleKeyPress = (e, cardId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFocusedCard(cardId);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 ml-0 sm:ml-16 md:ml-64">
      <main className="w-full h-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
          Resumen General
        </h1>

        {/* Tarjetas de resumen principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          <div 
            role="article"
            tabIndex="0"
            aria-label="Total de Proveedores"
            onKeyPress={(e) => handleKeyPress(e, 'total')}
            onFocus={() => setFocusedCard('total')}
            onBlur={() => setFocusedCard(null)}
            className={`
              bg-white p-6 rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              ${focusedCard === 'total' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Total Proveedores</h2>
              <Users className="w-8 h-8 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-4xl md:text-5xl font-bold text-gray-800" aria-live="polite">
              {loading ? '...' : totalProviders}
            </p>
            <p className="text-sm text-gray-500 mt-2">Proveedores registrados en total</p>
          </div>

          <div 
            role="article"
            tabIndex="0"
            aria-label="Estado de Proveedores"
            onKeyPress={(e) => handleKeyPress(e, 'estado')}
            onFocus={() => setFocusedCard('estado')}
            onBlur={() => setFocusedCard(null)}
            className={`
              bg-white p-6 rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              ${focusedCard === 'estado' ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Estado de Proveedores</h2>
              <div className="flex gap-2" aria-hidden="true">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-gray-800" aria-live="polite">
                  {loading ? '...' : activos}
                </p>
                <p className="text-sm text-gray-500">Activos</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-gray-800" aria-live="polite">
                  {loading ? '...' : inactivos}
                </p>
                <p className="text-sm text-gray-500">Inactivos</p>
              </div>
            </div>
          </div>

          <div 
            role="article"
            tabIndex="0"
            aria-label="Estado de Aprobaciones"
            onKeyPress={(e) => handleKeyPress(e, 'aprobaciones')}
            onFocus={() => setFocusedCard('aprobaciones')}
            onBlur={() => setFocusedCard(null)}
            className={`
              bg-white p-6 rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50
              ${focusedCard === 'aprobaciones' ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Estado de Aprobaciones</h2>
              <Clock className="w-8 h-8 text-yellow-500" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-green-600" aria-live="polite">340</p>
                <p className="text-sm text-gray-500">Aprobadas</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-yellow-600" aria-live="polite">24</p>
                <p className="text-sm text-gray-500">Pendientes</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-red-600" aria-live="polite">16</p>
                <p className="text-sm text-gray-500">Rechazadas</p>
              </div>
            </div>
          </div>

          <div 
            role="article"
            tabIndex="0"
            aria-label="Estado de Membresías"
            onKeyPress={(e) => handleKeyPress(e, 'membresias')}
            onFocus={() => setFocusedCard('membresias')}
            onBlur={() => setFocusedCard(null)}
            className={`
              bg-white p-6 rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
              ${focusedCard === 'membresias' ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Membresías</h2>
              <CalendarCheck className="w-8 h-8 text-purple-500" aria-hidden="true" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-green-600" aria-live="polite">110</p>
                <p className="text-sm text-gray-500">Activas</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-red-600" aria-live="polite">18</p>
                <p className="text-sm text-gray-500">Vencidas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
