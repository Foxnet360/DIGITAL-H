import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Linkedin, Phone, CheckCircle2, Compass, ArrowRight } from 'lucide-react';
import { Lead } from '../../types';
import { trackEvent, trackCTAClick } from '../../utils/analytics';
import BookingCalendar from '../BookingCalendar';
import ResultsPDF from './ResultsPDF';

interface CTAProps {
  lead: Lead;
  answers: Record<string, number>;
  shareUrl?: string;
}

// 1. Hero score card buttons
export function ResultsHeroCTAs({ lead, answers, shareUrl }: CTAProps) {
  return (
    <div className="space-y-4 pt-4">
      {/* CTA Primario: Agendar consultoría */}
      <a
        href="#booking-section"
        onClick={() => {
          trackEvent('digital_h_cta_click', {
            cta_type: 'schedule_consultation',
            cta_location: 'results_hero',
            flow_version: 'v2_q48_capture'
          });
        }}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center shadow-xl shadow-primary-200 hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        <Phone className="w-6 h-6 mr-3" />
        Reservar mi sesión de 30 min con profesionales
      </a>
      
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {/* CTA Secundario: Descargar PDF */}
        <ResultsPDF answers={answers} lead={lead} variant="simple" />
        
        {/* CTA Terciario: Compartir */}
        <button 
          onClick={() => {
            trackEvent('digital_h_cta_click', {
              cta_type: 'share_linkedin',
              cta_location: 'results_hero',
              flow_version: 'v2_q48_capture'
            });
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl || 'https://acrux.life/digital-h/')}`, '_blank');
          }}
          className="px-4 py-3 text-slate-500 hover:text-[#0077b5] rounded-xl font-semibold text-sm flex items-center hover:bg-slate-50 transition-all"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Compartir
        </button>
      </div>
    </div>
  );
}

// 2. Persuasive blue banner
export function ResultsPersuasiveCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary-200"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold">
            <Calendar className="w-4 h-4 mr-2" />
            Consultoría gratuita disponible
          </div>
          <h2 className="text-3xl font-bold">¿Quieres profundizar en tus resultados?</h2>
          <p className="text-indigo-100 text-lg">
            Agenda una consultoría gratuita de 30 minutos con nuestros expertos en transformación digital.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>Análisis personalizado de tus resultados</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>Hoja de ruta priorizada para tu empresa</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>Sin compromiso ni costo</span>
            </li>
          </ul>
        </div>
        <a
          href="#booking-section"
          onClick={() => {
            trackEvent('digital_h_cta_click', {
              cta_type: 'schedule_consultation',
              cta_location: 'results_persuasive_section',
              flow_version: 'v2_q48_capture'
            });
          }}
          className="px-10 py-5 bg-white text-primary-700 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
        >
          <Phone className="w-6 h-6" />
          Reservar mi consultoría
        </a>
      </div>
    </motion.div>
  );
}

// 3. Custom Booking Calendar
export function ResultsBookingSection({ lead }: { lead: Lead }) {
  return (
    <motion.div
      id="booking-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto scroll-mt-20"
    >
      <BookingCalendar
        leadEmail={lead.email}
        leadName={lead.name}
        company={lead.company || 'No especificado'}
      />
    </motion.div>
  );
}

// 4. Bottom 3 cards (Calendly, solutions, PDF download)
export function ResultsBottomCTAs({ lead, answers }: CTAProps) {
  return (
    <div className="max-w-6xl mx-auto mt-16">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 text-center mb-8">
          ¿Quieres profundizar en tus resultados?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Native Booking Link */}
          <a
            href="#booking-section"
            onClick={() => {
              trackCTAClick('booking_section');
            }}
            className="group bg-primary-50 rounded-xl p-6 hover:bg-primary-100 transition-colors cursor-pointer text-left block"
          >
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Reservar consultoría</h3>
            <p className="text-sm text-slate-600 mb-4">30 minutos gratuitos para interpretar tus resultados con un consultor.</p>
            <span className="inline-flex items-center text-primary-600 text-sm font-semibold">
              Reservar ahora
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          {/* Services */}
          <a
            href="https://acrux.life/soluciones"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackCTAClick('services');
            }}
            className="group bg-accent-50 rounded-xl p-6 hover:bg-accent-100 transition-colors cursor-pointer text-left block"
          >
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Ver soluciones</h3>
            <p className="text-sm text-slate-600 mb-4">Conoce cómo ayudamos a empresas como la tuya a transformar su cultura.</p>
            <span className="inline-flex items-center text-accent text-sm font-semibold">
              Explorar
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          {/* PDF */}
          <ResultsPDF answers={answers} lead={lead} variant="card" />
        </div>
      </div>
    </div>
  );
}
