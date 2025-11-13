"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ALL_CASE_STATUSES, MOCK_USERS } from '@/lib/mock-data';
import type { Case, CaseStatus } from '@/lib/types';
import { Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type KanbanColumn = {
  id: CaseStatus;
  title: CaseStatus;
  cases: Case[];
};

export default function KanbanBoard() {
  const { tenantData, updateCases } = useAuth();
  const [columns, setColumns] = useState<KanbanColumn[]>([]);

  useEffect(() => {
    if (tenantData?.cases) {
      const initialColumns: KanbanColumn[] = ALL_CASE_STATUSES.map(status => ({
        id: status,
        title: status,
        cases: tenantData.cases.filter(c => c.status === status),
      }));
      setColumns(initialColumns);
    }
  }, [tenantData?.cases]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, caseId: string, fromColumnId: CaseStatus) => {
    e.dataTransfer.setData('caseId', caseId);
    e.dataTransfer.setData('fromColumnId', fromColumnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: CaseStatus) => {
    e.preventDefault();
    const caseId = e.dataTransfer.getData('caseId');
    const fromColumnId = e.dataTransfer.getData('fromColumnId') as CaseStatus;

    if (fromColumnId === toColumnId) return;

    // Update the case status in the main data
    const updatedAllCases = tenantData?.cases.map(c => 
      c.id === caseId ? { ...c, status: toColumnId } : c
    );

    if (updatedAllCases) {
      // This will trigger a re-render
      updateCases(updatedAllCases);
    }
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (!tenantData) return <div>Carregando...</div>;

  return (
    <div className="flex gap-4 overflow-x-auto h-full pb-4">
      {columns.map(column => (
        <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col">
          <h2 className="font-semibold mb-2 px-1">{column.title} ({column.cases.length})</h2>
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
                    onDragStart={(e) => handleDragStart(e, _case.id, column.id)}
                >
                    <CardContent className="p-3">
                        <Link href={`/cases/${_case.id}`} className="font-semibold hover:underline">{_case.title}</Link>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                           <Users className='h-3 w-3'/> {tenantData.clients.find(c => c.id === _case.clientId)?.name}
                        </p>
                         {_case.deadline && (
                            <p className={cn("text-sm mt-2 flex items-center gap-2", new Date(_case.deadline) < new Date() ? "text-destructive" : "text-muted-foreground")}>
                                <Clock className='h-3 w-3'/> Vence em {new Date(_case.deadline).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex -space-x-2">
                                {_case.responsible.map(userId => {
                                    const user = MOCK_USERS.find(u => u.id === userId);
                                    return user ? (
                                        <Avatar key={user.id} className="h-6 w-6 border-2 border-card">
                                            <AvatarImage src={user.avatarUrl} />
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
                <div className="text-center text-muted-foreground p-4 text-sm">Nenhum processo aqui.</div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
