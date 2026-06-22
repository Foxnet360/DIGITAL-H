import React from 'react';

/**
 * Test-only stub for `recharts`.
 *
 * Recharts' ResponsiveContainer cannot measure itself in jsdom and spends
 * non-trivial time trying to render before giving up. This mock replaces the
 * chart with a lightweight placeholder so Results tests focus on content.
 */

export const ResponsiveContainer: React.FC<
  React.PropsWithChildren<{ width?: string | number; height?: string | number }>
> = ({ children }) => <div data-testid="recharts-responsive-container">{children}</div>;

export const RadarChart: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => <div data-testid="recharts-radar-chart">{children}</div>;

export const Radar: React.FC<Record<string, unknown>> = () => (
  <div data-testid="recharts-radar" />
);

export const PolarGrid: React.FC = () => <div data-testid="recharts-polar-grid" />;

export const PolarAngleAxis: React.FC<Record<string, unknown>> = () => (
  <div data-testid="recharts-polar-angle-axis" />
);
