import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface FunnelHeaderProps {
  onVolverClick?: (e: React.MouseEvent) => void;
  title?: string;
}

export default function FunnelHeader({ onVolverClick, title = "Acrux Consultores" }: FunnelHeaderProps) {
  const handleVolver = (e: React.MouseEvent) => {
    if (onVolverClick) {
      onVolverClick(e);
    } else {
      window.location.href = 'https://acrux.life';
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <a 
                className="flex items-center gap-2 md:gap-3" 
                href="https://acrux.life" 
                onClick={handleVolver}
              >
                <img src="/acrux_logo_white.svg" alt="ACRUX" className="h-8 md:h-10 w-auto" />
                <span className="text-white/40 hidden md:inline">|</span>
                <span className="block font-display font-bold tracking-tight text-white text-xl leading-7">
                  {title}
                </span>
              </a>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <a 
                href="https://acrux.life" 
                onClick={handleVolver}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Volver a Acrux
              </a>
              <a 
                href="https://acrux.life/contacto"
                className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                Contactar consultor
              </a>
            </div>
            <div className="lg:hidden">
              <a 
                href="https://acrux.life" 
                onClick={handleVolver}
                className="text-white/70 hover:text-white p-2 flex items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
}