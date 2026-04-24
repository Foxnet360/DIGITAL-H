import React from 'react';
import { motion } from 'motion/react';
import { Rocket, ChevronRight, CheckCircle2, BarChart3, Users, Shield, Heart, Star, ArrowRight, Clock, Award, TrendingUp } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const dimensions = [
    { icon: Rocket, label: 'Estrategia Digital', color: 'text-primary-600', bg: 'bg-primary-50', description: 'Visión, roadmap y gobernanza' },
    { icon: Heart, label: 'Cultura y Liderazgo', color: 'text-red-500', bg: 'bg-red-50', description: 'Mindset digital y valores' },
    { icon: Users, label: 'Talento y Competencias', color: 'text-cyan-600', bg: 'bg-cyan-50', description: 'People analytics y RRHH 4.0' },
    { icon: Shield, label: 'Tecnología e Infraestructura', color: 'text-purple-600', bg: 'bg-purple-50', description: 'Stack tech y ciberseguridad' },
    { icon: BarChart3, label: 'Procesos y Datos', color: 'text-amber-600', bg: 'bg-amber-50', description: 'Automatización y analytics' },
    { icon: Star, label: 'Experiencia y Bienestar', color: 'text-emerald-600', bg: 'bg-emerald-50', description: 'Engagement y eNPS' },
  ];

  const benefits = [
    { icon: Clock, label: '15-20 minutos', desc: 'Diagnóstico completo' },
    { icon: Award, label: 'Reporte PDF', desc: 'Personalizado con tu marca' },
    { icon: TrendingUp, label: 'Hoja de Ruta', desc: 'Acciones priorizadas' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-accent-50/30 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl w-full space-y-10 relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-200/50"
        >
          <Rocket className="w-4 h-4 mr-2" />
          Transformación Digital para PYMEs
        </motion.div>
        
        {/* Main Title */}
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none"
          >
            <span className="text-primary-900">DIGITAL</span>
            <span className="text-accent-500">-H</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Descubre el nivel de madurez digital de tu organización con nuestro 
            <span className="font-semibold text-primary-700">diagnóstico holístico</span>. 
            Obtén insights accionables y una hoja de ruta personalizada.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-8 text-slate-500"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">48 Preguntas</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">6 Dimensiones</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">100% Gratuito</span>
          </div>
        </motion.div>

        {/* Dimensions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {dimensions.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + 0.1 * i }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-default"
            >
              <div className={`p-3 ${item.bg} rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="text-sm font-bold text-slate-800">{item.label}</span>
              <span className="text-xs text-slate-500 mt-1">{item.description}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(30, 58, 95, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-bold text-lg shadow-xl shadow-primary-300/50 flex items-center mx-auto gap-2 group"
          >
            Comenzar Mi Diagnóstico
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <p className="text-sm text-slate-400 mt-4">
            Tiempo estimado: 15-20 minutos • Sin compromiso
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-center gap-12 pt-8"
        >
          {benefits.map((benefit) => (
            <div key={benefit.label} className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <benefit.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">{benefit.label}</p>
                <p className="text-xs text-slate-500">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="pt-12 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500">
            Una herramienta de{' '}
            <a href="https://acrux.life" className="text-primary-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
              Acrux Consultores
            </a>
            {' '}• Arquitectos de Sistemas Humanos
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
