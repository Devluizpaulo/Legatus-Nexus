"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, List, Kanban } from 'lucide-react';
import type { Deadline, User, Client } from '@/lib/types';
import ListView from '@/components/deadlines/list-view';
import BoardView from '@/components/deadlines/board-view';
import DeadlineForm from '@/components/deadlines/deadline-form';
import { ALL_DEADLINE_STATUSES } from '@/lib/mock-data';

type ViewMode = 'list' | 'board';
type StatusFilter = 'Todos' | 'Pendente' | 'Cumprido';

export default function DeadlinesPage() {
  const { tenantData, currentUser, addDeadline, updateDeadline, deleteDeadline } = useAuth();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [clientFilter, setClientFilter] = useState<string>('Todos');
  const [responsibleFilter, setResponsibleFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

  const handleOpenModal = (deadline?: Deadline) => {
    setSelectedDeadline(deadline || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeadline(null);
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

  const filteredDeadlines = useMemo(() => {
    if (!tenantData?.deadlines) return [];
    let deadlines = [...tenantData.deadlines];
    
    if (clientFilter !== 'Todos') {
      deadlines = deadlines.filter(d => d.clientId === clientFilter);
    }
    if (responsibleFilter !== 'Todos') {
      deadlines = deadlines.filter(d => d.responsibleId === responsibleFilter);
    }
    if (statusFilter !== 'Todos') {
      deadlines = deadlines.filter(d => d.status === statusFilter);
    }
    
    return deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tenantData?.deadlines, clientFilter, responsibleFilter, statusFilter]);

  if (!tenantData || !currentUser) {
      return <div>Carregando...</div>
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div className='flex flex-wrap items-center gap-2'>
            <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por cliente" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos os Clientes</SelectItem>
                    {tenantData.clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por responsável" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos os Responsáveis</SelectItem>
                    {tenantData.users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos os Status</SelectItem>
                    {ALL_DEADLINE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted rounded-md p-1">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4 mr-2" /> Lista
                </Button>
                <Button variant={viewMode === 'board' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('board')}>
                    <Kanban className="h-4 w-4 mr-2" /> Quadro
                </Button>
            </div>
             <Button onClick={() => handleOpenModal()}>
                <Plus className="mr-2 h-4 w-4" /> Novo Prazo
            </Button>
        </div>
      </header>

      <div className="flex-1 mt-4 overflow-auto">
        {viewMode === 'list' ? (
          <ListView deadlines={filteredDeadlines} onEdit={handleOpenModal} />
        ) : (
          <BoardView deadlines={filteredDeadlines} onEdit={handleOpenModal} />
        )}
      </div>
      
      {isModalOpen && (
        <DeadlineForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDeadline}
          onDelete={handleDeleteDeadline}
          deadline={selectedDeadline}
          currentUser={currentUser}
          users={tenantData.users}
          clients={tenantData.clients}
        />
      )}
    </div>
  );
}
