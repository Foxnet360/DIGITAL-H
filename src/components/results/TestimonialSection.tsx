import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { getTestimonials } from '../../utils';

interface TestimonialSectionProps {
  level: string;
}

export default function TestimonialSection({ level }: TestimonialSectionProps) {
  const testimonials = getTestimonials(level);

  if (testimonials.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 w-full"
    >
      <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
        Empresas que ya transformaron su negocio
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-700 font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-800">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
                <p className="text-sm text-slate-400">{testimonial.company}</p>
              </div>
            </div>
            <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />
              {testimonial.metric}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
