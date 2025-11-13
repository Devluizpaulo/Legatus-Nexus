"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Invoice, Client, Case } from '@/lib/types';
import { format, isPast, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { HandCoins } from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: Invoice;
  client?: Client;
  caseData?: Case;
  onClose: () => void;
  onMarkAsPaid: (invoice: Invoice) => void;
}

export default function InvoiceDetailModal({ invoice, client, caseData, onClose, onMarkAsPaid }: InvoiceDetailModalProps) {
    if (!invoice) return null;

    const isOverdue = invoice.status === 'Pendente' && isPast(parseISO(invoice.dueDate));
    const canBePaid = invoice.status === 'Pendente';

    const getStatusVariant = () => {
        if (invoice.status === 'Paga') return 'secondary';
        if (isOverdue) return 'destructive';
        return 'default';
    }

    const subtotalHonorarios = invoice.items.filter(i => i.description.includes('Horas')).reduce((acc, item) => acc + item.total, 0);
    const subtotalDespesas = invoice.items.filter(i => !i.description.includes('Horas')).reduce((acc, item) => acc + item.total, 0);


    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Detalhes da Fatura: {invoice.id.toUpperCase()}</DialogTitle>
                    <DialogDescription>
                        Status: {' '}
                         <Badge variant={getStatusVariant()} className={cn(invoice.status === 'Paga' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300')}>
                            {isOverdue ? 'Atrasada' : invoice.status}
                        </Badge>
                        {invoice.status === 'Paga' && invoice.paidDate && (
                            <span className="text-xs text-muted-foreground ml-2">(Paga em {format(parseISO(invoice.paidDate), 'dd/MM/yyyy')})</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                        <h3 className="font-semibold">Cliente</h3>
                        <p className="text-muted-foreground">{client?.name}</p>
                        <p className="text-muted-foreground">{client?.document}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Processo</h3>
                        <p className="text-muted-foreground">{caseData?.title}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold">Data de Emissão</h3>
                        <p className="text-muted-foreground">{format(parseISO(invoice.issueDate), 'dd/MM/yyyy')}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold">Data de Vencimento</h3>
                        <p className="text-muted-foreground">{format(parseISO(invoice.dueDate), 'dd/MM/yyyy')}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Itens da Fatura</h3>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead className="text-center">Qtd.</TableHead>
                                    <TableHead className="text-right">Valor Unit.</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-center">{item.quantity.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell className="text-right">{item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal Honorários:</span>
                            <span>{subtotalHonorarios.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal Despesas:</span>
                            <span>{subtotalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total Geral:</span>
                            <span>{invoice.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                </div>
                

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                    {canBePaid && (
                        <Button onClick={() => onMarkAsPaid(invoice)}>
                            <HandCoins className="mr-2 h-4 w-4" />
                            Marcar como Paga
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
