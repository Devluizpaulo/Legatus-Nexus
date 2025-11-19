
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import type { Case, CaseStatus, Client, User } from '@/lib/types';
import { PROSPECT_STATUSES, CIVIL_FUNNEL, ALL_CASE_STATUSES } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Briefcase, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '../ui/badge';

interface KanbanBoardProps {
    cases: Case[];
    clients: Client[];
    users: User[];
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export default function KanbanBoard({ cases, clients, users }: KanbanBoardProps) {
  const searchParams = useSearchParams();
  const [activeStatus, setActiveStatus] = useState<CaseStatus | null>(null);
  const [statuses, setStatuses] = useState<CaseStatus[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);

  useEffect(() => {
    const phase = searchParams.get('phase');
    const area = searchParams.get('area');
    const instance = searchParams.get('instance');
    const tribunal = searchParams.get('tribunal');
    const statusFilter = searchParams.get('status');

    let relevantStatuses: CaseStatus[];

    if (phase === 'Prospecção') {
        relevantStatuses = PROSPECT_STATUSES;
    } else if (area) {
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
             relevantStatuses = Object.values(CIVIL_FUNNEL).flat() as CaseStatus[];
        }
    } else if (statusFilter === 'Arquivo') {
        relevantStatuses = ['Encerramento / Arquivamento'];
    }
    else {
        relevantStatuses = ALL_CASE_STATUSES;
    }
    
    setStatuses(relevantStatuses);
    // Set the initial active status only if it's not already set or not in the new relevant statuses
    setActiveStatus(prevStatus => {
        if (prevStatus && relevantStatuses.includes(prevStatus)) {
            return prevStatus;
        }
        return relevantStatuses[0] || null;
    });

  }, [searchParams]);

  useEffect(() => {
    if (activeStatus) {
        const phase = searchParams.get('phase');
        const area = searchParams.get('area');

        let casesToFilter = cases;

        // This logic seems a bit redundant with the status filtering, but let's keep it for now.
        // It pre-filters cases based on the broader phase/area before filtering by specific status.
        if (phase === 'Prospecção') {
            casesToFilter = cases.filter(c => PROSPECT_STATUSES.includes(c.status));
        } else if (area) {
            casesToFilter = cases.filter(c => c.area === area);
        }

        setFilteredCases(casesToFilter.filter(c => c.status === activeStatus));
    } else {
        setFilteredCases([]);
    }
  }, [activeStatus, cases, searchParams]);

  const getCaseCountForStatus = (status: CaseStatus) => {
    const phase = searchParams.get('phase');
    const area = searchParams.get('area');
    let casesToCount = cases;

    // Ensure counting respects the broader context (Prospecção, Cível, etc.)
    if (phase === 'Prospecção') {
        casesToCount = cases.filter(c => PROSPECT_STATUSES.includes(c.status));
    } else if (area) {
        casesToCount = cases.filter(c => c.area === area);
    }
    
    return casesToCount.filter(c => c.status === status).length;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-4">
        {statuses.map(status => (
          <Button
            key={status}
            variant={activeStatus === status ? 'secondary' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setActiveStatus(status)}
          >
            {status}
            <Badge variant={activeStatus === status ? 'default' : 'secondary'} className="rounded-full">
              {getCaseCountForStatus(status)}
            </Badge>
          </Button>
        ))}
      </div>
        <Card className="flex-1">
            <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Processo</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead>Prazo Final</TableHead>
                                <TableHead>Responsáveis</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCases.length > 0 ? (
                                filteredCases.map(_case => {
                                    const client = clients.find(c => c.id === _case.clientId);
                                    return (
                                        <TableRow key={_case.id}>
                                            <TableCell>
                                                <Link href={`/cases/${_case.id}`} className="font-semibold hover:underline">{_case.title}</Link>
                                                <p className="text-xs text-muted-foreground">{_case.caseNumber}</p>
                                            </TableCell>
                                            <TableCell>
                                                 <p className="text-sm flex items-center gap-2">
                                                    <Briefcase className='h-3 w-3 shrink-0'/> {client?.name}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm flex items-center gap-2">
                                                    <Gavel className='h-3 w-3 shrink-0'/> {_case.area}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {_case.deadline ? (
                                                    <p className={cn("text-sm flex items-center gap-2", new Date(_case.deadline) < new Date() ? "text-destructive" : "text-muted-foreground")}>
                                                        <Clock className='h-3 w-3 shrink-0'/> {new Date(_case.deadline).toLocaleDateString('pt-BR')}
                                                    </p>
                                                ) : <span className="text-muted-foreground">-</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex -space-x-2">
                                                    {_case.responsible.map(userId => {
                                                        const user = users.find(u => u.id === userId);
                                                        return user ? (
                                                            <Avatar key={user.id} className="h-7 w-7 border-2 border-card">
                                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                            </Avatar>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum processo nesta fase.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
