import { 
  NewspaperIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const HomeProveedor = () => {
  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">JD</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Juan Doe</h2>
            <p className="text-gray-600">Servicios de Catering</p>
            <span className="inline-block px-3 py-1 mt-2 text-sm font-medium text-green-600 bg-green-50 rounded-full">
              Plan Premium
            </span>
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Publications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Publicaciones Activas</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <NewspaperIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Membership Expiration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vence en</p>
              <h3 className="text-2xl font-bold mt-1">15 días</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <CalendarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mensajes Nuevos</p>
              <h3 className="text-2xl font-bold mt-1">5</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Publication Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobadas Recientes</p>
              <h3 className="text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-50 rounded-full">
              <NewspaperIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Nueva publicación aprobada</p>
              <p className="text-sm text-gray-600">"Servicio de Catering para Eventos"</p>
            </div>
            <span className="text-sm text-gray-500 ml-auto">Hace 2 horas</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-50 rounded-full">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Nuevo mensaje recibido</p>
              <p className="text-sm text-gray-600">De: María González</p>
            </div>
            <span className="text-sm text-gray-500 ml-auto">Hace 5 horas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProveedor; 