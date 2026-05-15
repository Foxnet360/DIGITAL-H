import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';

interface BookingCalendarProps {
  leadEmail: string;
  leadName: string;
  company: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingCalendar({ leadEmail, leadName, company }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate available dates (next 14 days, excluding weekends)
  const getAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 14) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Generate time slots for a date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    return slots.map(time => ({
      time,
      available: true // In real implementation, check against database
    }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setError(null);
    // Check if date is at least 24h in advance
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (date < tomorrow) {
      setError('Por favor selecciona una fecha con al menos 24 horas de anticipación');
      setAvailableSlots([]);
      return;
    }
    
    setAvailableSlots(generateTimeSlots(date));
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('./api/booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          name: leadName,
          company,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la reserva');
      }

      setBookingConfirmed(true);
      
      // Track booking
      if (window.gtag) {
        window.gtag('event', 'digital_h_booking_created', {
          flow_version: 'v2_q48_capture',
          booking_date: selectedDate.toISOString().split('T')[0]
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDates = getAvailableDates();

  if (bookingConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
      >
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-emerald-800 mb-2">¡Reserva confirmada!</h3>
        <p className="text-emerald-700 mb-2">
          Tu sesión está programada para el {selectedDate?.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })} a las {selectedTime}
        </p>
        <p className="text-sm text-emerald-600">
          Recibirás un email de confirmación con los detalles.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <Phone className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Reservar mi sesión de 30 min</h3>
          <p className="text-sm text-slate-500">Con Psicólogo Organizacional</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Date Selection */}
      <div className="mb-6">
        <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Selecciona una fecha
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            const dayNum = date.getDate();
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                className={`
                  p-3 rounded-xl text-center transition-all
                  ${isSelected 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}
                `}
              >
                <div className="text-xs uppercase font-medium">{dayName}</div>
                <div className="text-lg font-bold">{dayNum}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && availableSlots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Selecciona una hora
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`
                  py-3 px-4 rounded-xl text-center font-medium transition-all
                  ${selectedTime === slot.time
                    ? 'bg-primary-600 text-white shadow-lg'
                    : slot.available
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleBooking}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
          {isSubmitting ? 'Confirmando...' : `Confirmar reserva para ${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} a las ${selectedTime}`}
        </motion.button>
      )}
    </div>
  );
}
