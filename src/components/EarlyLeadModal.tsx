import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

interface EarlyLeadModalProps {
  isOpen: boolean;
  onSave: (data: { name: string; email: string; company: string; gdprConsent: boolean }) => void;
  scoreEstrategia?: number;
}

export default function EarlyLeadModal({ isOpen, onSave, scoreEstrategia = 85 }: EarlyLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    gdprConsent: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email corporativo válido';
    }
    if (!formData.gdprConsent) {
      newErrors.gdpr = 'Debes aceptar la política de privacidad';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Submit lead to parent
    onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8 relative overflow-hidden"
        >
          {/* Accent glow top */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¡Módulo 1 Completado con Éxito!
            </div>
            
            <h3 className="text-2xl font-display font-bold text-slate-900 leading-snug">
              Guarda tu progreso de <span className="text-primary-600">Estrategia Digital</span>
            </h3>
            
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Has evaluado la primera dimensión crítica. Registrá tus datos para respaldar tu diagnóstico y continuar sin perder tus respuestas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Ej. Carlos Mendoza"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-slate-800 text-sm font-sans transition-all"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Corporativo *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="carlos@tuempresa.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-slate-800 text-sm font-sans transition-all"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Empresa / Organización <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nombre de tu empresa"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-slate-800 text-sm font-sans transition-all"
              />
            </div>

            {/* GDPR Consent */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-sans">
                <input
                  type="checkbox"
                  checked={formData.gdprConsent}
                  onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
                  className="mt-0.5 rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span>
                  Acepto la{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-primary-600 underline font-semibold hover:text-primary-800"
                  >
                    política de privacidad
                  </button>{' '}
                  y el envío de mi reporte personalizado.
                </span>
              </label>
              {errors.gdpr && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.gdpr}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-300/50 flex items-center justify-center gap-2 group transition-all text-base mt-2"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar y Continuar Diagnóstico'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400 font-sans">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-accent" /> Datos 100% Encriptados
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sin Spam
            </span>
          </div>

          <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
