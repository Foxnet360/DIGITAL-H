import React from 'react';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';

interface FunnelHeaderProps {
  onVolverClick?: (e: React.MouseEvent) => void;
  title?: string;
  showBackButton?: boolean;
}

export default function FunnelHeader({ onVolverClick, title = "DIGITAL-H", showBackButton = true }: FunnelHeaderProps) {
  const handleVolver = (e: React.MouseEvent) => {
    if (!showBackButton) {
      e.preventDefault();
      return;
    }
    if (onVolverClick) {
      onVolverClick(e);
    } else {
      window.location.href = 'https://acrux.life';
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D111A]/90 backdrop-blur-xl border-b border-accent/25 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo & Brand Identity */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {showBackButton ? (
                <a 
                  className="flex items-center gap-3 group" 
                  href="https://acrux.life" 
                  onClick={handleVolver}
                >
                  <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-xl flex items-center justify-center shadow-xs group-hover:border-accent/40 transition-all">
                    <img src="/logo.png" alt="ACRUX" className="h-7 md:h-8 w-auto object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold tracking-tight text-white text-sm md:text-base leading-none group-hover:text-accent transition-colors">
                      ACRUX <span className="text-accent text-xs font-serif">✦</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 font-sans">
                      {title}
                    </span>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 border border-white/20 backdrop-blur-md p-1.5 rounded-xl flex items-center justify-center shadow-xs">
                    <img src="/logo.png" alt="ACRUX" className="h-7 md:h-8 w-auto object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold tracking-tight text-white text-sm md:text-base leading-none">
                      ACRUX <span className="text-accent text-xs font-serif">✦</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 font-sans">
                      {title}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Reassurance Intent Badge (Center Desktop) */}
            <div className="hidden lg:flex items-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider font-sans shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Diagnóstico Ejecutivo 100% Confidencial
              </span>
            </div>

            {/* Action Buttons (Right) */}
            <div className="hidden md:flex items-center space-x-4">
              {showBackButton && (
                <a 
                  href="https://acrux.life" 
                  onClick={handleVolver}
                  className="text-white/80 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 hover:border-accent/40 transition-all flex items-center gap-1.5 font-display"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-accent" />
                  Volver a ACRUX
                </a>
              )}
              <a 
                href="https://acrux.life/contacto"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-primary font-bold px-4 py-2 rounded-xl text-xs hover:bg-accent/90 transition-all shadow-md flex items-center gap-1.5 font-display"
              >
                Contactar Consultor
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden items-center gap-2">
              {showBackButton && (
                <a 
                  href="https://acrux.life" 
                  onClick={handleVolver}
                  className="text-white/80 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 flex items-center"
                  aria-label="Volver a ACRUX"
                >
                  <ArrowLeft className="w-5 h-5 text-accent" />
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16 md:h-18" />
    </>
  );
}