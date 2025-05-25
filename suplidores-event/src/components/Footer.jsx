import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Building2, 
  Users, 
  ShoppingBag, 
  Store, 
  Home, 
  Mail, 
  Phone, 
  LogIn,
  User
} from 'lucide-react';

const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-16">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <a href="/" className="flex items-center">
              <span className="self-center text-3xl font-bold whitespace-nowrap dark:text-white" style={{ color: colors.darkTeal }}>ÉVOCA</span>
            </a>
           
          </div>
          <div className="grid grid-cols-2 gap-12 sm:gap-16 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider" style={{ color: colors.darkTeal }}>Navegación</h2>
              <ul className="text-darkTeal dark:text-gray-400 font-medium space-y-4">
                <li>
                  <a href="/home" className="hover:text-purple-500 transition-colors flex items-center gap-2">
                    <Home size={16} />
                    <span>Inicio</span>
                  </a>
                </li>
                <li>
                  <a href="/servicios" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                    <Building2 size={16} />
                    <span>Servicios</span>
                  </a>
                </li>
                <li>
                  <a href="/productos" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                    <ShoppingBag size={16} />
                    <span>Productos</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider" style={{ color: colors.darkTeal }}>Proveedores</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                <li>
                  <a href="/vende" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                    <Store size={16} />
                    <span>Vende con nosotros</span>
                  </a>
                </li>
               
                
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider" style={{ color: colors.darkTeal }}>Contacto</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-4">
                <li>
                  <a href="mailto:contacto@evoca.com" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                    <Mail size={16} />
                    <span>contacto@evoca.com</span>
                  </a>
                </li>
             
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-8 border-gray-200 sm:mx-auto dark:border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()} <a href="/" className="hover:underline font-medium" style={{ color: colors.darkTeal }}>ÉVOCA™</a>. Todos los derechos reservados.
          </span>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
