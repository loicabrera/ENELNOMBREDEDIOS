import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, CalendarCheck } from 'lucide-react';

export default function AdminHomeDashboard() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusedCard, setFocusedCard] = useState(null);
  const [membresias, setMembresias] = useState({ activas: 0, vencidas: 0 });
  const [loadingMembresias, setLoadingMembresias] = useState(true);

  useEffect(() => {
    fetch('https://spectacular-recreation-production.up.railway.app/proveedores')
      .then(res => res.json())
      .then(data => {
        setProveedores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('https://spectacular-recreation-production.up.railway.app/api/membresias/resumen')
      .then(res => res.json())
      .then(data => {
        setMembresias(data);
        setLoadingMembresias(false);
      })
      .catch(() => setLoadingMembresias(false));
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
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 md:p-8">
      <main className="w-full h-full mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Resumen General
        </h1>

        {/* Tarjetas de resumen principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            aria-label="Proveedores Activos"
            onKeyPress={(e) => handleKeyPress(e, 'activos')}
            onFocus={() => setFocusedCard('activos')}
            onBlur={() => setFocusedCard(null)}
            className={`
              bg-white p-6 rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              ${focusedCard === 'activos' ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Proveedores Activos</h2>
              <CheckCircle className="w-8 h-8 text-green-500" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-center">
              <p className="text-4xl md:text-5xl font-bold text-green-600" aria-live="polite">
                {loading ? '...' : activos}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">Proveedores activos</p>
          </div>

          <div 
            role="article"
            tabIndex="0"
            aria-label="Proveedores Inactivos"
            onKeyPress={(e) => handleKeyPress(e, 'inactivos')}
            onFocus={() => setFocusedCard('inactivos')}
            onBlur={() => setFocusedCard(null)}
            className={`
              bg-white p-6 rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              ${focusedCard === 'inactivos' ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">Proveedores Inactivos</h2>
              <XCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-center">
              <p className="text-4xl md:text-5xl font-bold text-red-600" aria-live="polite">
                {loading ? '...' : inactivos}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">Proveedores inactivos</p>
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
                <p className="text-4xl md:text-5xl font-bold text-green-600" aria-live="polite">
                  {loadingMembresias ? '...' : membresias.activas}
                </p>
                <p className="text-sm text-gray-500">Activas</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-red-600" aria-live="polite">
                  {loadingMembresias ? '...' : membresias.vencidas}
                </p>
                <p className="text-sm text-gray-500">Vencidas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}