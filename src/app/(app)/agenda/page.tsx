"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, add, sub, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, GanttChartSquare } from 'lucide-react';
import type { Appointment, Deadline } from '@/lib/types';
import MonthView from '@/components/agenda/month-view';
import WeekView from '@/components/agenda/week-view';
import DayView from '@/components/agenda/day-view';
import AppointmentForm from '@/components/agenda/appointment-form';
import DeadlineForm from '@/components/deadlines/deadline-form';

type ViewMode = 'Mês' | 'Semana' | 'Dia';
type EventTypeFilter = 'Todos' | 'Compromissos' | 'Prazos';
type CalendarEvent = (Appointment & { eventType: 'appointment' }) | (Deadline & { eventType: 'deadline' });

export default function AgendaPage() {
  const { tenantData, addAppointment, updateAppointment, deleteAppointment, addDeadline, updateDeadline, deleteDeadline, currentUser } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('Mês');
  const [eventFilter, setEventFilter] = useState<EventTypeFilter>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [preSelectedDate, setPreSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (change: 'next' | 'prev') => {
    const period = viewMode === 'Mês' ? { months: 1 } : viewMode === 'Semana' ? { weeks: 1 } : { days: 1 };
    const newDate = change === 'next' ? add(currentDate, period) : sub(currentDate, period);
    setCurrentDate(newDate);
  };
  
  const handleOpenModal = (event?: CalendarEvent) => {
    setSelectedEvent(event || null);
    setPreSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleAddAppointmentOnDate = (date: Date) => {
    setSelectedEvent(null);
    setPreSelectedDate(date);
    setIsModalOpen(true);
  }

  const handleViewDay = (date: Date) => {
    setCurrentDate(date);
    setViewMode('Dia');
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setPreSelectedDate(null);
  };

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id' | 'tenantId'> | Appointment) => {
    if ('id' in appointmentData) {
      updateAppointment(appointmentData);
    } else {
      addAppointment(appointmentData);
    }
    handleCloseModal();
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    deleteAppointment(appointmentId);
    handleCloseModal();
  };

  const handleSaveDeadline = (deadlineData: Omit<Deadline, 'id' | 'tenantId'> | Deadline) => {
    if ('id' in deadlineData) {
      updateDeadline(deadlineData);
    } else {
      addDeadline(deadlineData);
    }
    handleCloseModal();
  };

  const handleDeleteDeadline = (deadlineId: string) => {
    deleteDeadline(deadlineId);
    handleCloseModal();
  };

  const combinedEvents = useMemo((): CalendarEvent[] => {
    if (!tenantData) return [];
    
    const appointments: CalendarEvent[] = (tenantData.appointments || []).map(a => ({ ...a, eventType: 'appointment' }));
    const deadlines: CalendarEvent[] = (tenantData.deadlines || []).map(d => ({ ...d, date: d.dueDate, title: `Prazo: ${d.title}`, time: '23:59', eventType: 'deadline' as const, type: 'Prazo' as const }));

    let allEvents = [...appointments, ...deadlines];

    if (eventFilter === 'Compromissos') {
        return allEvents.filter(e => e.eventType === 'appointment');
    }
    if (eventFilter === 'Prazos') {
        return allEvents.filter(e => e.eventType === 'deadline');
    }
    
    return allEvents;
  }, [tenantData, eventFilter]);
  
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    combinedEvents.forEach(event => {
        const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
        const eventsForDay = map.get(dateKey) || [];
        eventsForDay.push(event);
        map.set(dateKey, eventsForDay.sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    });
    return map;
  }, [combinedEvents]);

  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'Mês': return format(currentDate, 'MMMM yyyy', { locale: ptBR });
      case 'Semana':
        const start = startOfWeek(currentDate, { locale: ptBR });
        const end = endOfWeek(currentDate, { locale: ptBR });
        return `${format(start, 'd MMM', { locale: ptBR })} - ${format(end, 'd MMM yyyy', { locale: ptBR })}`;
      case 'Dia': return format(currentDate, 'd MMMM yyyy', { locale: ptBR });
    }
  };
  
  const isAppointment = (event: any): event is Appointment & { eventType: 'appointment' } => {
    return event?.eventType === 'appointment';
  }
  
  const isDeadline = (event: any): event is Deadline & { eventType: 'deadline' } => {
    return event?.eventType === 'deadline';
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleDateChange('prev')}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold w-48 text-center capitalize">{getHeaderTitle()}</h2>
            <Button variant="outline" size="icon" onClick={() => handleDateChange('next')}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex items-center gap-2">
            {viewMode === 'Dia' && (
              <Button variant="outline" onClick={() => setViewMode('Mês')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Voltar ao Calendário
              </Button>
            )}
            <Select value={eventFilter} onValueChange={(value: EventTypeFilter) => setEventFilter(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por evento" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos os Eventos</SelectItem>
                    <SelectItem value="Compromissos">Compromissos</SelectItem>
                    <SelectItem value="Prazos">Prazos</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex items-center bg-muted rounded-md p-1">
                {(['Mês', 'Semana', 'Dia'] as ViewMode[]).map(mode => (
                    <Button key={mode} variant={viewMode === mode ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode(mode)}>
                        {mode}
                    </Button>
                ))}
            </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => {
                setSelectedEvent(null);
                setPreSelectedDate(new Date());
                setIsModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Compromisso
            </Button>
             <Button variant="secondary" onClick={() => router.push('/deadlines')}>
                <GanttChartSquare className="mr-2 h-4 w-4" /> Novo Prazo
            </Button>
        </div>
      </header>

      <div className="flex-1 mt-4">
        {viewMode === 'Mês' && (
          <MonthView 
            currentDate={currentDate} 
            eventsByDate={eventsByDate} 
            onEventClick={handleOpenModal}
            onAddAppointment={handleAddAppointmentOnDate}
            onViewDay={handleViewDay}
          />
        )}
        {viewMode === 'Semana' && (
          <WeekView currentDate={currentDate} eventsByDate={eventsByDate} onEventClick={handleOpenModal} />
        )}
        {viewMode === 'Dia' && (
          <DayView currentDate={currentDate} events={eventsByDate.get(format(currentDate, 'yyyy-MM-dd')) || []} onEventClick={handleOpenModal} />
        )}
      </div>

      {isModalOpen && currentUser && tenantData && (
        <>
            {(!selectedEvent || isAppointment(selectedEvent)) && (
                <AppointmentForm 
                    isOpen={isModalOpen && (!selectedEvent || isAppointment(selectedEvent))}
                    onClose={handleCloseModal}
                    onSave={handleSaveAppointment}
                    onDelete={handleDeleteAppointment}
                    appointment={isAppointment(selectedEvent) ? selectedEvent : null}
                    preSelectedDate={preSelectedDate}
                    currentUser={currentUser}
                    users={tenantData.users}
                    clients={tenantData.clients}
                />
            )}
             {isDeadline(selectedEvent) && (
                <DeadlineForm
                    isOpen={isModalOpen && isDeadline(selectedEvent)}
                    onClose={handleCloseModal}
                    onSave={handleSaveDeadline}
                    onDelete={handleDeleteDeadline}
                    deadline={selectedEvent}
                    currentUser={currentUser}
                    users={tenantData.users}
                    clients={tenantData.clients}
                />
             )}
        </>
      )}
    </div>
  );
}
