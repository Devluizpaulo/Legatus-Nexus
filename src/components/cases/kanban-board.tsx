"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Case, CaseStatus, Client, User } from '@/lib/types';
import { ALL_CASE_STATUSES } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Users, FolderKanban } from 'lucide-react';
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
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  useEffect(() => {
    const initialColumns: KanbanColumn[] = ALL_CASE_STATUSES.map(status => ({
      id: status,
      title: status,
      cases: cases.filter(c => c.status === status),
    }));
    setColumns(initialColumns);
  }, [cases]);

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
    <div className="flex gap-4 h-full pb-4">
      {columns.map(column => (
        <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col">
          <h2 className="font-semibold mb-2 px-1 text-lg">{column.title} ({column.cases.length})</h2>
          <Card 
            className="flex-1 bg-secondary/50 dark:bg-card/40 overflow-y-auto"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <CardContent className="p-2 space-y-2">
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
                           <Users className='h-3 w-3'/> {clients.find(c => c.id === _case.clientId)?.name}
                        </p>
                        {_case.status === 'Distribuição' && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                               <FolderKanban className='h-3 w-3'/> {_case.area}
                            </p>
                        )}
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
