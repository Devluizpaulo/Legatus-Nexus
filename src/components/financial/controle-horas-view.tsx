"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TimeEntryForm from './time-entry-form';
import { TimeEntry } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function ControleHorasView() {
    const { tenantData, currentUser, addTimeEntry, updateTimeEntry, deleteTimeEntry } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

    const handleOpenModal = (entry?: TimeEntry) => {
        setSelectedEntry(entry || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEntry(null);
    };

    const handleSave = (data: TimeEntry | Omit<TimeEntry, 'id' | 'tenantId'>) => {
        if ('id' in data) {
            updateTimeEntry(data);
        } else {
            addTimeEntry(data as Omit<TimeEntry, 'id' | 'tenantId'>);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
            deleteTimeEntry(id);
        }
    };

    const sortedTimeEntries = useMemo(() => {
        return tenantData?.timeEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
    }, [tenantData?.timeEntries]);

    if (!tenantData || !currentUser) return <div>Carregando...</div>;

    const { clients, cases, users } = tenantData;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" /> Lançar Horas
                </Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente / Processo</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Horas</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTimeEntries.length > 0 ? sortedTimeEntries.map(entry => {
                            const client = clients.find(c => c.id === entry.clientId);
                            const caseData = cases.find(c => c.id === entry.caseId);
                            const user = users.find(u => u.id === entry.userId);

                            return (
                                <TableRow key={entry.id}>
                                    <TableCell>{format(parseISO(entry.date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{client?.name}</div>
                                        <div className="text-sm text-muted-foreground">{caseData?.title}</div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate">{entry.description}</TableCell>
                                    <TableCell>{user?.name}</TableCell>
                                    <TableCell>{entry.hours.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={entry.status === 'Faturado' ? 'secondary' : 'default'}>
                                            {entry.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenModal(entry)}>Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(entry.id)}>Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Nenhum lançamento de horas encontrado.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {isModalOpen && (
                <TimeEntryForm
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    entry={selectedEntry}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}
