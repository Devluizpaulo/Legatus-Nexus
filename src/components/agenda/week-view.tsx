"use client";

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';
import { Card, CardContent } from '@/components/ui/card';

interface WeekViewProps {
  currentDate: Date;
  appointmentsByDate: Map<string, Appointment[]>;
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function WeekView({ currentDate, appointmentsByDate, onAppointmentClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekEnd = endOfWeek(currentDate, { locale: ptBR });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 border-t border-l h-full">
      {days.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const appointmentsForDay = appointmentsByDate.get(dateKey) || [];

        return (
          <div
            key={day.toString()}
            className="border-b border-r flex flex-col"
          >
            <div className={cn(
                "p-2 text-center border-b-2",
                isToday(day) ? "border-primary text-primary font-bold" : "border-transparent"
            )}>
              <p className="text-sm capitalize">{format(day, 'EEE', { locale: ptBR })}</p>
              <p className="text-2xl">{format(day, 'd')}</p>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {appointmentsForDay.map(apt => (
                <Card 
                  key={apt.id} 
                  onClick={() => onAppointmentClick(apt)} 
                  className={cn(
                      "cursor-pointer hover:shadow-md", 
                      appointmentColors[apt.type].background,
                      "border-l-4",
                      appointmentColors[apt.type].border
                  )}
                >
                  <CardContent className="p-2 text-sm">
                    <p className="font-semibold">{apt.title}</p>
                    <p className="text-xs text-muted-foreground">{apt.time}</p>
                    <p className="text-xs text-muted-foreground truncate">{apt.location}</p>
                  </CardContent>
                </Card>
              ))}
               {appointmentsForDay.length === 0 && (
                 <div className="text-center text-muted-foreground text-xs pt-4">Nenhum compromisso</div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
