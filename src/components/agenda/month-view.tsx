"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment, Deadline } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';
import { Plus, Eye, GanttChartSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CalendarEvent = (Appointment & { eventType: 'appointment' }) | (Deadline & { eventType: 'deadline' });

interface MonthViewProps {
  currentDate: Date;
  eventsByDate: Map<string, CalendarEvent[]>;
  onEventClick: (event: CalendarEvent) => void;
  onAddAppointment: (date: Date) => void;
  onViewDay: (date: Date) => void;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MAX_EVENTS_TO_SHOW = 2;

export default function MonthView({ currentDate, eventsByDate, onEventClick, onAddAppointment, onViewDay }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: ptBR });
  const endDate = endOfWeek(monthEnd, { locale: ptBR });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const isDeadline = (event: any): event is Deadline & { eventType: 'deadline' } => {
    return event?.eventType === 'deadline';
  }

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {WEEK_DAYS.map(day => (
        <div key={day} className="text-center font-bold p-2 border-b border-r text-sm text-muted-foreground bg-secondary/30">
          {day}
        </div>
      ))}
      {days.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const eventsForDay = eventsByDate.get(dateKey) || [];
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
                    {eventsForDay.slice(0, MAX_EVENTS_TO_SHOW).map(event => (
                        <li key={event.id}>
                            <button 
                                onClick={() => onEventClick(event)}
                                className={cn(
                                    "w-full text-left p-1 rounded-md text-xs truncate flex items-center gap-1.5",
                                    appointmentColors[event.type as keyof typeof appointmentColors].background,
                                    "border-l-2",
                                    appointmentColors[event.type as keyof typeof appointmentColors].border
                                )}
                            >
                               {isDeadline(event) && <GanttChartSquare className="h-3 w-3 shrink-0" />}
                               <span>{event.title}</span>
                            </button>
                        </li>
                    ))}
                    {eventsForDay.length > MAX_EVENTS_TO_SHOW && (
                        <li className="text-xs text-muted-foreground mt-1">
                            + {eventsForDay.length - MAX_EVENTS_TO_SHOW} mais
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
