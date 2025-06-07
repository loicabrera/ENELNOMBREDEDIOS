import React from 'react';

const colors = {
  purple: '#cbb4db',
  darkTeal: '#012e33',
  pink: '#fbaccb',
  lightPink: '#fbcbdb',
  sage: '#9CAF88',
};

const ProgressBar = ({ currentStep }) => {
  const steps = ['Datos', 'Proveedor', 'Pago'];

  return (
    <div className="flex justify-center items-center my-4 px-2 max-w-xl mx-auto">
      <div className="w-full">
        {/* Pasos con líneas conectoras */}
        <div className="relative flex justify-between">
          {/* Líneas de conexión que van detrás de los círculos */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full transition-all duration-300 ease-in-out rounded"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%`, background: colors.purple }}
            ></div>
          </div>

          {/* Círculos con números */}
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center z-10">
              {/* Círculo */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold shadow transition-all duration-300 ${index <= currentStep ? '' : 'bg-gray-300'}`}
                style={index <= currentStep ? { background: colors.purple, transform: 'scale(1.08)' } : {}}
              >
                {index + 1}
              </div>
              {/* Texto del paso */}
              <div
                className={`mt-1 text-xs font-medium text-center transition-all duration-300 ${index <= currentStep ? 'font-semibold' : 'text-gray-400'}`}
                style={index <= currentStep ? { color: colors.purple } : { color: '#bdbdbd' }}
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
