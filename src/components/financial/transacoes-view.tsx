"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Check, X, HandCoins } from 'lucide-react';
import { FinancialTransaction, TransactionStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import TransacaoForm from './transacao-form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const statusConfig: Record<TransactionStatus, { color: string, label: string }> = {
    Pendente: { color: 'bg-yellow-500', label: 'Pendente' },
    Aprovada: { color: 'bg-blue-500', label: 'Aprovada' },
    Liquidada: { color: 'bg-green-500', label: 'Liquidada' },
    Reprovada: { color: 'bg-red-500', label: 'Reprovada' },
};

export default function TransacoesView() {
    const { tenantData, currentUser, addFinancialTransaction, updateFinancialTransaction, deleteFinancialTransaction } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

    const handleOpenModal = (transaction?: FinancialTransaction) => {
        setSelectedTransaction(transaction || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleSave = (data: FinancialTransaction | Omit<FinancialTransaction, 'id' | 'tenantId'>) => {
        if ('id' in data) {
            updateFinancialTransaction(data);
        } else {
            addFinancialTransaction(data as Omit<FinancialTransaction, 'id' | 'tenantId'>);
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            deleteFinancialTransaction(id);
        }
    };
    
    const handleStatusChange = (transaction: FinancialTransaction, newStatus: TransactionStatus) => {
        if (!currentUser) return;
        
        let approverId = transaction.approverId;
        if(newStatus === 'Aprovada' || newStatus === 'Reprovada') {
            approverId = currentUser.id;
        }

        updateFinancialTransaction({ ...transaction, status: newStatus, approverId });
    }

    if (!tenantData || !currentUser) return <div>Carregando...</div>;

    const canManage = currentUser.role === 'Master' || currentUser.role === 'Financeiro';

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" /> Nova Transação
                </Button>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tenantData.financialTransactions.length > 0 ? tenantData.financialTransactions.map(transaction => {
                            const user = tenantData.users.find(u => u.id === transaction.userId);
                            const isDespesa = transaction.type === 'Despesa';
                            const canApprove = canManage && isDespesa && transaction.status === 'Pendente';
                            const canLiquidate = canManage && isDespesa && transaction.status === 'Aprovada';

                            return (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Badge variant={isDespesa ? 'destructive' : 'default'} className={cn(!isDespesa && "bg-green-600")}>{transaction.type}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{transaction.description}</TableCell>
                                    <TableCell>{format(parseISO(transaction.date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{user?.name}</TableCell>
                                    <TableCell className={cn(isDespesa ? "text-destructive" : "text-green-600")}>
                                        {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("h-2 w-2 rounded-full", statusConfig[transaction.status].color)}></span>
                                            <span>{statusConfig[transaction.status].label}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {canApprove && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(transaction, 'Aprovada')}><Check className="mr-1 h-4 w-4" /> Aprovar</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(transaction, 'Reprovada')}><X className="mr-1 h-4 w-4" /> Reprovar</Button>
                                                </>
                                            )}
                                            {canLiquidate && (
                                                 <Button variant="outline" size="sm" onClick={() => handleStatusChange(transaction, 'Liquidada')}><HandCoins className="mr-1 h-4 w-4" /> Liquidar</Button>
                                            )}
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleOpenModal(transaction)} disabled={!canManage && transaction.status !== 'Pendente'}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(transaction.id)} disabled={!canManage && transaction.status !== 'Pendente'}>Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Nenhuma transação encontrada.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
             {isModalOpen && (
                <TransacaoForm
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    transaction={selectedTransaction}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}
