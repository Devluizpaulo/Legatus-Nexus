"use client";

import type { Deadline } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ALL_DEADLINE_STATUSES } from '@/lib/mock-data';
import DeadlineCard from './deadline-card';

interface BoardViewProps {
  deadlines: Deadline[];
  onEdit: (deadline: Deadline) => void;
}

export default function BoardView({ deadlines, onEdit }: BoardViewProps) {
  const columns = ALL_DEADLINE_STATUSES.map(status => ({
    id: status,
    title: status,
    deadlines: deadlines.filter(d => d.status === status),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {columns.map(column => (
        <div key={column.id} className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg px-1">{column.title} ({column.deadlines.length})</h2>
          <Card className="flex-1 bg-secondary/30 dark:bg-card/40 p-2 min-h-[200px]">
            <CardContent className="space-y-2 p-0">
              {column.deadlines.length > 0 ? (
                column.deadlines.map(deadline => (
                  <DeadlineCard key={deadline.id} deadline={deadline} onEdit={onEdit} />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8 text-sm">
                  Nenhum prazo aqui.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
