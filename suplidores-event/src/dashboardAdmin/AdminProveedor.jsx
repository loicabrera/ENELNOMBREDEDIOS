import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const AdminProveedor = () => {
    const [chartData] = useState({
      visits: {
        options: {
          chart: { id: "visits" },
          xaxis: { categories: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] },
        },
        series: [{ name: "Visitas", data: [30, 40, 45, 50, 49, 60, 70] }],
      },
      activity: {
        options: {
          chart: { id: "active-providers" },
          labels: ["Proveedor A", "Proveedor B", "Proveedor C"]
        },
        series: [44, 55, 13],
      },
      categories: {
        options: {
          chart: { id: "categories" },
          xaxis: { categories: ["Floristería", "Catering", "Música", "Decoración"] },
        },
        series: [{ name: "Publicaciones", data: [20, 35, 25, 40] }],
      }
    });
  
    const [tab, setTab] = useState("dashboard");
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [estados, setEstados] = useState({}); // Para activar/inactivar

    // Filtros
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroServicio, setFiltroServicio] = useState("todas");

    useEffect(() => {
      fetch('http://localhost:3000/proveedores')
        .then(res => res.json())
        .then(data => {
          setProveedores(data);
          // Inicializar todos como activos (simulado)
          const initialEstados = {};
          data.forEach(p => { initialEstados[p.id_provedor] = true; });
          setEstados(initialEstados);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    // Simular activar/inactivar
    const toggleEstado = (id) => {
      setEstados(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Calcular estado de membresía (simulado, puedes mejorar con pagos reales)
    const calcularEstadoMembresia = (proveedor) => {
      // Aquí podrías usar la fecha del último pago si la tienes
      return estados[proveedor.id_provedor] ? 'Activo' : 'Inactivo';
    };

    // Filtrar proveedores según los filtros
    const proveedoresFiltrados = proveedores.filter((proveedor) => {
      // Filtro por nombre/email
      const nombreEmail = `${proveedor.nombre_empresa} ${proveedor.email_empresa}`.toLowerCase();
      if (filtroNombre && !nombreEmail.includes(filtroNombre.toLowerCase())) return false;
      // Filtro por estado
      if (filtroEstado !== "todos") {
        const estadoActual = estados[proveedor.id_provedor] ? 'activos' : 'inactivos';
        if (filtroEstado !== estadoActual) return false;
      }
      // Filtro por servicio
      if (filtroServicio !== "todas" && proveedor.tipo_servicio.toLowerCase() !== filtroServicio.toLowerCase()) return false;
      // Filtro por plan eliminado
      return true;
    });

    // Obtener servicios únicos para el filtro
    const serviciosUnicos = Array.from(new Set(proveedores.map(p => p.tipo_servicio)));

    // Calcular proveedores con membresía por vencer o vencida
    const diasMembresia = 30;
    const diasGracia = 7;
    const hoy = new Date();
    const proveedoresPorVencer = proveedores.filter((proveedor) => {
      // Simulación: usar fecha de creación como fecha de inicio de membresía
      if (!proveedor.fecha_creacion) return false;
      const fechaInicio = new Date(proveedor.fecha_creacion);
      const finMembresia = new Date(fechaInicio);
      finMembresia.setDate(fechaInicio.getDate() + diasMembresia);
      const diasRestantes = Math.ceil((finMembresia - hoy) / (1000 * 60 * 60 * 24));
      return diasRestantes > 0 && diasRestantes <= 7;
    });
    const proveedoresVencidos = proveedores.filter((proveedor) => {
      if (!proveedor.fecha_creacion) return false;
      const fechaInicio = new Date(proveedor.fecha_creacion);
      const finMembresia = new Date(fechaInicio);
      finMembresia.setDate(fechaInicio.getDate() + diasMembresia + diasGracia);
      return hoy > finMembresia;
    });

    return (
      <div className="flex-1 min-h-screen flex flex-col bg-gray-50 p-6 pl-64 ml-4 border-l border-gray-200 shadow-lg">
        {/* Tabs */}
        <div className="mb-8 w-full flex justify-center">
          <div className="flex gap-2 border-b w-full max-w-xl justify-center">
            <button
              className={`px-6 py-2 font-semibold border-b-2 transition-colors ${tab === "dashboard" ? "border-purple-500 text-purple-700" : "border-transparent text-gray-500"}`}
              onClick={() => setTab("dashboard")}
            >
              Inicio
            </button>
            <button
              className={`px-6 py-2 font-semibold border-b-2 transition-colors ${tab === "proveedores" ? "border-purple-500 text-purple-700" : "border-transparent text-gray-500"}`}
              onClick={() => setTab("proveedores")}
            >
              Proveedores
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {tab === "dashboard" && (
          <>
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Panel de Proveedores</h2>
            {/* Resumen en tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-1">Total Proveedores</div>
                <div className="text-3xl font-semibold">{proveedores.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-1">Publicaciones Aprobadas</div>
                <div className="text-3xl font-semibold">320</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-1">Membresías Activas</div>
                <div className="text-3xl font-semibold">{Object.values(estados).filter(e => e).length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-1">Solicitudes Recibidas Hoy</div>
                <div className="text-3xl font-semibold">28</div>
              </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-medium mb-4 text-center">Visitas Semanales</div>
                <Chart
                  options={chartData.visits.options}
                  series={chartData.visits.series}
                  type="line"
                  height={250}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-medium mb-4 text-center">Proveedores Más Activos</div>
                <Chart
                  options={chartData.activity.options}
                  series={chartData.activity.series}
                  type="donut"
                  height={250}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                <div className="font-medium mb-4 text-center">Categorías Más Populares</div>
                <Chart
                  options={chartData.categories.options}
                  series={chartData.categories.series}
                  type="bar"
                  height={250}
                />
              </div>
            </div>

            {/* Alertas */}
            <div className="w-full">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-medium mb-2 text-center">Alertas Recientes</div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>3 membresías vencen esta semana.</li>
                  <li>5 publicaciones pendientes de revisión.</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Proveedores Tab */}
        {tab === "proveedores" && (
          <>
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Gestión de Proveedores</h2>
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-6 w-full">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Buscar</label>
                <input
                  placeholder="Nombre o email"
                  className="max-w-sm px-3 py-2 border rounded-md"
                  value={filtroNombre}
                  onChange={e => setFiltroNombre(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={filtroEstado}
                  onChange={e => setFiltroEstado(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={filtroServicio}
                  onChange={e => setFiltroServicio(e.target.value)}
                >
                  <option value="todas">Todas las categorías</option>
                  {serviciosUnicos.map(servicio => (
                    <option key={servicio} value={servicio}>{servicio}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alerta visual de membresías por vencer o vencidas */}
            {(proveedoresPorVencer.length > 0 || proveedoresVencidos.length > 0) && (
              <div className="mb-4">
                {proveedoresPorVencer.length > 0 && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-2">
                    <p>¡Hay {proveedoresPorVencer.length} proveedor(es) con membresía por vencer en los próximos 7 días!</p>
                  </div>
                )}
                {proveedoresVencidos.length > 0 && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>¡Hay {proveedoresVencidos.length} proveedor(es) con membresía vencida!</p>
                  </div>
                )}
              </div>
            )}

            {/* Listado de proveedores reales */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Nombre</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Estado Membresía</th>
                    <th className="p-2 border">Servicio</th>
                    <th className="p-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center p-4">Cargando...</td></tr>
                  ) : proveedoresFiltrados.length === 0 ? (
                    <tr><td colSpan={6} className="text-center p-4">No hay proveedores registrados.</td></tr>
                  ) : (
                    proveedoresFiltrados.map((proveedor) => (
                      <tr key={proveedor.id_provedor} className="hover:bg-gray-50">
                        <td className="p-2 border">{proveedor.nombre_empresa}</td>
                        <td className="p-2 border">{proveedor.email_empresa}</td>
                        <td className="p-2 border">{calcularEstadoMembresia(proveedor)}</td>
                        <td className="p-2 border">{proveedor.tipo_servicio}</td>
                        <td className="p-2 border space-x-2">
                          <button
                            className={`px-3 py-1 rounded-md text-sm ${estados[proveedor.id_provedor] ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                            onClick={() => toggleEstado(proveedor.id_provedor)}
                          >
                            {estados[proveedor.id_provedor] ? 'Inactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
};

export default AdminProveedor;
  