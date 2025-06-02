import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download } from 'lucide-react';

const HistorialPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fecha_pago', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('todos');
  const [focusedRow, setFocusedRow] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/pagos')
      .then(res => res.json())
      .then(data => {
        setPagos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Función para calcular el estado de la membresía
  const calcularEstado = (fechaPago) => {
    const diasMembresia = 30;
    const diasGracia = 7;
    const fecha = new Date(fechaPago);
    const hoy = new Date();
    const finMembresia = new Date(fecha);
    finMembresia.setDate(fecha.getDate() + diasMembresia);
    const finGracia = new Date(fecha);
    finGracia.setDate(fecha.getDate() + diasMembresia + diasGracia);

    if (hoy <= finMembresia) return 'Pagado';
    if (hoy > finMembresia && hoy <= finGracia) return 'En período de gracia';
    return 'Pendiente';
  };

  // Función para ordenar los pagos
  const sortedPagos = React.useMemo(() => {
    let sortedItems = [...pagos];
    if (sortConfig.key) {
      sortedItems.sort((a, b) => {
        if (sortConfig.key === 'fecha_pago') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.fecha_pago) - new Date(b.fecha_pago)
            : new Date(b.fecha_pago) - new Date(a.fecha_pago);
        }
        if (sortConfig.key === 'monto') {
          return sortConfig.direction === 'asc' 
            ? a.monto - b.monto
            : b.monto - a.monto;
        }
        return 0;
      });
    }
    return sortedItems;
  }, [pagos, sortConfig]);

  // Función para filtrar y buscar pagos
  const filteredPagos = React.useMemo(() => {
    return sortedPagos.filter(pago => {
      const matchesSearch = 
        pago.proveedor?.nombre_empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.proveedor?.persona?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.proveedor?.persona?.apellido?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'todos' || calcularEstado(pago.fecha_pago) === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [sortedPagos, searchTerm, filterStatus]);

  // Función para manejar el ordenamiento
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    const headers = ['Fecha', 'Monto', 'Proveedor', 'Persona', 'Método', 'Estado'];
    const csvData = filteredPagos.map(pago => [
      new Date(pago.fecha_pago).toLocaleDateString(),
      pago.monto,
      pago.proveedor?.nombre_empresa || 'N/A',
      pago.proveedor?.persona ? `${pago.proveedor.persona.nombre} ${pago.proveedor.persona.apellido}` : 'N/A',
      'Stripe',
      calcularEstado(pago.fecha_pago)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'historial_pagos.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="h-full flex flex-col w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Historial de Pagos</h2>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Exportar a CSV"
            >
              <Download size={20} />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-sm p-4 border-t">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por proveedor o persona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Buscar pagos"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Filtrar por estado"
            >
              <option value="todos">Todos los estados</option>
              <option value="Pagado">Pagado</option>
              <option value="En período de gracia">En período de gracia</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('fecha_pago')}
                      role="button"
                      tabIndex="0"
                      aria-label="Ordenar por fecha"
                    >
                      <div className="flex items-center gap-2">
                        Fecha
                        {sortConfig.key === 'fecha_pago' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('monto')}
                      role="button"
                      tabIndex="0"
                      aria-label="Ordenar por monto"
                    >
                      <div className="flex items-center gap-2">
                        Monto
                        {sortConfig.key === 'monto' && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Persona
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPagos.map((pago) => {
                    const estado = calcularEstado(pago.fecha_pago);
                    return (
                      <tr 
                        key={pago.id_pago}
                        className="hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        tabIndex="0"
                        onFocus={() => setFocusedRow(pago.id_pago)}
                        onBlur={() => setFocusedRow(null)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(pago.fecha_pago).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          ${pago.monto}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {pago.proveedor?.nombre_empresa || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {pago.proveedor?.persona
                            ? `${pago.proveedor.persona.nombre} ${pago.proveedor.persona.apellido}`
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          Stripe
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full
                            ${estado === 'Pagado' ? 'bg-green-100 text-green-800' : 
                              estado === 'En período de gracia' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredPagos.length === 0 && (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center py-8 text-gray-500">
              No se encontraron pagos que coincidan con los criterios de búsqueda.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPagos; 