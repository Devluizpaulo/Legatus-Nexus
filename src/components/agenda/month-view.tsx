"use client";

import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameMonth, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';

interface MonthViewProps {
  currentDate: Date;
  appointmentsByDate: Map<string, Appointment[]>;
  onAppointmentClick: (appointment: Appointment) => void;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MAX_APPOINTMENTS_TO_SHOW = 2;

export default function MonthView({ currentDate, appointmentsByDate, onAppointmentClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: ptBR });
  const endDate = endOfWeek(monthEnd, { locale: ptBR });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {WEEK_DAYS.map(day => (
        <div key={day} className="text-center font-bold p-2 border-b border-r text-sm text-muted-foreground bg-secondary/30">
          {day}
        </div>
      ))}
      {days.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const appointmentsForDay = appointmentsByDate.get(dateKey) || [];
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        return (
          <div
            key={day.toString()}
            className={cn(
              "h-32 p-2 border-b border-r flex flex-col overflow-hidden",
              !isCurrentMonth && "bg-muted/30 text-muted-foreground"
            )}
          >
            <div className="flex justify-end">
              <span className={cn(
                "h-7 w-7 flex items-center justify-center rounded-full text-sm",
                isToday(day) && "bg-primary text-primary-foreground"
              )}>
                {format(day, 'd')}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto -mx-1 px-1">
                <ul className="space-y-1">
                    {appointmentsForDay.slice(0, MAX_APPOINTMENTS_TO_SHOW).map(apt => (
                        <li key={apt.id}>
                            <button 
                                onClick={() => onAppointmentClick(apt)}
                                className={cn(
                                    "w-full text-left p-1 rounded-md text-xs truncate",
                                    appointmentColors[apt.type].background,
                                    "border-l-2",
                                    appointmentColors[apt.type].border
                                )}
                            >
                                {apt.title}
                            </button>
                        </li>
                    ))}
                    {appointmentsForDay.length > MAX_APPOINTMENTS_TO_SHOW && (
                        <li className="text-xs text-muted-foreground mt-1">
                            + {appointmentsForDay.length - MAX_APPOINTMENTS_TO_SHOW} mais
                        </li>
                    )}
                </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
