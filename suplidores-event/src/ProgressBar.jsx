import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = ['Datos', 'Proveedor', 'Confirmación'];

  return (
    <div className="flex justify-center items-center my-10 px-4 max-w-3xl mx-auto">
      <div className="w-full">
        {/* Pasos con líneas conectoras */}
        <div className="relative flex justify-between">
          {/* Líneas de conexión que van detrás de los círculos */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-red-600 transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Círculos con números */}
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center z-10">
              {/* Círculo */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold
                  shadow-md transition-all duration-300 ${index <= currentStep ? 'bg-red-600 scale-110' : 'bg-gray-300'}`}
              >
                {index + 1}
              </div>
              
              {/* Texto del paso */}
              <div className={`mt-2 text-sm font-medium text-center transition-all duration-300
                ${index <= currentStep ? 'text-red-600 font-semibold' : 'text-gray-600'}`}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;