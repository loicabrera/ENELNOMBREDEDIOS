import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const Homeprov = () => {
  // Mock data - replace with actual data from your backend
  const profileData = {
    name: "Servicios Profesionales XYZ",
    serviceType: "Servicios de Consultoría",
    plan: "Premium",
    status: "Activo",
    activePosts: 5,
    membershipExpiry: "2024-12-31",
    unreadMessages: 3,
    lastPostStatus: "Aprobado"
  };

  const keyIndicators = [
    {
      title: "Publicaciones Activas",
      value: profileData.activePosts,
      icon: DocumentTextIcon,
      color: "bg-blue-500"
    },
    {
      title: "Vencimiento Membresía",
      value: new Date(profileData.membershipExpiry).toLocaleDateString(),
      icon: CalendarIcon,
      color: "bg-green-500"
    },
    {
      title: "Mensajes Nuevos",
      value: profileData.unreadMessages,
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500"
    },
    {
      title: "Última Publicación",
      value: profileData.lastPostStatus,
      icon: CheckCircleIcon,
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/100"
            alt="Logo"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
            <p className="text-gray-600">{profileData.serviceType}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Plan {profileData.plan}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {profileData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyIndicators.map((indicator, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{indicator.title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  {indicator.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${indicator.color}`}>
                <indicator.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Mock activity items - replace with actual data */}
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Nueva publicación aprobada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Nueva solicitud de contacto</p>
                <p className="text-xs text-gray-500">Hace 5 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homeprov; 