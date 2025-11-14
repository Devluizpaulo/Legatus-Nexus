"use client";

import type { Appointment, Deadline } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, GanttChartSquare } from 'lucide-react';

type CalendarEvent = (Appointment & { eventType: 'appointment' }) | (Deadline & { eventType: 'deadline' });

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function DayView({ events, onEventClick }: DayViewProps) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Nenhum evento para este dia.
      </div>
    );
  }
  
  const isDeadline = (event: any): event is Deadline & { eventType: 'deadline' } => {
    return event?.eventType === 'deadline';
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <Card 
          key={event.id} 
          onClick={() => onEventClick(event)}
          className={cn(
            "cursor-pointer hover:shadow-lg transition-shadow",
            appointmentColors[event.type as keyof typeof appointmentColors].border,
            "border-l-4"
          )}
        >
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-start gap-4">
            <div className="md:col-span-1">
              <p className="text-2xl font-bold">{event.time}</p>
              <Badge variant="secondary" className="mt-1">{event.type}</Badge>
            </div>
            <div className="md:col-span-3">
               <h3 className="font-semibold text-lg flex items-center gap-2">
                 {isDeadline(event) && <GanttChartSquare className="h-4 w-4 text-muted-foreground" />}
                 {event.title}
               </h3>
              { 'description' in event && event.description && (
                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              )}
              { 'location' in event && event.location && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
