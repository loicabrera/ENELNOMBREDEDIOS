import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomeProveedor from "./dashboardProveedor/homeproveedor";
import SidebarAdmin from "./dashboardAdmin/sidebarAdmin";
import AdminHomeDashboard from "./dashboardAdmin/AdminHomeDashboard";
import AdminProveedor from "./dashboardAdmin/AdminProveedor";

import "./App.css";

import "./Formularios/datos.css";
import "./home.css";
import "./index.css";
import "./navbar.css";
import "./vende.css";

import DatosPersonas from "./Formularios/datospersonas";
import DatosProveedor from "./Formularios/datosproveedor";

import Home from "./pages/Home";
import Login from "./inicioSeccion/Login";
import Perfil from "./pages/Perfil";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Vende from "./pages/Vende";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PaymentContainer from './components/PaymentContainer';
import Confirmacion from './components/Confirmacion';

// Nuevo componente Layout más flexible
function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        {children}
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
          {/* Aquí puedes agregar más rutas internas del admin */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin Navbar - Login debe estar antes de las rutas con Layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas con Navbar */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/dashboardadmin/*"
          element={<AdminLayout />}
        />

        <Route
          path="/servicios"
          element={
            <Layout>
              <Servicios />
            </Layout>
          }
        />
        <Route
          path="/productos"
          element={
            <Layout>
              <Productos />
            </Layout>
          }
        />
        <Route
          path="/vende"
          element={
            <Layout>
              <Vende />
            </Layout>
          }
        />
        <Route
          path="/perfil"
          element={
            <Layout>
              <Perfil />
            </Layout>
          }
          
        />
        <Route
          path="/datospersonas"
          element={
            <Layout>
              <DatosPersonas />
            </Layout>
          }
        />
        <Route
          path="/datosproveedor"
          element={
            <Layout>
              <DatosProveedor />
            </Layout>
          }
        />

        {/* Rutas de pago y confirmación */}
        <Route
          path="/pago"
          element={
            <Layout>
              <PaymentContainer />
            </Layout>
          }
        />
        <Route
          path="/confirmacion"
          element={
            <Layout>
              <Confirmacion />
            </Layout>
          }
        />

        {/* Rutas sin Navbar */}
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

<Route 
  path="/dashboardproveedor"
  element={<HomeProveedor />}
/>

      </Routes>
    </Router>
  );
}

export default App;
