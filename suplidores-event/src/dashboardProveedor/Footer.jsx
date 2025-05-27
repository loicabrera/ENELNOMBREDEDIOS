import React from 'react';

const Footer = ({ sidebarOpen }) => {
  return (
    <footer className={`w-full bg-[#f8f9fa] border-t border-gray-200 py-6 mt-12 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-16'}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-sm text-center">
          &copy; {new Date().getFullYear()} Todos los derechos reservados.
        </p>
        <div className="mt-2 flex gap-4">
          <a href="#" className="text-gray-400 hover:text-[#012e33] transition-colors text-xs">Términos</a>
          <a href="#" className="text-gray-400 hover:text-[#012e33] transition-colors text-xs">Privacidad</a>
          <a href="#" className="text-gray-400 hover:text-[#012e33] transition-colors text-xs">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 