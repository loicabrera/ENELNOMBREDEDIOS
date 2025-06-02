import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Building2, 
  ShoppingBag, 
  Store, 
  Home
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
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="/" className="flex items-center mb-2 md:mb-0">
          <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white" style={{ color: colors.darkTeal }}>ÉVOCA</span>
        </a>
        <nav className="flex flex-wrap gap-6 text-sm font-medium">
          <a href="/home" className="hover:text-purple-500 transition-colors flex items-center gap-1">
            <Home size={16} /> Inicio
          </a>
          <a href="/servicios" className="hover:text-purple-300 transition-colors flex items-center gap-1">
            <Building2 size={16} /> Servicios
          </a>
          <a href="/productos" className="hover:text-purple-300 transition-colors flex items-center gap-1">
            <ShoppingBag size={16} /> Productos
          </a>
          <a href="/vende" className="hover:text-purple-300 transition-colors flex items-center gap-1">
            <Store size={16} /> Vende
          </a>
        </nav>
        <div className="flex space-x-4">
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
      <div className="text-center text-xs text-gray-500 py-2 border-t border-gray-100 dark:border-gray-800">
        © {new Date().getFullYear()} ÉVOCA. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
