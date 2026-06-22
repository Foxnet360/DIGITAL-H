import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Landing from './Landing';

// Mock IntersectionObserver for motion/react viewport animations
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Landing', () => {
  it('renders headline, subheadline and primary CTA', () => {
    render(<Landing onStart={() => {}} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '¿Tu empresa está perdiendo dinero por procesos manuales?'
    );
    expect(
      screen.getByText(
        /Descubre en 15 minutos tu nivel de madurez digital/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Obtener mi diagnóstico gratuito/i })
    ).toBeInTheDocument();
  });

  it('calls onStart when the primary CTA is clicked', () => {
    const onStart = vi.fn();
    render(<Landing onStart={onStart} />);

    fireEvent.click(
      screen.getByRole('button', { name: /Obtener mi diagnóstico gratuito/i })
    );

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
