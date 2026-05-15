import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, User, Building2, ChevronRight, ShieldCheck, FileText, BarChart3, Award, Zap, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

interface LeadFormProps {
  onSubmit: (data: { name: string; email: string; phone: string; company: string; size: string; role: string; industry: string; gdprConsent: boolean; gdprTimestamp: number }) => void;
  elapsedTime?: number;
  questionsAnswered?: number;
  totalQuestions?: number;
  unlockedBadges?: string[];
}

export default function LeadForm({ 
  onSubmit, 
  elapsedTime = 0, 
  questionsAnswered = 48, 
  totalQuestions = 48,
  unlockedBadges = []
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    gdprConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const progressPercent = Math.round((questionsAnswered / totalQuestions) * 100);

  // Handle browser back/close attempt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showAbandonModal) {
        e.preventDefault();
        e.returnValue = '';
        setShowAbandonModal(true);
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showAbandonModal]);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      default:
        if (value) delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gdprConsent) {
      setErrors(prev => ({ ...prev, gdpr: 'Debes aceptar la política de privacidad' }));
      return;
    }
    
    setIsSubmitting(true);
    
    // Simular delay para mostrar estado de carga
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Track lead form submission
    if (window.gtag) {
      window.gtag('event', 'digital_h_start', {
        company_size: 'N/A',
        industry: 'N/A'
      });
    }

    // Enviar con campos opcionales vacíos para compatibilidad
    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: '',
      company: formData.company,
      size: '',
      role: '',
      industry: '',
      gdprConsent: formData.gdprConsent,
      gdprTimestamp: Date.now()
    });

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">¡Diagnóstico completado! 🎉</h2>
            <p className="text-slate-500">
              Has evaluado las 6 dimensiones de madurez digital. <strong>Tu reporte personalizado está listo.</strong>
            </p>
          </div>

          {/* Investment Summary Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Tiempo invertido: {formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span className="font-semibold">{questionsAnswered}/{totalQuestions} preguntas</span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-center text-sm font-medium">
              Tu reporte está {progressPercent}% listo — solo falta un paso
            </p>
            {unlockedBadges.length > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <Award className="w-4 h-4" />
                <span>{unlockedBadges.length} logros desbloqueados</span>
              </div>
            )}
          </div>

          {/* Preview de lo que recibirán */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 mb-8 border border-primary-100">
            <h3 className="text-sm font-bold text-primary-700 uppercase tracking-wider mb-4">Tu reporte incluye:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Reporte PDF</p>
                  <p className="text-xs text-slate-500">12 páginas personalizadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Análisis por dimensión</p>
                  <p className="text-xs text-slate-500">Gráficos detallados</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Hoja de ruta</p>
                  <p className="text-xs text-slate-500">Acciones priorizadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Nivel de madurez</p>
                  <p className="text-xs text-slate-500">Benchmark sectorial</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  placeholder="juan@empresa.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-100'
                  }`}
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={e => validateField('email', e.target.value)}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-4">{errors.email}</p>}
            </div>

            {/* Company - Opcional */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Empresa <span className="text-slate-400 font-normal">(opcional)</span></label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nombre de tu organización"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={formData.company}
                  onChange={e => handleChange('company', e.target.value)}
                />
              </div>
            </div>

            {/* GDPR */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start space-x-3">
                <input
                  id="gdpr"
                  type="checkbox"
                  checked={formData.gdprConsent}
                  onChange={e => {
                    setFormData({ ...formData, gdprConsent: e.target.checked });
                    if (e.target.checked) {
                      setErrors(prev => { const { gdpr, ...rest } = prev; return rest; });
                    }
                  }}
                  className={`mt-1 w-5 h-5 rounded border-2 cursor-pointer transition-colors ${
                    errors.gdpr ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                <label htmlFor="gdpr" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                  Acepto el tratamiento de mis datos personales para recibir el diagnóstico y comunicaciones relacionadas. 
                  He leído y acepto la{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-primary-600 underline hover:text-primary-700 font-semibold"
                  >
                    política de privacidad
                  </button>.
                </label>
              </div>
              {errors.gdpr && <p className="text-red-500 text-sm ml-8">{errors.gdpr}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 flex items-center justify-center hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  Ver mi reporte personalizado
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Tus datos están protegidos y nunca serán compartidos.</span>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Abandonment Modal */}
      {showAbandonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAbandonModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl z-10 text-center"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-800 mb-3">
              ¿Estás seguro de abandonar?
            </h3>
            <p className="text-slate-500 mb-8">
              Estás a punto de perder tu análisis completo y benchmark personalizado. 
              Has invertido {formatTime(elapsedTime)} respondiendo {questionsAnswered} preguntas.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setShowAbandonModal(false)}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all cursor-pointer"
              >
                Continuar y ver mi reporte
              </button>
              <button
                onClick={() => {
                  setShowAbandonModal(false);
                  window.location.href = 'https://acrux.life';
                }}
                className="w-full py-4 bg-transparent text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Salir sin guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Privacy Modal */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}
