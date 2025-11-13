"use client";

import type { Client } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, GanttChartSquare, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  counts: { appointments: number; deadlines: number; };
  onEdit: () => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export default function ClientCard({ client, counts, onEdit, onDelete, canDelete }: ClientCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/clients/${client.id}`);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the edit button
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the delete button
    onDelete(client.id);
  };

  return (
    <Card 
      onClick={handleNavigate}
      className="flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader className="flex-row items-start justify-between">
        <div>
            <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{client.document}</p>
        </div>
         <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEditClick}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
            </Button>
            {canDelete && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={handleDeleteClick}>
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground space-y-1">
            <p>{client.email}</p>
            <p>{client.phone}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/30 dark:bg-card/50 text-xs text-muted-foreground p-3 justify-between">
        <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3"/>
            <span>{counts.appointments} Compromisso(s)</span>
        </div>
        <div className="flex items-center gap-2">
            <GanttChartSquare className="h-3 w-3"/>
            <span>{counts.deadlines} Prazo(s)</span>
        </div>
      </CardFooter>
    </Card>
  );
}
