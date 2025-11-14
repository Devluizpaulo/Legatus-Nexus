"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthViewProps {
  currentDate: Date;
  appointmentsByDate: Map<string, Appointment[]>;
  onAppointmentClick: (appointment: Appointment) => void;
  onAddAppointment: (date: Date) => void;
  onViewDay: (date: Date) => void;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MAX_APPOINTMENTS_TO_SHOW = 2;

export default function MonthView({ currentDate, appointmentsByDate, onAppointmentClick, onAddAppointment, onViewDay }: MonthViewProps) {
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
              "h-36 p-2 border-b border-r flex flex-col overflow-hidden relative group",
              !isCurrentMonth && "bg-muted/30 text-muted-foreground"
            )}
          >
            <div className="flex justify-end items-center">
              <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onAddAppointment(day)}>
                      <Plus className="h-4 w-4" />
                  </Button>
                   <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onViewDay(day)}>
                      <Eye className="h-4 w-4" />
                  </Button>
              </div>
              <span className={cn(
                "h-7 w-7 flex items-center justify-center rounded-full text-sm",
                isToday(day) && "bg-primary text-primary-foreground"
              )}>
                {format(day, 'd')}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto -mx-1 px-1 mt-1">
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