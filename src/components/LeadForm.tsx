import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, Building2, Users2, ChevronRight, Lock, ShieldCheck, Phone, Briefcase, Globe } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

interface LeadFormProps {
  onSubmit: (data: { name: string; email: string; phone: string; company: string; size: string; role: string; industry: string; gdprConsent: boolean; gdprTimestamp: number }) => void;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    size: '',
    role: '',
    industry: '',
    gdprConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
      case 'phone':
        if (value && !/^[\d\s\-+()]{7,}$/.test(value)) {
          newErrors.phone = 'Teléfono inválido';
        } else {
          delete newErrors.phone;
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
    
    onSubmit({
      ...formData,
      gdprTimestamp: Date.now()
    });
    
    setIsSubmitting(false);
  };

  const industries = [
    'Tecnología y Software',
    'Manufactura',
    'Servicios Profesionales',
    'Comercio y Retail',
    'Salud',
    'Educación',
    'Finanzas y Seguros',
    'Construcción',
    'Turismo y Hospitalidad',
    'Otro'
  ];

  return (
    <>
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">¡Casi listo!</h2>
            <p className="text-slate-500">
              Completa tus datos para guardar tu progreso y desbloquear el análisis final de las últimas dimensiones.
            </p>
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

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Teléfono / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                    errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-100'
                  }`}
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  onBlur={e => validateField('phone', e.target.value)}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs ml-4">{errors.phone}</p>}
            </div>

            {/* Company */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Empresa *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="Nombre de tu organización"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={formData.company}
                  onChange={e => handleChange('company', e.target.value)}
                />
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Tamaño de Empresa *</label>
              <div className="relative">
                <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={formData.size}
                  onChange={e => handleChange('size', e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-250">51-250 empleados</option>
                  <option value="251-500">251-500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Cargo / Rol</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ej. Gerente General, CEO, Director de TI"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  value={formData.role}
                  onChange={e => handleChange('role', e.target.value)}
                />
              </div>
            </div>

            {/* Industry */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Industria / Sector</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={formData.industry}
                  onChange={e => handleChange('industry', e.target.value)}
                >
                  <option value="">Selecciona tu industria</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
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
                  Continuar al Diagnóstico
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Tus datos están protegidos y nunca serán compartidos con terceros.</span>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Privacy Modal */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}
