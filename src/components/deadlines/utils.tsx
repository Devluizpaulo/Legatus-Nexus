"use client";

import { differenceInDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ChecklistItem, DeadlineStatus } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const getUrgencyColor = (dueDate: string, status: DeadlineStatus) => {
    if (status === 'Cumprido') {
        return {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-500',
            text: 'text-green-600 dark:text-green-400'
        };
    }

    const daysRemaining = differenceInDays(parseISO(dueDate), new Date());

    if (daysRemaining < 0) {
        return {
            bg: 'bg-gray-100 dark:bg-gray-800/30',
            border: 'border-gray-500',
            text: 'text-gray-500'
        };
    }
    if (daysRemaining <= 3) {
        return {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-500',
            text: 'text-red-600 dark:text-red-500'
        };
    }
    if (daysRemaining <= 7) {
        return {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-500',
            text: 'text-yellow-600 dark:text-yellow-500'
        };
    }
    return {
        bg: 'bg-background',
        border: 'border-transparent',
        text: 'text-muted-foreground'
    };
};

export const ChecklistProgress = ({ checklist }: { checklist: ChecklistItem[] }) => {
    if (!checklist || checklist.length === 0) return null;
    
    const completedCount = checklist.filter(item => item.completed).length;
    const totalCount = checklist.length;

    const isComplete = completedCount === totalCount;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={cn(
                        "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                        isComplete ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    )}>
                        <CheckCircle2 className="h-3 w-3" />
                        {completedCount}/{totalCount}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Checklist: {completedCount} de {totalCount} tarefas concluídas.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
