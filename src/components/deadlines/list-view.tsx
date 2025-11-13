"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Deadline } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUrgencyColor, ChecklistProgress } from './utils';

interface ListViewProps {
  deadlines: Deadline[];
  onEdit: (deadline: Deadline) => void;
}

export default function ListView({ deadlines, onEdit }: ListViewProps) {
  const { tenantData } = useAuth();

  if (!tenantData) return null;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título / Processo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deadlines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">Nenhum prazo encontrado.</TableCell>
            </TableRow>
          ) : (
            deadlines.map(deadline => {
              const client = tenantData.clients.find(c => c.id === deadline.clientId);
              const responsible = tenantData.users.find(u => u.id === deadline.responsibleId);
              const urgency = getUrgencyColor(deadline.dueDate, deadline.status);
              
              return (
                <TableRow key={deadline.id} className={cn(urgency.bg, "transition-colors")}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">{deadline.title}
                        <ChecklistProgress checklist={deadline.checklist} />
                    </div>
                    <div className="text-sm text-muted-foreground">{deadline.caseNumber}</div>
                  </TableCell>
                  <TableCell>{client?.name}</TableCell>
                  <TableCell>{responsible?.name}</TableCell>
                  <TableCell>{format(parseISO(deadline.dueDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={deadline.status === 'Cumprido' ? 'secondary' : 'default'}>{deadline.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(deadline)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
