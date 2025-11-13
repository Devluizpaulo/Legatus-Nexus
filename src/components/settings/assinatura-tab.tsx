"use client";

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, parseISO, isPast } from 'date-fns';
import { BillingStatus } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function AssinaturaTab() {
    const { currentUser, tenantData } = useAuth();

    const { subscription, plan, billingHistory } = useMemo(() => {
        if (!tenantData) return { subscription: null, plan: null, billingHistory: [] };
        
        return {
            subscription: tenantData.subscription,
            plan: tenantData.plan,
            billingHistory: [...tenantData.billingHistory].sort((a, b) => parseISO(b.dueDate).getTime() - parseISO(a.dueDate).getTime())
        };
    }, [tenantData]);

    const getStatusClass = (status: BillingStatus) => {
        switch (status) {
            case 'Pago': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Atrasado': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
        }
    };
    
    if (!subscription || !plan) {
        return (
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-72 md:col-span-1" />
                <Skeleton className="h-80 md:col-span-2" />
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Meu Plano</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Plano Atual</p>
                            <p className="text-2xl font-bold text-primary">{plan.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Valor Mensal</p>
                            <p className="text-xl font-semibold">{plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge className={cn(subscription.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-destructive/20 text-destructive')}>{subscription.status}</Badge>
                        </div>
                        <Button className="w-full">Gerenciar Assinatura</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Faturamento</CardTitle>
                        <CardDescription>Cobranças relacionadas à sua assinatura Legatus Nexus.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Data Pagamento</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billingHistory.map(billing => {
                                    let displayStatus = billing.status;
                                    if (billing.status === 'Pendente' && isPast(parseISO(billing.dueDate))) {
                                        displayStatus = 'Atrasado';
                                    }

                                    return (
                                        <TableRow key={billing.id}>
                                            <TableCell>{format(parseISO(billing.dueDate), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{billing.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>
                                                {billing.paymentDate ? format(parseISO(billing.paymentDate), 'dd/MM/yyyy') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("font-semibold", getStatusClass(displayStatus))}>
                                                    {displayStatus}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
