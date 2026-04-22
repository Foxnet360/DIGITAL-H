import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Rocket, Heart, Users, Cpu, BarChart3, Star } from 'lucide-react';
import { Question, Dimension } from '../types';
import { DIMENSIONS } from '../constants';

interface QuestionnaireProps {
  questions: Question[];
  currentIdx: number;
  answers: Record<string, number>;
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  points: number;
}

const ICONS: Record<string, any> = {
  Rocket, Heart, Users, Cpu, BarChart3, Star
};

export default function Questionnaire({
  questions,
  currentIdx,
  answers,
  onAnswer,
  onNext,
  onPrev,
  points
}: QuestionnaireProps) {
  const question = questions[currentIdx];
  const dimension = DIMENSIONS.find(d => d.id === question.dimension)!;
  const Icon = ICONS[dimension.icon];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  // Module indicator: calculate which dimensions are complete/in-progress
  const getDimensionStatus = () => {
    return DIMENSIONS.map(dim => {
      const dimQuestions = questions.filter(q => q.dimension === dim.id);
      const answeredCount = dimQuestions.filter(q => answers[q.id] !== undefined).length;
      return {
        ...dim,
        answeredCount,
        total: dimQuestions.length,
        isComplete: answeredCount === dimQuestions.length,
        isActive: dim.id === dimension.id
      };
    });
  };

  const dimensionStatus = getDimensionStatus();

  const options = [
    { value: 1, label: 'Totalmente en desacuerdo' },
    { value: 2, label: 'En desacuerdo' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'De acuerdo' },
    { value: 5, label: 'Totalmente de acuerdo' },
  ];

  return (
    <div className="min-h-screen bg-transparent p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${dimension.color}15` }}>
              <Icon className="w-6 h-6" style={{ color: dimension.color }} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                {dimension.name}
              </h4>
              <p className="text-xs text-slate-500">{currentIdx + 1} de {questions.length}</p>
            </div>
          </div>
            <div className="text-right">
            <div className="text-xs font-bold text-primary-600 uppercase tracking-widest">Puntos</div>
            <div className="text-2xl font-black text-primary-600">{points}</div>
          </div>
        </div>

        {/* Module/Dimension Indicators */}
        <div className="flex flex-wrap gap-2 mb-6">
          {dimensionStatus.map((dim) => (
            <div
              key={dim.id}
              className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                dim.isActive
                  ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300'
                  : dim.isComplete
                  ? 'bg-success/10 text-success'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {dim.isComplete && <span className="mr-1">✓</span>}
              {dim.name}
              <span className="ml-1 opacity-70">
                ({dim.answeredCount}/{dim.total})
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 rounded-full mb-12 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary-600"
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[400px] flex flex-col justify-between"
          >
            <div className="space-y-8">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                {question.text}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onAnswer(question.id, opt.value)}
                    className={`
                      p-4 rounded-2xl text-left transition-all border-2 flex items-center justify-between group
                      ${answers[question.id] === opt.value
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-slate-100 hover:border-primary-200 hover:bg-slate-50 text-slate-600'}
                    `}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${answers[question.id] === opt.value ? 'border-primary-600 bg-primary-600' : 'border-slate-200'}
                    `}>
                      {answers[question.id] === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
              <button
                onClick={onPrev}
                disabled={currentIdx === 0}
                className="flex items-center text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Anterior
              </button>
              
              <button
                onClick={onNext}
                disabled={!answers[question.id]}
                className={`
                  px-8 py-3 rounded-xl font-bold flex items-center transition-all
                  ${answers[question.id] 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                Siguiente
                <ChevronRight className="ml-1 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
