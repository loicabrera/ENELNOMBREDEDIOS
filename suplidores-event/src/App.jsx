import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomeProveedor from "./dashboardProveedor/homeproveedor";
import DashboardLayout from './dashboardProveedor/DashboardLayout';
import Home from './dashboardProveedor/Homeprov';
import Profile from './dashboardProveedor/Profile';
import Publications from './dashboardProveedor/Publications';
import ContactRequests from './dashboardProveedor/ContactRequests';
import Membership from './dashboardProveedor/Membership';
import Statistics from './dashboardProveedor/Statistics';
import Notifications from './dashboardProveedor/Notifications';

import "./App.css";

import "./Formularios/datos.css";
import "./home.css";
import "./index.css";
import "./navbar.css";
import "./vende.css";

import DatosPersonas from "./Formularios/datospersonas";
import DatosProveedor from "./Formularios/datosproveedor";

import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Vende from "./pages/Vende";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

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

function App() {
  return (
    <Router>
      <Routes>
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

        {/* Rutas sin Navbar */}
        <Route path="/login" element={<Login />} />
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

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="publicaciones" element={<Publications />} />
          <Route path="solicitudes" element={<ContactRequests />} />
          <Route path="membresia" element={<Membership />} />
          <Route path="estadisticas" element={<Statistics />} />
          <Route path="notificaciones" element={<Notifications />} />
        </Route>

        <Route 
          path="/dashboardproveedor"
          element={<HomeProveedor />}
        />

      </Routes>
    </Router>
  );
}

export default App;
