"use client";

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment, Deadline } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';
import { Card, CardContent } from '@/components/ui/card';
import { GanttChartSquare } from 'lucide-react';

type CalendarEvent = (Appointment & { eventType: 'appointment' }) | (Deadline & { eventType: 'deadline' });

interface WeekViewProps {
  currentDate: Date;
  eventsByDate: Map<string, CalendarEvent[]>;
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({ currentDate, eventsByDate, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekEnd = endOfWeek(currentDate, { locale: ptBR });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const isDeadline = (event: any): event is Deadline & { eventType: 'deadline' } => {
    return event?.eventType === 'deadline';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 border-t border-l h-full">
      {days.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const eventsForDay = eventsByDate.get(dateKey) || [];

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
              {eventsForDay.map(event => (
                <Card 
                  key={event.id} 
                  onClick={() => onEventClick(event)} 
                  className={cn(
                      "cursor-pointer hover:shadow-md", 
                      appointmentColors[event.type as keyof typeof appointmentColors].background,
                      "border-l-4",
                      appointmentColors[event.type as keyof typeof appointmentColors].border
                  )}
                >
                  <CardContent className="p-2 text-sm">
                    <p className="font-semibold flex items-center gap-1.5">
                       {isDeadline(event) && <GanttChartSquare className="h-3 w-3 shrink-0" />}
                       {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                    { 'location' in event && <p className="text-xs text-muted-foreground truncate">{event.location}</p>}
                  </CardContent>
                </Card>
              ))}
               {eventsForDay.length === 0 && (
                 <div className="text-center text-muted-foreground text-xs pt-4">Nenhum evento</div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
