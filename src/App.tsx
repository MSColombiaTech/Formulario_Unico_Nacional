import React, { useState, useEffect } from 'react';
import { FunSolicitudPayload } from './types/fun';
import { EJEMPLO_FUN_BOGOTA, ESTADO_INICIAL_FUN } from './utils/colombiaData';
import { generarFunPdfBytes } from './utils/pdfGenerator';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { Step1General } from './components/Step1General';
import { Step2Predio } from './components/Step2Predio';
import { Step3Personas } from './components/Step3Personas';
import { Step4Sostenible } from './components/Step4Sostenible';
import { Step5Revision } from './components/Step5Revision';
import { SqlModal } from './components/SqlModal';

const STORAGE_KEY = 'fun_solicitud_draft_v1';

export function App() {
  const [solicitud, setSolicitud] = useState<FunSolicitudPayload>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error recuperando borrador', e);
      }
    }
    return EJEMPLO_FUN_BOGOTA;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitud));
    } catch (e) {
      console.error('Error guardando en localStorage', e);
    }
  }, [solicitud]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const handleCargarEjemplo = () => {
    setSolicitud(EJEMPLO_FUN_BOGOTA);
    setCompletedSteps([1, 2, 3, 4, 5]);
    showToast('¡Ejemplo oficial de Bogotá D.C. cargado exitosamente!');
  };

  const handleImportarJson = (data: FunSolicitudPayload) => {
    setSolicitud(data);
    showToast('¡Solicitud FUN importada correctamente!');
  };

  const handleDescargarPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // First try local pdf-lib generation
      const pdfBytes = await generarFunPdfBytes(solicitud);
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `FUN_Oficial_${(solicitud.predio.matriculaInmobiliaria || 'solicitud').replace(/\s+/g, '_')}_Res1051.pdf`;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      showToast('¡PDF oficial de 4 páginas generado y descargado!');
    } catch (err) {
      console.error('Error generando PDF', err);
      showToast('Error al generar el documento PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const markStepDone = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        solicitud={solicitud}
        onCargarEjemplo={handleCargarEjemplo}
        onImportarJson={handleImportarJson}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onDescargarPdf={handleDescargarPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* Progress Step Bar */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        completedSteps={completedSteps}
      />

      {/* Main Form Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <Step1General
            solicitud={solicitud}
            onChange={setSolicitud}
            onNext={() => {
              markStepDone(1);
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 2 && (
          <Step2Predio
            solicitud={solicitud}
            onChange={setSolicitud}
            onNext={() => {
              markStepDone(2);
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3Personas
            solicitud={solicitud}
            onChange={setSolicitud}
            onNext={() => {
              markStepDone(3);
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 4 && (
          <Step4Sostenible
            solicitud={solicitud}
            onChange={setSolicitud}
            onNext={() => {
              markStepDone(4);
              setCurrentStep(5);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 5 && (
          <Step5Revision
            solicitud={solicitud}
            onDescargarPdf={handleDescargarPdf}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
            onBack={() => {
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isGeneratingPdf={isGeneratingPdf}
            onGoToStep={(s) => {
              setCurrentStep(s);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* SQL Migration Modal */}
      <SqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
