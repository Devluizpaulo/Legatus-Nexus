"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Check, X, HandCoins, Paperclip } from 'lucide-react';
import type { Refund, RefundStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import RefundForm from '@/components/refunds/refund-form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const statusConfig: Record<RefundStatus, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    Pendente: { variant: 'default', label: 'Pendente' },
    Aprovado: { variant: 'secondary', label: 'Aprovado' },
    Pago: { variant: 'secondary', label: 'Pago' },
    Reprovado: { variant: 'destructive', label: 'Reprovado' },
};

export default function RefundsPage() {
    const { tenantData, currentUser, addRefund, updateRefund, deleteRefund } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);

    const handleOpenModal = (refund?: Refund) => {
        setSelectedRefund(refund || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRefund(null);
    };

    const handleSave = (data: Refund | Omit<Refund, 'id' | 'tenantId'>) => {
        if ('id' in data) {
            updateRefund(data);
        } else {
            addRefund(data as Omit<Refund, 'id' | 'tenantId'>);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
            deleteRefund(id);
        }
    };
    
    const handleStatusChange = (refund: Refund, newStatus: RefundStatus) => {
        if (!currentUser) return;
        
        let approverId = refund.approverId;
        if(newStatus === 'Aprovado' || newStatus === 'Reprovado') {
            approverId = currentUser.id;
        }

        updateRefund({ ...refund, status: newStatus, approverId });
    }

    const visibleRefunds = useMemo(() => {
        if (!tenantData || !currentUser) return [];
        if (currentUser.role === 'Master' || currentUser.role === 'Financeiro') {
            return tenantData.refunds;
        }
        return tenantData.refunds.filter(r => r.userId === currentUser.id);
    }, [tenantData, currentUser]);
    
    const sortedRefunds = useMemo(() => {
      return visibleRefunds.sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    }, [visibleRefunds])

    if (!tenantData || !currentUser) return <div>Carregando...</div>;
    
    const canManage = currentUser.role === 'Master' || currentUser.role === 'Financeiro';

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Solicitação de Reembolsos</h1>
                <p className="text-muted-foreground">Gerencie as solicitações de reembolso da sua equipe.</p>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" /> Solicitar Reembolso
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {canManage && <TableHead>Solicitante</TableHead>}
                            <TableHead>Descrição</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedRefunds.length > 0 ? sortedRefunds.map(refund => {
                            const user = tenantData.users.find(u => u.id === refund.userId);
                            const canEdit = refund.status === 'Pendente' && (canManage || refund.userId === currentUser.id);
                            const canApprove = canManage && refund.status === 'Pendente';
                            const canPay = canManage && refund.status === 'Aprovado';
                            const isReprovado = refund.status === 'Reprovado';

                            return (
                                <TableRow key={refund.id}>
                                    {canManage && <TableCell>{user?.name}</TableCell>}
                                    <TableCell className="font-medium max-w-[300px] truncate">{refund.description}</TableCell>
                                    <TableCell>{format(parseISO(refund.date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{refund.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusConfig[refund.status].variant}>
                                            {statusConfig[refund.status].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {refund.attachmentUrl && <Button variant="outline" size="icon" className="h-8 w-8" asChild><a href={refund.attachmentUrl} target="_blank"><Paperclip className="h-4 w-4" /></a></Button>}
                                            {canApprove && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(refund, 'Aprovado')}><Check className="mr-1 h-4 w-4 text-green-500" /> Aprovar</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(refund, 'Reprovado')}><X className="mr-1 h-4 w-4 text-destructive" /> Reprovar</Button>
                                                </>
                                            )}
                                            {canPay && (
                                                 <Button variant="outline" size="sm" onClick={() => handleStatusChange(refund, 'Pago')}><HandCoins className="mr-1 h-4 w-4 text-green-600" /> Marcar como Pago</Button>
                                            )}
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleOpenModal(refund)} disabled={!canEdit}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(refund.id)} disabled={!canEdit}>Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={canManage ? 6 : 5} className="h-24 text-center">Nenhuma solicitação de reembolso encontrada.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
             {isModalOpen && (
                <RefundForm
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    refund={selectedRefund}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}
