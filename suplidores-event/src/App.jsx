import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import HomeProveedor from "./dashboardProveedor/homeproveedor";
import DashboardLayout from './dashboardProveedor/DashboardLayout';
import Profile from './dashboardProveedor/Profile';
import Publications from './dashboardProveedor/Publications';
import Membership from './dashboardProveedor/Membership';
import Notifications from './dashboardProveedor/Notifications';
import Negocios from './dashboardProveedor/Negocios';
import SidebarAdmin from "./dashboardAdmin/sidebarAdmin";
import AdminHomeDashboard from "./dashboardAdmin/AdminHomeDashboard";
import AdminProveedor from "./dashboardAdmin/AdminProveedor";
import HistorialPagos from './dashboardAdmin/HistorialPagos';
import Membresias from './dashboardAdmin/Membresias';
import Publicaciones from './dashboardAdmin/Publicaciones';
import ProtectedRoute from './components/ProtectedRoute';
import DatosProveedor2 from './dashboardProveedor/datosproveedor2';
import DetalleNegocio from './dashboardProveedor/DetalleNegocio';
import LoginAdmin from './components/LoginAdmin';
import PaymentContainerPlanChange from './components/PaymentContainerPlanChange';
import FooterAdmin from './dashboardAdmin/FooterAdmin';

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
import EditarProducto from './pages/EditarProducto';
import EditarServicio from './pages/EditarServicio';

import Login from "./components/LoginProveedor";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PaymentContainer from './components/PaymentContainer';
import PaymentContainerNuevoNegocio from './components/PaymentContainerNuevoNegocio';
import Confirmacion from './components/Confirmacion';
import ConfirmacionNuevoNegocio from './components/ConfirmacionNuevoNegocio';
import { useSidebar } from './context/SidebarContext';

// Nuevo componente Layout más flexible
function Layout({ children }) {
  const { open } = useSidebar();
  return (
    <div className="min-h-screen flex">
      <Navbar />
      <div className={`flex-1 transition-all duration-300 ${open ? 'ml-48' : 'ml-16'}`}>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Nuevo layout sin Navbar
function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function AdminLayout() {
  const { open } = useSidebar();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <SidebarAdmin />
        <div className={`flex-1 transition-all duration-300 ${open ? 'ml-64' : 'ml-20'}`}>
          <Outlet />
        </div>
      </div>
      <FooterAdmin />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas públicas (accesibles sin autenticación) */}
      <Route path="/login" element={<SimpleLayout><Login /></SimpleLayout>} />
      <Route path="/enelnombrededios" element={<SimpleLayout><LoginAdmin /></SimpleLayout>} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/servicios" element={<Layout><Servicios /></Layout>} />
      <Route path="/productos" element={<Layout><Productos /></Layout>} />
      <Route path="/vende" element={<Layout><Vende /></Layout>} />
      <Route path="/servicios/:id" element={<Layout><DetalleServicio /></Layout>} />
      <Route path="/productos/:id" element={<Layout><DetalleProducto /></Layout>} />
      <Route path="/registro/:plan" element={<SimpleLayout><DatosPersonas /></SimpleLayout>} />
      <Route path="/registro/evento" element={<SimpleLayout><DatosProveedor /></SimpleLayout>} />
       <Route path="/pago" element={<Layout><PaymentContainer /></Layout>} />
        <Route
        path="/pago-nuevo-negocio"
        element={
          <SimpleLayout>
            <PaymentContainerNuevoNegocio />
          </SimpleLayout>
        }
      />
       <Route
        path="/confirmacion"
        element={
          <Layout><Confirmacion /></Layout>
        }
      />
       <Route
        path="/confirmacion-nuevo-negocio"
        element={
          <SimpleLayout>
            <ConfirmacionNuevoNegocio />
          </SimpleLayout>
        }
      />

      {/* Rutas protegidas para administradores */}
      <Route
        path="/dashboardadmin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomeDashboard />} />
        <Route path="proveedores" element={<AdminProveedor />} />
        <Route path="publicaciones" element={<Publicaciones />} />
        <Route path="membresias" element={<Membresias />} />
        <Route path="pagos" element={<HistorialPagos />} />
      </Route>

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
        <Route path="notificaciones" element={<Notifications />} />
        <Route path="negocios/:id" element={<DetalleNegocio />} />
        <Route path="productos/editar/:id" element={<EditarProducto />} />
        <Route path="servicios/editar/:id" element={<EditarServicio />} />
      </Route>

      {/* Ruta protegida para perfil de usuario autenticado (ajustar rol si es necesario) */}
      <Route
        path="/perfil"
        element={
          <ProtectedRoute allowedRoles={['cliente', 'proveedor', 'admin']}>{/* Permite ver el perfil a cualquier usuario autenticado */}
            <Layout><Perfil /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para pagos específicos (cambio de plan, edición, etc.) */}

      <Route
        path="/pago-cambio-plan"
        element={
          <ProtectedRoute allowedRoles={['proveedor']}>
            <Layout><PaymentContainerPlanChange /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto - redirige a la página principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
