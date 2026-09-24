import React, { useEffect, useState } from 'react';
import { FunSolicitudPayload } from '../types/fun';
import { generarFunPdfBytes } from '../utils/pdfGenerator';
import { X, Printer, FileDown, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface FormularioOficialModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitud: FunSolicitudPayload;
  onDescargarPdf: () => void;
  isGeneratingPdf: boolean;
}

export const FormularioOficialModal: React.FC<FormularioOficialModalProps> = ({
  isOpen,
  onClose,
  solicitud,
  onDescargarPdf,
  isGeneratingPdf
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    if (isOpen) {
      setIsLoadingPdf(true);
      setLoadError(null);

      generarFunPdfBytes(solicitud)
        .then((bytes) => {
          if (!active) return;
          const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
          createdUrl = URL.createObjectURL(blob);
          setPdfBlobUrl(createdUrl);
          setIsLoadingPdf(false);
        })
        .catch((err) => {
          if (!active) return;
          console.error('Error generando vista previa oficial del FUN:', err);
          setLoadError('No se pudo generar la vista previa del documento oficial.');
          setIsLoadingPdf(false);
        });
    } else {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, solicitud]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (pdfBlobUrl) {
      const printWindow = window.open(pdfBlobUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
      } else {
        window.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col h-[94vh] overflow-hidden border border-slate-700/80">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Formulario Único Nacional (Resolución 1051 de 2025)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Documento Oficial
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Plantilla ministerial oficial con todos los campos y casillas diligenciados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={!pdfBlobUrl || isLoadingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-50"
              title="Imprimir documento"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onDescargarPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF Oficial'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Authentic Official PDF Viewer */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-3 overflow-hidden flex flex-col">
          {isLoadingPdf ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-4" />
              <h4 className="text-base font-bold text-white mb-1">
                Generando documento oficial...
              </h4>
              <p className="text-xs text-slate-400 max-w-md">
                Inyectando información en las casillas reglamentarias de la plantilla oficial de la Resolución 1051 de 2025.
              </p>
            </div>
          ) : loadError ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
              <h4 className="text-base font-bold text-white mb-2">{loadError}</h4>
              <button
                type="button"
                onClick={onDescargarPdf}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar PDF directamente</span>
              </button>
            </div>
          ) : pdfBlobUrl ? (
            <iframe
              src={`${pdfBlobUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className="w-full h-full rounded-xl border border-slate-800 bg-slate-900 shadow-inner"
              title="Formulario Único Nacional Oficial (Res. 1051/2025)"
            />
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Plantilla oficial de 4 páginas conforme a la Resolución 1051 de 2025 y Decreto 1077 de 2015</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Predio: <span className="font-semibold text-slate-300">{solicitud.predio.direccionActual || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
