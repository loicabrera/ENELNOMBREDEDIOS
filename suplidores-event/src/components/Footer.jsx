import {} from "react";

const colors = {
  lightBlue: "#bbe3fb",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};
function footer() {
  return (
    <footer
      style={{ backgroundColor: colors.darkTeal }}
      className="text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ProveConnect</h3>
            <p className="text-gray-300 mb-4">
              La plataforma líder para conectar empresas con los mejores
              proveedores de productos y servicios.
            </p>
            <div className="flex space-x-3">
              {/* Iconos de redes sociales */}
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.pink;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                <span className="text-sm">FB</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.pink;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                <span className="text-sm">IG</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.pink;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                <span className="text-sm">TW</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.pink;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)";
                }}
              >
                <span className="text-sm">LI</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Proveedores</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Registro
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Planes y precios
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Casos de éxito
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Empresas</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Encuentra proveedores
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Solicita presupuestos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Comparar ofertas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Centro de ayuda
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contáctanos</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">info@proveconnect.com</li>
              <li className="text-gray-300">+1 234 567 890</li>
              <li className="text-gray-300">Calle Principal 123, Ciudad</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 ProveConnect. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Política de privacidad
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Términos de servicio
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default footer;
