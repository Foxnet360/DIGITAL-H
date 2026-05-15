import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, ChevronRight, CheckCircle2, BarChart3, Users, Shield, Heart, Star, 
  ArrowRight, Clock, Award, TrendingUp, FileText, Lock, ChevronDown, Zap,
  MessageCircle, TrendingUp as TrendingIcon, Sparkles
} from 'lucide-react';
import { getUtmMessages, getUtmSource } from '../utm-messages';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const utmMessages = getUtmMessages();
  const utmSource = getUtmSource();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { icon: FileText, label: 'Reporte PDF', desc: 'Personalizado con tu marca' },
    { icon: TrendingIcon, label: 'Hoja de Ruta', desc: 'Acciones priorizadas' },
  ];

  const faqs = [
    {
      q: '¿Es realmente gratuito?',
      a: 'Sí, el diagnóstico DIGITAL-H es 100% gratuito. No se requiere tarjeta de crédito ni compromiso de ningún tipo. Recibirás tu reporte completo sin costo.'
    },
    {
      q: '¿Cuánto tiempo toma?',
      a: 'Aproximadamente 15-20 minutos para completar las 48 preguntas. Puedes pausar y continuar después si lo necesitas.'
    },
    {
      q: '¿Qué tan preciso es?',
      a: 'DIGITAL-H evalúa 6 dimensiones críticas con 48 indicadores validados. Es utilizado por consultores especializados en transformación digital.'
    },
    {
      q: '¿Mis datos están seguros?',
      a: 'Absolutamente. Tus datos están protegidos bajo nuestra política de privacidad. Nunca compartimos información con terceros.'
    }
  ];

  const headline = utmMessages.headline;
  const subheadline = utmMessages.subheadline;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-accent-50/30 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl pointer-events-none" />
      
      {/* Social Proof Band - Fixed top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 bg-slate-900 text-white py-2.5 px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span><strong>50+</strong> empresas evaluadas</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span><strong>4.8/5</strong> rating promedio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>100% <strong>Gratuito</strong></span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center relative z-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl w-full space-y-8 relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-200/50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {utmMessages.badge || "Transformación Digital para empresas de cualquier tamaño"}
          </motion.div>
          
          {/* Main Title - PAS Formula */}
          <div className="space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
            >
              <span className="text-slate-900">{headline}</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              {subheadline}
            </motion.p>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(30, 58, 95, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-bold text-lg sm:text-xl shadow-xl shadow-primary-300/50 flex items-center mx-auto gap-2 group"
            >
              {utmMessages.ctaText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Sin compromiso
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Resultados en 15 min
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                100% confidencial
              </span>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-6"
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
        </motion.div>
      </div>

      {/* Report Preview Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 py-16 px-4 bg-white/80 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Así se ve tu <span className="text-primary-600">reporte personalizado</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Un documento profesional con tu marca que podrás compartir con tu equipo
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-200 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Mockup del PDF */}
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 transform rotate-[-2deg]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Reporte_DIGITAL-H.pdf</p>
                      <p className="text-xs text-slate-500">12 páginas • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full w-full" />
                    <div className="h-2 bg-slate-100 rounded-full w-4/5" />
                    <div className="h-2 bg-primary-100 rounded-full w-3/5" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-16 bg-primary-50 rounded-lg flex-1" />
                    <div className="h-16 bg-accent-50 rounded-lg flex-1" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ¡Gratis!
                </div>
              </div>
              
              {/* Benefits list */}
              <div className="space-y-4">
                {[
                  { icon: BarChart3, text: 'Puntuación IMD con gráficos detallados' },
                  { icon: TrendingUp, text: 'Análisis por cada una de las 6 dimensiones' },
                  { icon: Award, text: 'Nivel de madurez con comparativa sectorial' },
                  { icon: Zap, text: 'Hoja de ruta con acciones priorizadas' },
                  { icon: MessageCircle, text: 'Recomendaciones personalizadas' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-slate-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dimensions Grid */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              6 dimensiones que transformarán tu empresa
            </h2>
            <p className="text-slate-600">
              Evaluamos cada área crítica de tu madurez digital
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dimensions.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
              >
                <div className={`p-3 ${item.bg} rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-sm font-bold text-slate-800">{item.label}</span>
                <span className="text-xs text-slate-500 mt-1">{item.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 py-16 px-4 bg-white/80 backdrop-blur-sm"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Preguntas frecuentes
            </h2>
            <p className="text-slate-600">
              Todo lo que necesitas saber antes de comenzar
            </p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-slate-600">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            ¿Listo para descubrir tu <span className="text-primary-600">nivel de madurez digital</span>?
          </h2>
          <p className="text-lg text-slate-600">
            Únete a las 50+ empresas que ya han transformado su manera de trabajar
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-bold text-lg shadow-xl flex items-center mx-auto gap-2"
          >
            Comenzar mi diagnóstico ahora
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Sticky CTA Mobile */}
      {isMobile && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg"
        >
          <button
            onClick={onStart}
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-bold text-base shadow-lg flex items-center justify-center gap-2"
          >
            Obtener diagnóstico gratuito
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
