import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./Formularios/datos.css";
import "./home.css";
import "./index.css";
import "./navbar.css";
import "./vende.css";

import DatosPersonas from "./Formularios/datospersonas";
import DatosProveedor from "./Formularios/datosproveedor";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Productos from "./pages/Productos";
import Servicios from "./pages/Servicios";
import Vende from "./pages/Vende";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Nuevo componente Layout
function Layout({ children }) {
  return (
    <>
      <Navbar>{children}</Navbar>
      <Footer />
    </>
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

        {/* Rutas sin Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro/:plan" element={<DatosPersonas />} />
        <Route path="/registro/evento" element={<DatosProveedor />} />
      </Routes>
    </Router>
  );
}

export default App;
