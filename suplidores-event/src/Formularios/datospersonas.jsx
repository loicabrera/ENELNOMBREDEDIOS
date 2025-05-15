import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

const DatosPersonas = () => {
  const { plan } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: '',
    planSeleccionado: plan || 'destacado'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos ingresados:', formData);
    navigate('/registro/evento', { state: { formData } });
  };

  // Información de los planes según el documento proporcionado
  const planInfo = {
    destacado: {
      titulo: "Plan Destacado",
      descripcion: "Obtenga mayor visibilidad para sus servicios y productos",
      beneficios: [
        "Publicaciones destacadas en las búsquedas",
        "Mayor número de productos/servicios para publicar",
        "Acceso a estadísticas de visualización",
        "Prioridad en los resultados de búsqueda"
      ]
    }
  };

  const planActual = planInfo[formData.planSeleccionado] || planInfo.destacado;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal con padding reducido en la parte superior */}
      <div className="max-w-5xl mx-auto">
        {/* ProgressBar ya no tiene padding superior propio */}
        <ProgressBar currentStep={0} />
        
        {/* Contenido principal */}
        <div className="px-4 md:px-6 pb-12">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Formulario - 2/3 del ancho en desktop */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Personales</h2>
                
                <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-blue-700">
                    <span className="font-semibold">Plan seleccionado:</span> {planActual.titulo}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre:
                      </label>
                      <input 
                        type="text" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese su nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido:
                      </label>
                      <input 
                        type="text" 
                        name="apellido" 
                        value={formData.apellido} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese su apellido"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono:
                    </label>
                    <input 
                      type="text" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: +34 600 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección:
                    </label>
                    <input 
                      type="text" 
                      name="direccion" 
                      value={formData.direccion} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingrese su dirección completa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico:
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                      Siguiente
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Panel informativo - 1/3 del ancho en desktop */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-6">
                <h3 className="text-xl font-bold mb-4">{planActual.titulo}</h3>
                <p className="mb-6 text-blue-100">{planActual.descripcion}</p>
                
                <h4 className="font-semibold text-white mb-2">Beneficios:</h4>
                <ul className="space-y-2 text-blue-100">
                  {planActual.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {beneficio}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-3 bg-blue-600 rounded-md">
                  <p className="text-sm text-blue-100">
                    Al completar el formulario, podrá acceder a todas las funcionalidades de su plan de membresía y comenzar a gestionar sus productos o servicios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosPersonas;