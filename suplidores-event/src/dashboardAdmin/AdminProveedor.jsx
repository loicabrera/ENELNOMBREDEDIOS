import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const AdminProveedor = () => {
    const [tab, setTab] = useState("dashboard");
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [membresias, setMembresias] = useState({ activas: 0 });
    const [publicaciones, setPublicaciones] = useState([]);
    const [solicitudesHoy, setSolicitudesHoy] = useState(0);
    const [categorias, setCategorias] = useState({});

    // NUEVO: Datos para gráficas adicionales
    const [serviciosData, setServiciosData] = useState({});
    const [activosData, setActivosData] = useState({ activos: 0, inactivos: 0 });
    const [proveedoresPorMes, setProveedoresPorMes] = useState({ labels: [], data: [] });

    useEffect(() => {
      fetch('http://localhost:3000/proveedores')
        .then(res => res.json())
        .then(data => {
          setProveedores(data);
          // Proveedores por tipo de servicio
          const servicios = {};
          data.forEach(p => {
            const tipo = p.tipo_servicio || 'Sin tipo';
            servicios[tipo] = (servicios[tipo] || 0) + 1;
          });
          setServiciosData(servicios);
          // Activos vs inactivos (por membresía activa, si tienes ese campo)
          let activos = 0, inactivos = 0;
          data.forEach(p => {
            if (p.activo !== false) activos++; else inactivos++;
          });
          setActivosData({ activos, inactivos });
          // Proveedores por mes (último año)
          const meses = {};
          const now = new Date();
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            meses[key] = 0;
          }
          data.forEach(p => {
            const fecha = p.fecha_creacion || p.createdAt;
            if (fecha) {
              const d = new Date(fecha);
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              if (meses[key] !== undefined) meses[key]++;
            }
          });
          setProveedoresPorMes({
            labels: Object.keys(meses),
            data: Object.values(meses)
          });
        });
      fetch('http://localhost:3000/api/membresias/resumen')
        .then(res => res.json())
        .then(data => setMembresias(data));
      Promise.all([
        fetch('http://localhost:3000/api/productos-todos').then(r => r.json()),
        fetch('http://localhost:3000/api/servicios').then(r => r.json())
      ]).then(([productos, servicios]) => {
        const pubs = [...productos.map(p => ({...p, tipo: 'Producto'})), ...servicios.map(s => ({...s, tipo: 'Servicio'}))];
        setPublicaciones(pubs);
        const catCount = {};
        pubs.forEach(pub => {
          const cat = pub.categoria || pub.tipo_servicio || 'Sin categoría';
          catCount[cat] = (catCount[cat] || 0) + 1;
        });
        setCategorias(catCount);
      });
      const hoy = new Date().toISOString().slice(0, 10);
      fetch('http://localhost:3000/usuarios')
        .then(res => res.json())
        .then(data => {
          const hoyCount = data.filter(m => m.fecha && m.fecha.startsWith(hoy)).length;
          setSolicitudesHoy(hoyCount);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    const publicacionesAprobadas = publicaciones.filter(p => p.estado === 'aprobado').length;
    const categoriasData = {
      options: {
        chart: { id: "categorias" },
        xaxis: { categories: Object.keys(categorias) },
      },
      series: [{ name: "Publicaciones", data: Object.values(categorias) }],
    };
    // Gráfica: Proveedores por tipo de servicio
    const serviciosChart = {
      options: {
        chart: { id: "servicios" },
        xaxis: { categories: Object.keys(serviciosData) },
      },
      series: [{ name: "Proveedores", data: Object.values(serviciosData) }],
    };
    // Gráfica: Activos vs Inactivos
    const activosChart = {
      options: {
        labels: ["Activos", "Inactivos"],
        legend: { position: 'bottom' }
      },
      series: [activosData.activos, activosData.inactivos],
    };
    // Gráfica: Proveedores registrados por mes
    const porMesChart = {
      options: {
        chart: { id: "proveedores-mes" },
        xaxis: { categories: proveedoresPorMes.labels },
      },
      series: [{ name: "Proveedores", data: proveedoresPorMes.data }],
    };

    return (
      <div className="flex-1 min-h-screen flex flex-col bg-gray-50 p-6 pl-50 ml-0 border-l border-gray-200 shadow-lg">
        {/* Tabs */}
        {/* Elimino las tabs y dejo solo el dashboard */}
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Panel de Proveedores</h2>
        {/* Resumen en tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 text-sm mb-1">Total Proveedores</div>
            <div className="text-3xl font-semibold">{proveedores.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 text-sm mb-1">Publicaciones Aprobadas</div>
            <div className="text-3xl font-semibold">{publicacionesAprobadas}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 text-sm mb-1">Membresías Activas</div>
            <div className="text-3xl font-semibold">{membresias.activas}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 text-sm mb-1">Solicitudes Recibidas Hoy</div>
            <div className="text-3xl font-semibold">{solicitudesHoy}</div>
          </div>
        </div>

        {/* NUEVAS GRÁFICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-medium mb-4 text-center">Proveedores por Tipo de Servicio</div>
            <Chart
              options={serviciosChart.options}
              series={serviciosChart.series}
              type="bar"
              height={250}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-medium mb-4 text-center">Proveedores Activos vs Inactivos</div>
            <Chart
              options={activosChart.options}
              series={activosChart.series}
              type="donut"
              height={250}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <div className="font-medium mb-4 text-center">Proveedores Registrados por Mes (Último Año)</div>
            <Chart
              options={porMesChart.options}
              series={porMesChart.series}
              type="line"
              height={250}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <div className="font-medium mb-4 text-center">Publicaciones por Categoría</div>
            <Chart
              options={categoriasData.options}
              series={categoriasData.series}
              type="bar"
              height={250}
            />
          </div>
        </div>
      </div>
    );
};

export default AdminProveedor;
  