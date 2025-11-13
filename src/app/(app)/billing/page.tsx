"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Invoice } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import InvoiceDetailModal from '@/components/billing/invoice-detail-modal';

export default function BillingPage() {
    const { tenantData, currentUser, updateInvoice } = useAuth();
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const sortedInvoices = useMemo(() => {
        if (!tenantData?.invoices) return [];
        return [...tenantData.invoices].sort((a, b) => parseISO(b.issueDate).getTime() - parseISO(a.issueDate).getTime());
    }, [tenantData?.invoices]);

    const handleMarkAsPaid = (invoice: Invoice) => {
        updateInvoice({
            ...invoice,
            status: 'Paga',
            paidDate: format(new Date(), 'yyyy-MM-dd'),
        });
        setSelectedInvoice(null);
    };
    
    if (!tenantData || !currentUser || (currentUser.role !== 'Master' && currentUser.role !== 'Financeiro')) {
        return (
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Acesso Negado</h1>
                    <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
                </div>
            </div>
        );
    }
    
    const { clients, cases } = tenantData;

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Faturamento</h1>
                <p className="text-muted-foreground">Gerencie e monitore as faturas do seu escritório.</p>
            </div>
            
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fatura #</TableHead>
                            <TableHead>Cliente / Processo</TableHead>
                            <TableHead>Emissão</TableHead>
                            <TableHead>Vencimento</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedInvoices.length > 0 ? sortedInvoices.map(invoice => {
                            const client = clients.find(c => c.id === invoice.clientId);
                            const caseData = cases.find(c => c.id === invoice.caseId);
                            const isOverdue = invoice.status === 'Pendente' && isPast(parseISO(invoice.dueDate));
                            
                            const getStatusVariant = () => {
                                if (invoice.status === 'Paga') return 'secondary';
                                if (isOverdue) return 'destructive';
                                return 'default';
                            }

                            return (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id.toUpperCase()}</TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{client?.name}</div>
                                        <div className="text-xs text-muted-foreground">{caseData?.title}</div>
                                    </TableCell>
                                    <TableCell>{format(parseISO(invoice.issueDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{format(parseISO(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{invoice.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant()} className={cn(invoice.status === 'Paga' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300')}>
                                            {isOverdue ? 'Atrasada' : invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(invoice)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                             <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">Nenhuma fatura encontrada.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedInvoice && (
                <InvoiceDetailModal
                    invoice={selectedInvoice}
                    client={clients.find(c => c.id === selectedInvoice.clientId)}
                    caseData={cases.find(c => c.id === selectedInvoice.caseId)}
                    onClose={() => setSelectedInvoice(null)}
                    onMarkAsPaid={handleMarkAsPaid}
                />
            )}
        </div>
    );
}
