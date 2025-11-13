"use client";

import { useState } from 'react';
import type { SupportTicket, SupportTicketStatus } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TicketForm from './ticket-form';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TicketsSectionProps {
  tickets: SupportTicket[];
}

const statusConfig: Record<SupportTicketStatus, { variant: "default" | "secondary" | "outline", label: string, className?: string }> = {
    'Aberto': { variant: 'default', label: 'Aberto', className: 'bg-blue-100 text-blue-800' },
    'Em Andamento': { variant: 'default', label: 'Em Andamento', className: 'bg-yellow-100 text-yellow-800' },
    'Fechado': { variant: 'secondary', label: 'Fechado' },
};

export default function TicketsSection({ tickets }: TicketsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addSupportTicket } = useAuth();

  const handleSaveTicket = (data: Omit<SupportTicket, 'id' | 'tenantId' | 'userId' | 'status' | 'createdAt'>) => {
    addSupportTicket(data);
    setIsModalOpen(false);
  };
  
  const sortedTickets = [...tickets].sort((a,b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meus Tickets de Suporte</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Abrir Ticket
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTickets.length > 0 ? (
                  sortedTickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{ticket.subject}</TableCell>
                      <TableCell>{format(parseISO(ticket.createdAt), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[ticket.status].variant} className={cn(statusConfig[ticket.status].className)}>
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">Nenhum ticket encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {isModalOpen && (
        <TicketForm 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTicket}
        />
      )}
    </>
  );
}
