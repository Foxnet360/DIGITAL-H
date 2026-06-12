import React from 'react';
import { Shield, Lock, CheckCircle, Mail } from 'lucide-react';

export default function FunnelFooter() {
  return (
    <footer className="w-full bg-secondary text-white border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="https://acrux.life" className="inline-block mb-4">
              <img src="/acrux_logo.svg" alt="ACRUX Consultores" className="h-8 w-auto" />
            </a>
            <p className="text-white/80 text-sm mt-2">
              Parte de ACRUX Consultores
            </p>
            <p className="text-white/80 text-xs mt-1">
              Arquitectos de Sistemas Humanos
            </p>
            <a
              href="mailto:hola@acrux.life"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mt-4"
            >
              <Mail className="w-4 h-4 text-accent" />
              hola@acrux.life
            </a>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">DIGITAL-H</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Hacer diagnóstico</a></li>
              <li><a href="https://acrux.life/soluciones" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Nuestros servicios</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="https://acrux.life/privacidad" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="https://acrux.life/terminos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="https://acrux.life/cookies" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Política de Cookies</a></li>
            </ul>
          </div>
          
          {/* Trust */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Confianza</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                Datos encriptados
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                GDPR compliant
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                50+ organizaciones
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} ACRUX Consultores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}