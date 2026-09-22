import React from 'react';
import { CheckCircle2, FileText, MapPin, Users, Leaf, Eye } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  completedSteps: number[];
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  completedSteps
}) => {
  const steps = [
    { id: 1, title: 'Datos Generales', sub: 'Pág. 1: Solicitud', icon: FileText },
    { id: 2, title: 'Predio y Linderos', sub: 'Pág. 1-2: Vecinos', icon: MapPin },
    { id: 3, title: 'Titulares y Profesionales', sub: 'Pág. 2-3: Firmas', icon: Users },
    { id: 4, title: 'Construcción Sostenible', sub: 'Pág. 4: Res. 0549', icon: Leaf },
    { id: 5, title: 'Revisión y Descarga', sub: 'Validación Oficial', icon: Eye }
  ];

  return (
    <nav aria-label="Progreso" className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center justify-between py-3 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = completedSteps.includes(step.id);
            const Icon = step.icon;

            return (
              <li key={step.id} className="flex-1 min-w-[150px]">
                <button
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`w-full group flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                      : isDone
                      ? 'bg-emerald-50/40 border-emerald-300/60 text-slate-700 hover:bg-slate-50'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                    }`}
                  >
                    {isDone && !isActive ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-xs font-bold leading-tight truncate ${
                      isActive ? 'text-blue-900' : isDone ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {step.id}. {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {step.sub}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
