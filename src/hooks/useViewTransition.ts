import { flushSync } from 'react-dom';

/**
 * Hook para manejar transiciones de vista usando la View Transition API del navegador.
 * Fallback instantáneo para navegadores sin soporte.
 */
export function useViewTransition() {
  const supportsViewTransitions = typeof document !== 'undefined' && 
    'startViewTransition' in document;

  const transition = (callback: () => void, _options?: { name?: string }) => {
    if (!supportsViewTransitions) {
      callback();
      return;
    }

    // Usar la API nativa del navegador con flushSync para actualización sincrónica del DOM
    const viewTransition = (document as any).startViewTransition(() => {
      flushSync(() => {
        callback();
      });
    });

    // Manejar errores silenciosamente
    viewTransition.finished.catch(() => {
      // Ignorar errores si la transición es interrumpida
    });
  };

  return { transition, supportsViewTransitions };
}
