import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          { /* Backdrop */ }
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          { /* Modal */ }
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            { /* Header */ }
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Política de Privacidad</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            { /* Content */ }
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed">
                  En Acrux Consultores, nos comprometemos a proteger tu información personal. 
                  Esta política de privacidad describe cómo recopilamos, usamos y protegemos tus datos 
                  cuando utilizas nuestro diagnóstico DIGITAL-H.
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mt-6">1. Información que Recopilamos</h4>
                <p className="text-slate-600">
                  Recopilamos: nombre, correo electrónico, nombre de empresa, tamaño de empresa, 
                  respuestas al cuestionario y puntuación de madurez digital.
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mt-6">2. Uso de la Información</h4>
                <p className="text-slate-600">
                  Utilizamos tu información para: generar tu diagnóstico personalizado, 
                  enviarte el reporte por correo, contactarte sobre servicios de consultoría 
                  (solo si das tu consentimiento), y mejorar nuestros servicios.
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mt-6">3. Protección de Datos</h4>
                <p className="text-slate-600">
                  Tus datos se almacenan de forma segura en servidores con cifrado SSL. 
                  No compartimos tu información con terceros sin tu consentimiento explícito.
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mt-6">4. Tus Derechos</h4>
                <p className="text-slate-600">
                  Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos. 
                  Para ejercer estos derechos, contacta a: contacto@acrux.life
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mt-6">5. Contacto</h4>
                <p className="text-slate-600">
                  Si tienes preguntas sobre esta política, contáctanos en contacto@acrux.life
                </p>
              </div>
            </div>
            
            { /* Footer */ }
            <div className="p-6 border-t border-slate-100 flex items-center justify-between">
              <a
                href="https://acrux.life/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Ver política completa
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
