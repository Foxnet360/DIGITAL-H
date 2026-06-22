import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Questionnaire from './Questionnaire';
import { QUESTIONS } from '../constants';

describe('Questionnaire', () => {
  it('renders current question text and all five answer options', () => {
    render(
      <Questionnaire
        questions={QUESTIONS}
        currentIdx={0}
        answers={{}}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
        points={0}
      />
    );

    expect(
      screen.getByRole('heading', { name: QUESTIONS[0].text })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Totalmente en desacuerdo$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Totalmente de acuerdo$/i })
    ).toBeInTheDocument();
  });

  it('calls onAnswer with the question id and selected value', () => {
    const onAnswer = vi.fn();
    render(
      <Questionnaire
        questions={QUESTIONS}
        currentIdx={0}
        answers={{}}
        onAnswer={onAnswer}
        onNext={vi.fn()}
        onPrev={vi.fn()}
        points={0}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /^De acuerdo$/i })
    );

    expect(onAnswer).toHaveBeenCalledWith(QUESTIONS[0].id, 4);
  });

  it('shows the current dimension indicator and progress', () => {
    render(
      <Questionnaire
        questions={QUESTIONS}
        currentIdx={0}
        answers={{}}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
        points={0}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Estrategia Digital', level: 4 })
    ).toBeInTheDocument();
    expect(screen.getByText('1 de 48')).toBeInTheDocument();
  });
});
