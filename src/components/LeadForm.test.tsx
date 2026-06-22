import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import LeadForm from './LeadForm';

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn()
}));

describe('LeadForm', () => {
  it('renders required fields and submit button', () => {
    render(<LeadForm onSubmit={vi.fn()} />);

    expect(
      screen.getByPlaceholderText(/Ej\. Juan Pérez/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/juan@empresa\.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ver mi reporte personalizado/i })
    ).toBeInTheDocument();
  });

  it('blocks submit and shows error when GDPR consent is not given', async () => {
    const onSubmit = vi.fn();
    render(<LeadForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/Ej\. Juan Pérez/i), {
      target: { value: 'Juan Pérez' }
    });
    fireEvent.change(screen.getByPlaceholderText(/juan@empresa\.com/i), {
      target: { value: 'juan@empresa.com' }
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Ver mi reporte personalizado/i })
    );

    expect(
      await screen.findByText(/Debes aceptar la política de privacidad/i)
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits data when required fields and GDPR consent are provided', async () => {
    const onSubmit = vi.fn();
    render(<LeadForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/Ej\. Juan Pérez/i), {
      target: { value: 'Juan Pérez' }
    });
    fireEvent.change(screen.getByPlaceholderText(/juan@empresa\.com/i), {
      target: { value: 'juan@empresa.com' }
    });

    const gdprCheckbox = screen.getByRole('checkbox', {
      name: /Acepto el tratamiento de mis datos personales/i
    });
    fireEvent.click(gdprCheckbox);

    fireEvent.click(
      screen.getByRole('button', { name: /Ver mi reporte personalizado/i })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Juan Pérez',
        email: 'juan@empresa.com',
        gdprConsent: true
      })
    );
  });
});
