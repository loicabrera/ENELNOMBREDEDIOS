import React, { useState } from "react";
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
                <div className="text-3xl font-semibold">150</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-1">Publicaciones Aprobadas</div>
                <div className="text-3xl font-semibold">320</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-1">Membresías Activas</div>
                <div className="text-3xl font-semibold">120</div>
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
                <input placeholder="Nombre o email" className="max-w-sm px-3 py-2 border rounded-md" />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <select className="px-3 py-2 border rounded-md">
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <select className="px-3 py-2 border rounded-md">
                  <option value="todas">Todas las categorías</option>
                  <option value="floristería">Floristería</option>
                  <option value="catering">Catering</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Plan</label>
                <select className="px-3 py-2 border rounded-md">
                  <option value="todos">Todos los planes</option>
                  <option value="básico">Básico</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            {/* Listado de proveedores */}
            <div className="overflow-x-auto w-full">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Nombre</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Estado</th>
                    <th className="p-2 border">Servicio</th>
                    <th className="p-2 border">Plan</th>
                    <th className="p-2 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">Proveedor {i + 1}</td>
                      <td className="p-2 border">email{i + 1}@correo.com</td>
                      <td className="p-2 border">Activo</td>
                      <td className="p-2 border">Floristería</td>
                      <td className="p-2 border">Premium</td>
                      <td className="p-2 border space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Ver</button>
                        <button className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md text-sm">Editar</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Suspender</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Crear nuevo proveedor */}
            <div className="bg-white rounded-lg shadow p-6 mt-8 w-full max-w-xl mx-auto">
              <div className="font-medium mb-4 text-center">Crear Nuevo Proveedor</div>
              <div className="space-y-4">
                <input placeholder="Nombre o razón social" className="w-full px-3 py-2 border rounded-md" />
                <input placeholder="Correo electrónico" className="w-full px-3 py-2 border rounded-md" />
                <input placeholder="Teléfono" className="w-full px-3 py-2 border rounded-md" />
                <input placeholder="Tipo de servicio" className="w-full px-3 py-2 border rounded-md" />
                <input placeholder="Plan" className="w-full px-3 py-2 border rounded-md" />
                <button className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold">Crear</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
};

export default AdminProveedor;
  