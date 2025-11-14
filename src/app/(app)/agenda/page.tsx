"use client";

import { useState, useMemo } from 'react';
import { format, add, sub, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Appointment, AppointmentType } from '@/lib/types';
import MonthView from '@/components/agenda/month-view';
import WeekView from '@/components/agenda/week-view';
import DayView from '@/components/agenda/day-view';
import AppointmentForm from '@/components/agenda/appointment-form';
import { ALL_APPOINTMENT_TYPES } from '@/lib/mock-data';

type ViewMode = 'Mês' | 'Semana' | 'Dia';

export default function AgendaPage() {
  const { tenantData, addAppointment, updateAppointment, deleteAppointment, currentUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('Mês');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | 'Todos'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [preSelectedDate, setPreSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (change: 'next' | 'prev') => {
    const period = viewMode === 'Mês' ? { months: 1 } : viewMode === 'Semana' ? { weeks: 1 } : { days: 1 };
    const newDate = change === 'next' ? add(currentDate, period) : sub(currentDate, period);
    setCurrentDate(newDate);
  };
  
  const handleOpenModal = (appointment?: Appointment) => {
    setSelectedAppointment(appointment || null);
    setPreSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleAddAppointmentOnDate = (date: Date) => {
    setSelectedAppointment(null);
    setPreSelectedDate(date);
    setIsModalOpen(true);
  }

  const handleViewDay = (date: Date) => {
    setCurrentDate(date);
    setViewMode('Dia');
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
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

  const filteredAppointments = useMemo(() => {
    if (!tenantData?.appointments) return [];
    if (typeFilter === 'Todos') return tenantData.appointments;
    return tenantData.appointments.filter(apt => apt.type === typeFilter);
  }, [tenantData?.appointments, typeFilter]);
  
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    filteredAppointments.forEach(apt => {
        const dateKey = format(new Date(apt.date), 'yyyy-MM-dd');
        const appointmentsForDay = map.get(dateKey) || [];
        appointmentsForDay.push(apt);
        map.set(dateKey, appointmentsForDay.sort((a, b) => a.time.localeCompare(b.time)));
    });
    return map;
  }, [filteredAppointments]);

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
            <Select value={typeFilter} onValueChange={(value: AppointmentType | 'Todos') => setTypeFilter(value)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    {ALL_APPOINTMENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
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
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Novo
        </Button>
      </header>

      <div className="flex-1 mt-4">
        {viewMode === 'Mês' && (
          <MonthView 
            currentDate={currentDate} 
            appointmentsByDate={appointmentsByDate} 
            onAppointmentClick={handleOpenModal}
            onAddAppointment={handleAddAppointmentOnDate}
            onViewDay={handleViewDay}
          />
        )}
        {viewMode === 'Semana' && (
          <WeekView currentDate={currentDate} appointmentsByDate={appointmentsByDate} onAppointmentClick={handleOpenModal} />
        )}
        {viewMode === 'Dia' && (
          <DayView currentDate={currentDate} appointments={appointmentsByDate.get(format(currentDate, 'yyyy-MM-dd')) || []} onAppointmentClick={handleOpenModal} />
        )}
      </div>

      {isModalOpen && currentUser && tenantData && (
        <AppointmentForm 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
          appointment={selectedAppointment}
          preSelectedDate={preSelectedDate}
          currentUser={currentUser}
          users={tenantData.users}
          clients={tenantData.clients}
        />
      )}
    </div>
  );
}