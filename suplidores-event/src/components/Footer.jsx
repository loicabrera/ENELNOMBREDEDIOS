import {} from "react";

const colors = {
  lightBlue: "#bbe3fb",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

function Footer() {
  return (
    <footer
      style={{ backgroundColor: colors.darkTeal }}
      className="text-white py-8"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">ÉVOCA</h3>
            <p className="text-gray-300">
              Conectando empresas con los mejores proveedores de eventos.
            </p>
          </div>

          <div className="text-center">
            <h4 className="font-bold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Vende con nosotros</a></li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-bold mb-4">Contáctanos</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">info@evoca.com</li>
              <li className="text-gray-300">+1 234 567 890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ÉVOCA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
