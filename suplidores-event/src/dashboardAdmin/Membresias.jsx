import React, { useState } from 'react';

const Membresias = () => {
  // Datos de ejemplo
  const [membresias] = useState({
    activas: [
      {
        id_prov_membresia: 1,
        nombre_empresa: "Floristería Bella",
        nombre: "Ana",
        apellido: "García",
        nombre_pla: "Plan Premium",
        fecha_inicio: "2024-03-01",
        fecha_fin: "2024-04-01",
        PERSONA_id_persona: 1
      },
      {
        id_prov_membresia: 2,
        nombre_empresa: "Decoraciones Elegantes",
        nombre: "Carlos",
        apellido: "Rodríguez",
        nombre_pla: "Plan Básico",
        fecha_inicio: "2024-03-15",
        fecha_fin: "2024-04-15",
        PERSONA_id_persona: 2
      }
    ],
    proximasVencer: [
      {
        id_prov_membresia: 3,
        nombre_empresa: "Música en Vivo",
        nombre: "María",
        apellido: "López",
        nombre_pla: "Plan Destacado",
        fecha_inicio: "2024-02-15",
        fecha_fin: "2024-03-20",
        PERSONA_id_persona: 3
      }
    ],
    vencidas: [
      {
        id_prov_membresia: 4,
        nombre_empresa: "Catering Express",
        nombre: "Juan",
        apellido: "Martínez",
        nombre_pla: "Plan Básico",
        fecha_inicio: "2024-01-01",
        fecha_fin: "2024-02-01",
        PERSONA_id_persona: 4
      }
    ]
  });

  const [selectedProvider, setSelectedProvider] = useState(null);

  const MembresiaCard = ({ membresia, tipo }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{membresia.nombre_empresa}</h3>
          <p className="text-sm text-gray-600">
            {membresia.nombre} {membresia.apellido}
          </p>
          <p className="text-sm text-gray-600">Plan: {membresia.nombre_pla}</p>
          <p className="text-sm text-gray-600">
            Fecha inicio: {new Date(membresia.fecha_inicio).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Fecha fin: {new Date(membresia.fecha_fin).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            tipo === 'activa' ? 'bg-green-100 text-green-800' :
            tipo === 'proxima' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {tipo === 'activa' ? 'Activa' :
             tipo === 'proxima' ? 'Próxima a vencer' :
             'Vencida'}
          </span>
        </div>
      </div>
      {tipo === 'activa' && !selectedProvider?.id_persona && (
        <button
          onClick={() => setSelectedProvider({
            id_persona: membresia.PERSONA_id_persona,
            credentials: {
              username: 'usuario_ejemplo',
              password: 'contraseña123',
              email: 'ejemplo@email.com'
            }
          })}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generar credenciales
        </button>
      )}
    </div>
  );

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Membresías</h1>

      {selectedProvider && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Credenciales generadas</h3>
          <p className="text-sm text-blue-800">
            Usuario: {selectedProvider.credentials.username}
          </p>
          <p className="text-sm text-blue-800">
            Contraseña: {selectedProvider.credentials.password}
          </p>
          <p className="text-sm text-blue-800">
            Email: {selectedProvider.credentials.email}
          </p>
          <button
            onClick={() => setSelectedProvider(null)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Membresías Activas</h2>
          {membresias.activas.map((membresia) => (
            <MembresiaCard key={membresia.id_prov_membresia} membresia={membresia} tipo="activa" />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas a Vencer</h2>
          {membresias.proximasVencer.map((membresia) => (
            <MembresiaCard key={membresia.id_prov_membresia} membresia={membresia} tipo="proxima" />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vencidas</h2>
          {membresias.vencidas.map((membresia) => (
            <MembresiaCard key={membresia.id_prov_membresia} membresia={membresia} tipo="vencida" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membresias;