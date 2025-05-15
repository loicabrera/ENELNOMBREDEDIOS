// ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = ['Datos', 'Proveedor', 'Confirmación'];

  return (
    <div className="flex justify-center pt-28 pb-8 px-4"> {/* pt-28 para evitar el solapamiento */}
      <div className="flex items-center space-x-4 sm:space-x-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Paso con número y título */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold
                ${index <= currentStep ? 'bg-red-600' : 'bg-gray-300 text-gray-600'}`}
              >
                {index + 1}
              </div>
              <div className="mt-1 text-sm font-medium text-gray-700 text-center">{step}</div>
            </div>

            {/* Línea conectora */}
            {index < steps.length - 1 && (
              <div
                className={`hidden sm:block w-12 h-2 mx-2 sm:mx-4 
                ${index < currentStep ? 'bg-red-600' : 'bg-gray-300'}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
