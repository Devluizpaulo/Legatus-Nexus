"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ALL_AUDIT_EVENT_TYPES } from '@/lib/mock-data';
import { AuditEventType } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AuditPage() {
    const { currentUser, tenantData, allAuditLogs, allUsers, allTenants } = useAuth();
    
    const [userFilter, setUserFilter] = useState<string>('all');
    const [actionFilter, setActionFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const isSuperAdmin = currentUser?.role === 'SuperAdmin';

    const sourceLogs = useMemo(() => {
        return isSuperAdmin ? allAuditLogs : tenantData?.auditLogs || [];
    }, [isSuperAdmin, allAuditLogs, tenantData?.auditLogs]);

    const usersForFilter = useMemo(() => {
        return isSuperAdmin ? allUsers : tenantData?.users || [];
    }, [isSuperAdmin, allUsers, tenantData?.users]);

    const filteredLogs = useMemo(() => {
        return sourceLogs.filter(log => {
            const logDate = parseISO(log.timestamp);
            if (userFilter !== 'all' && log.userId !== userFilter) return false;
            if (actionFilter !== 'all' && log.eventType !== actionFilter) return false;
            if (startDate && logDate < new Date(startDate)) return false;
            if (endDate && logDate > new Date(endDate)) return false;
            return true;
        }).sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    }, [sourceLogs, userFilter, actionFilter, startDate, endDate]);

    if (!currentUser || (currentUser.role !== 'Master' && !isSuperAdmin)) {
        return (
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Acesso Negado</h1>
                    <p className="text-muted-foreground">Você não tem permissão para acessar o log de auditoria.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Log de Auditoria</h1>
                <p className="text-muted-foreground">Rastreie todas as atividades importantes realizadas na plataforma.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Filtros de Auditoria</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        <Select value={userFilter} onValueChange={setUserFilter}>
                            <SelectTrigger><SelectValue placeholder="Filtrar por usuário..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Usuários</SelectItem>
                                {usersForFilter.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger><SelectValue placeholder="Filtrar por ação..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Ações</SelectItem>
                                {ALL_AUDIT_EVENT_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data/Hora</TableHead>
                                    {isSuperAdmin && <TableHead>Escritório</TableHead>}
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Detalhes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length > 0 ? filteredLogs.map(log => {
                                    const user = allUsers.find(u => u.id === log.userId);
                                    const tenant = isSuperAdmin ? allTenants.find(t => t.id === log.tenantId) : null;
                                    return (
                                        <TableRow key={log.id}>
                                            <TableCell>{format(parseISO(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</TableCell>
                                            {isSuperAdmin && <TableCell>{tenant?.name || 'N/A'}</TableCell>}
                                            <TableCell>{user?.name || 'Sistema'}</TableCell>
                                            <TableCell>{log.eventType}</TableCell>
                                            <TableCell>{log.details}</TableCell>
                                        </TableRow>
                                    )
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={isSuperAdmin ? 5 : 4} className="h-24 text-center">Nenhum log encontrado para os filtros aplicados.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
