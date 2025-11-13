"use client";

import type { Deadline } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Edit, User, Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUrgencyColor, ChecklistProgress } from './utils';

interface DeadlineCardProps {
  deadline: Deadline;
  onEdit: (deadline: Deadline) => void;
}

export default function DeadlineCard({ deadline, onEdit }: DeadlineCardProps) {
  const { tenantData } = useAuth();
  const client = tenantData?.clients.find(c => c.id === deadline.clientId);
  const responsible = tenantData?.users.find(u => u.id === deadline.responsibleId);
  const urgency = getUrgencyColor(deadline.dueDate, deadline.status);
  const daysRemaining = differenceInDays(parseISO(deadline.dueDate), new Date());

  const getDaysRemainingText = () => {
    if (deadline.status === 'Cumprido') return 'Prazo cumprido';
    if (daysRemaining < 0) return `Venceu há ${Math.abs(daysRemaining)} dia(s)`;
    if (daysRemaining === 0) return 'Vence hoje';
    return `Vence em ${daysRemaining} dia(s)`;
  };

  return (
    <Card className={cn("relative border-l-4", urgency.border)}>
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => onEdit(deadline)}>
        <Edit className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2 pr-10">
        <CardTitle className="text-base font-bold flex items-center gap-2">
            {deadline.title}
            <ChecklistProgress checklist={deadline.checklist} />
        </CardTitle>
        <p className="text-xs text-muted-foreground">{deadline.caseNumber}</p>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {client?.name}</p>
        <p className="flex items-center gap-2"><User className="h-4 w-4" /> {responsible?.name}</p>
        <p className={cn("flex items-center gap-2 font-medium", urgency.text)}>
          <Calendar className="h-4 w-4" /> {getDaysRemainingText()}
        </p>
      </CardContent>
    </Card>
  );
}
