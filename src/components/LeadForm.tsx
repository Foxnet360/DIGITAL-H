import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, User, Building2, Users2, ChevronRight, Lock, ShieldCheck } from 'lucide-react';

interface LeadFormProps {
  onSubmit: (data: { name: string; email: string; company: string; size: string; gdprConsent: boolean; gdprTimestamp: number }) => void;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: '',
    gdprConsent: false
  });
  const [gdprError, setGdprError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gdprConsent) {
      setGdprError(true);
      return;
    }
    onSubmit({
      ...formData,
      gdprTimestamp: Date.now()
    });
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">¡Casi listo!</h2>
          <p className="text-slate-500">
            Completa tus datos para guardar tu progreso y desbloquear el análisis final de las últimas dimensiones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="text"
                placeholder="Ej. Juan Pérez"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="email"
                placeholder="juan@empresa.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="text"
                placeholder="Nombre de tu organización"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Tamaño de Empresa</label>
            <div className="relative">
              <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                value={formData.size}
                onChange={e => setFormData({ ...formData, size: e.target.value })}
              >
                <option value="">Selecciona una opción</option>
                <option value="1-10">1-10 empleados</option>
                <option value="11-50">11-50 empleados</option>
                <option value="51-250">51-250 empleados</option>
                <option value="250+">Más de 250 empleados</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <input
                id="gdpr"
                type="checkbox"
                checked={formData.gdprConsent}
                onChange={e => {
                  setFormData({ ...formData, gdprConsent: e.target.checked });
                  setGdprError(false);
                }}
                className={`mt-1 w-5 h-5 rounded border-2 cursor-pointer transition-colors ${
                  gdprError ? 'border-error' : 'border-slate-300'
                }`}
              />
              <label htmlFor="gdpr" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                Acepto el tratamiento de mis datos personales para recibir el diagnóstico y comunicaciones relacionadas. 
                He leído y acepto la <a href="#" className="text-primary-600 underline">política de privacidad</a>.
              </label>
            </div>
            {gdprError && (
              <p className="text-error text-sm ml-8">Debes aceptar la política de privacidad para continuar.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 flex items-center justify-center hover:bg-primary-700 transition-colors mt-8"
          >
            Continuar al Diagnóstico
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mt-4">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Tus datos están protegidos y nunca serán compartidos con terceros.</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
