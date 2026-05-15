import { describe, it, expect } from 'vitest';
import { calculateIMD, getMaturityLevel } from './utils';

describe('calculateIMD', () => {
  it('returns 0 for empty answers', () => {
    expect(calculateIMD({})).toBe(0);
  });

  it('calculates correct percentage', () => {
    // 240 points is max score.
    // If answers total 120, it should be 50%.
    const answers = { q1: 60, q2: 60 };
    expect(calculateIMD(answers)).toBe(50);
  });

  it('handles full score', () => {
    const answers = { q1: 100, q2: 100, q3: 40 };
    expect(calculateIMD(answers)).toBe(100);
  });

  it('rounds the result', () => {
    // 80 / 240 = 0.3333 -> 33
    const answers = { q1: 80 };
    expect(calculateIMD(answers)).toBe(33);
  });
});

describe('getMaturityLevel', () => {
  it('returns Inicial for <= 30', () => {
    expect(getMaturityLevel(0).name).toBe('Inicial');
    expect(getMaturityLevel(30).name).toBe('Inicial');
  });

  it('returns Emergente for <= 45', () => {
    expect(getMaturityLevel(31).name).toBe('Emergente');
    expect(getMaturityLevel(45).name).toBe('Emergente');
  });

  it('returns Desarrollo for <= 60', () => {
    expect(getMaturityLevel(46).name).toBe('Desarrollo');
    expect(getMaturityLevel(60).name).toBe('Desarrollo');
  });

  it('returns Avanzado for <= 75', () => {
    expect(getMaturityLevel(61).name).toBe('Avanzado');
    expect(getMaturityLevel(75).name).toBe('Avanzado');
  });

  it('returns Excelente for <= 90', () => {
    expect(getMaturityLevel(76).name).toBe('Excelente');
    expect(getMaturityLevel(90).name).toBe('Excelente');
  });

  it('returns Referente for > 90', () => {
    expect(getMaturityLevel(91).name).toBe('Referente');
    expect(getMaturityLevel(100).name).toBe('Referente');
  });
});
