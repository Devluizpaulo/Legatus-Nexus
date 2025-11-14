
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import type { Case, CaseStatus, Client, User, LegalArea } from '@/lib/types';
import { PROSPECT_STATUSES, CIVIL_FUNNEL, ALL_CASE_STATUSES } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Briefcase, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface KanbanBoardProps {
    cases: Case[];
    clients: Client[];
    users: User[];
}

type KanbanColumn = {
  id: CaseStatus;
  title: CaseStatus;
  cases: Case[];
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export default function KanbanBoard({ cases, clients, users }: KanbanBoardProps) {
  const { updateCases } = useAuth();
  const searchParams = useSearchParams();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  useEffect(() => {
    const phase = searchParams.get('phase');
    const area = searchParams.get('area');
    const instance = searchParams.get('instance');
    const tribunal = searchParams.get('tribunal');
    const statusFilter = searchParams.get('status');

    let relevantStatuses: CaseStatus[];
    let filteredCases = cases;

    if (phase === 'Prospecção') {
        relevantStatuses = PROSPECT_STATUSES;
        filteredCases = cases.filter(c => PROSPECT_STATUSES.includes(c.status));
    } else if (area) {
        filteredCases = cases.filter(c => c.area === area);
        if (instance === '1') {
            relevantStatuses = CIVIL_FUNNEL['1ª INSTÂNCIA'];
        } else if (instance === '2') {
            relevantStatuses = CIVIL_FUNNEL['2ª INSTÂNCIA (Tribunal de Justiça)'];
        } else if (tribunal) {
            relevantStatuses = CIVIL_FUNNEL['TRIBUNAIS SUPERIORES (STJ e STF)'];
        } else if (statusFilter === 'Execução') {
            relevantStatuses = CIVIL_FUNNEL['EXECUÇÃO'];
        } else if (statusFilter === 'Arquivo') {
             relevantStatuses = CIVIL_FUNNEL['FINAL'];
        } else {
            // Default to all statuses for the area if no specific instance/status
             relevantStatuses = Object.values(CIVIL_FUNNEL).flat() as CaseStatus[];
        }
        filteredCases = filteredCases.filter(c => relevantStatuses.includes(c.status));
    } else if (statusFilter === 'Arquivo') {
        relevantStatuses = ['Encerramento / Arquivamento'];
        filteredCases = cases.filter(c => c.status === 'Encerramento / Arquivamento');
    }
    else {
        relevantStatuses = ALL_CASE_STATUSES;
        filteredCases = cases;
    }


    const initialColumns: KanbanColumn[] = relevantStatuses.map(status => ({
      id: status,
      title: status,
      cases: filteredCases.filter(c => c.status === status),
    }));
    setColumns(initialColumns);

  }, [cases, searchParams]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, caseId: string) => {
    e.dataTransfer.setData('caseId', caseId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: CaseStatus) => {
    e.preventDefault();
    const caseId = e.dataTransfer.getData('caseId');
    const fromColumnId = columns.find(col => col.cases.some(c => c.id === caseId))?.id;

    if (fromColumnId && fromColumnId !== toColumnId) {
      const updatedAllCases = cases.map(c => 
        c.id === caseId ? { ...c, status: toColumnId } : c
      );
      updateCases(updatedAllCases);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 h-full pb-4">
      {columns.map(column => (
        <div key={column.id} className="flex flex-col">
          <h2 className="font-semibold mb-2 px-1 text-lg">{column.title} ({column.cases.length})</h2>
          <Card 
            className="flex-1 bg-secondary/50 dark:bg-card/40 overflow-y-auto"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <CardContent className="p-2 space-y-2 min-h-[150px]">
              {column.cases.map(_case => (
                <Card 
                    key={_case.id} 
                    className="bg-card hover:shadow-md cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, _case.id)}
                >
                    <CardContent className="p-3">
                        <Link href={`/cases/${_case.id}`} className="font-semibold hover:underline">{_case.title}</Link>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                           <Briefcase className='h-3 w-3'/> {clients.find(c => c.id === _case.clientId)?.name}
                        </p>
                         <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                           <Gavel className='h-3 w-3'/> {_case.area}
                         </p>
                         {_case.deadline && (
                            <p className={cn("text-sm mt-2 flex items-center gap-2", new Date(_case.deadline) < new Date() ? "text-destructive" : "text-muted-foreground")}>
                                <Clock className='h-3 w-3'/> Vence em {new Date(_case.deadline).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex -space-x-2">
                                {_case.responsible.map(userId => {
                                    const user = users.find(u => u.id === userId);
                                    return user ? (
                                        <Avatar key={user.id} className="h-6 w-6 border-2 border-card">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
              ))}
              {column.cases.length === 0 && (
                <div className="text-center text-muted-foreground p-4 text-sm h-full flex items-center justify-center">Nenhum processo aqui.</div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
