import React from 'react';
import { Shield, Lock, CheckCircle2, Mail, ExternalLink } from 'lucide-react';

export default function FunnelFooter() {
  return (
    <footer className="w-full bg-[#0D111A] text-white border-t-2 border-accent/40 relative overflow-hidden py-14 font-sans">
      {/* Glow ambiental en esquina */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-3">
            <a href="https://acrux.life" className="inline-flex items-center gap-3 group">
              <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-xl flex items-center justify-center shadow-xs group-hover:border-accent/40 transition-all">
                <img src="/logo.png" alt="ACRUX" className="h-7 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-tight text-white text-base leading-none group-hover:text-accent transition-colors">
                  ACRUX <span className="text-accent text-xs">✦</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 font-sans">
                  Consultores
                </span>
              </div>
            </a>
            
            <p className="text-white/70 text-xs leading-relaxed font-sans mt-3">
              Arquitectos de Sistemas Humanos. Acompañamos a organizaciones en su transición cultural y tecnológica.
            </p>
            
            <div className="pt-2">
              <a
                href="mailto:hola@acrux.life"
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl"
              >
                <Mail className="w-3.5 h-3.5 text-accent" />
                hola@acrux.life
              </a>
            </div>
          </div>
          
          {/* Lead Magnets Column */}
          <div>
            <h4 className="font-display font-bold text-accent mb-4 text-xs uppercase tracking-widest">Herramientas & Diagnósticos</h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-sans">
              <li>
                <a href="/digital-h/" className="hover:text-accent transition-colors flex items-center gap-1.5 font-semibold text-white">
                  <span>• DIGITAL-H (Madurez Digital)</span>
                </a>
              </li>
              <li>
                <a href="/pulso-h/" className="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>• PULSO-H (Riesgo Psicosocial)</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a href="/calculadora-roi/" className="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>• Calculadora ROI de Liderazgo</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a href="https://acrux.life/metodologia" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1.5">
                  <span>• Metodología &amp; Soluciones</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h4 className="font-display font-bold text-accent mb-4 text-xs uppercase tracking-widest">Garantías Legales</h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-sans">
              <li><a href="https://acrux.life/privacidad" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Política de Privacidad</a></li>
              <li><a href="https://acrux.life/terminos" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Términos y Condiciones</a></li>
              <li><a href="https://acrux.life/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Política de Cookies</a></li>
              <li className="text-white/40 pt-1 text-[11px]">Habeas Data Ley 1581</li>
            </ul>
          </div>
          
          {/* Trust Column */}
          <div>
            <h4 className="font-display font-bold text-accent mb-4 text-xs uppercase tracking-widest">Confianza &amp; Seguridad</h4>
            <ul className="space-y-3 text-xs text-white/80 font-sans">
              <li className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-xl">
                <Shield className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Datos 100% Encriptados (SSL)</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-xl">
                <Lock className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Uso Estrictamente Confidencial</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Validado en 50+ Organizaciones</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom Line */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60 font-sans text-center md:text-left">
          <p>© {new Date().getFullYear()} ACRUX Consultores S.A.S. Todos los derechos reservados.</p>
          <p className="text-accent/80 font-mono text-[11px] bg-white/5 px-3 py-1 rounded-full border border-white/10">
            NIT 900.230.435-1 • Colombia &amp; Latinoamérica
          </p>
        </div>
      </div>
    </footer>
  );
}