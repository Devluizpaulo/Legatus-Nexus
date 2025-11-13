"use client";

import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { appointmentColors } from '@/lib/agenda-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface DayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function DayView({ appointments, onAppointmentClick }: DayViewProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Nenhum compromisso para este dia.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(apt => (
        <Card 
          key={apt.id} 
          onClick={() => onAppointmentClick(apt)}
          className={cn(
            "cursor-pointer hover:shadow-lg transition-shadow",
            appointmentColors[apt.type].border,
            "border-l-4"
          )}
        >
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 items-start gap-4">
            <div className="md:col-span-1">
              <p className="text-2xl font-bold">{apt.time}</p>
              <Badge variant="secondary" className="mt-1">{apt.type}</Badge>
            </div>
            <div className="md:col-span-3">
              <h3 className="font-semibold text-lg">{apt.title}</h3>
              {apt.description && (
                <p className="text-sm text-muted-foreground mt-1">{apt.description}</p>
              )}
              {apt.location && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {apt.location}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
