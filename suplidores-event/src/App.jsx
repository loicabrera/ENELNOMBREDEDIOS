import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import HomeProveedor from "./dashboardProveedor/homeproveedor";
import DashboardLayout from './dashboardProveedor/DashboardLayout';
import Profile from './dashboardProveedor/Profile';
import Publications from './dashboardProveedor/Publications';
import Membership from './dashboardProveedor/Membership';
import Stats from './dashboardProveedor/Stats';
import Notifications from './dashboardProveedor/Notifications';
import Negocios from './dashboardProveedor/Negocios';
import SidebarAdmin from "./dashboardAdmin/sidebarAdmin";
import AdminHomeDashboard from "./dashboardAdmin/AdminHomeDashboard";
import AdminProveedor from "./dashboardAdmin/AdminProveedor";
import HistorialPagos from './dashboardAdmin/HistorialPagos';
import Membresias from './dashboardAdmin/Membresias';
import Reportes from './dashboardAdmin/Reportes';
import Soporte from './dashboardAdmin/Soporte';
import Moderacion from './dashboardAdmin/Moderacion';
import Publicaciones from './dashboardAdmin/Publicaciones';
import ProtectedRoute from './components/ProtectedRoute';
import DatosProveedor2 from './dashboardProveedor/datosproveedor2';
import DetalleNegocio from './dashboardProveedor/DetalleNegocio';

import "./App.css";
import "./Formularios/datos.css";
import "./home.css";
import "./index.css";
import "./navbar.css";
import "./vende.css";

import DatosPersonas from "./Formularios/datospersonas";
import DatosProveedor from "./Formularios/datosproveedor";

import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Vende from "./pages/Vende";
import DetalleServicio from './pages/DetalleServicio';
import DetalleProducto from './pages/DetalleProducto';

import Login from "./components/LoginProveedor";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PaymentContainer from './components/PaymentContainer';
import Confirmacion from './components/Confirmacion';

// Nuevo componente Layout más flexible
function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      <div className="flex-1 transition-all duration-300 ml-16 lg:ml-48">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex">
      <SidebarAdmin />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AdminHomeDashboard />} />
          <Route path="proveedores" element={<AdminProveedor />} />
          <Route path="publicaciones" element={<Publicaciones />} />
          <Route path="membresias" element={<Membresias />} />
          <Route path="pagos" element={<HistorialPagos />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="soporte" element={<Soporte />} />
          <Route path="moderacion" element={<Moderacion />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/servicios" element={<Layout><Servicios /></Layout>} />
        <Route path="/productos" element={<Layout><Productos /></Layout>} />
        <Route path="/vende" element={<Layout><Vende /></Layout>} />
        <Route path="/servicios/:id" element={<Layout><DetalleServicio /></Layout>} />
        <Route path="/productos/:id" element={<Layout><DetalleProducto /></Layout>} />

        {/* Rutas protegidas para proveedores */}
        <Route
          path="/dashboard-proveedor/*"
          element={
            <ProtectedRoute allowedRoles={['proveedor']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeProveedor />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="negocios" element={<Negocios />} />
          <Route path="publicaciones" element={<Publications />} />
          <Route path="membresia" element={<Membership />} />
          <Route path="stats" element={<Stats />} />
          <Route path="notificaciones" element={<Notifications />} />
        </Route>

        {/* Rutas protegidas para administradores */}
        <Route
          path="/dashboardadmin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas para clientes */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Layout>
                <Perfil />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas para pagos */}
        <Route
          path="/pago"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'proveedor']}>
              <Layout>
                <PaymentContainer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmacion"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'proveedor']}>
              <Layout>
                <Confirmacion />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de registro */}
        <Route
          path="/registro/:plan"
          element={
            <Layout>
              <DatosPersonas />
            </Layout>
          }
        />
        <Route
          path="/registro/evento"
          element={
            <Layout>
              <DatosProveedor />
            </Layout>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
