"use client";

import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, Briefcase, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { addDays, isBefore } from 'date-fns';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Refund, FinancialTransaction, RefundStatus, TransactionStatus, Deadline } from '@/lib/types';
import Link from 'next/link';
import DeadlineForm from '../deadlines/deadline-form';

export default function MasterDashboard() {
    const { tenantData, currentUser, updateRefund, updateFinancialTransaction, updateDeadline, deleteDeadline } = useAuth();
    const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
    const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);

    const handleOpenDeadlineModal = (deadline: Deadline) => {
      setSelectedDeadline(deadline);
      setIsDeadlineModalOpen(true);
    }

    const handleCloseDeadlineModal = () => {
      setSelectedDeadline(null);
      setIsDeadlineModalOpen(false);
    }
    
    const handleSaveDeadline = (deadline: Deadline) => {
        updateDeadline(deadline);
        handleCloseDeadlineModal();
    }

    const handleDeleteDeadline = (id: string) => {
        deleteDeadline(id);
        handleCloseDeadlineModal();
    }

    const {
        activeCasesCount,
        clientCount,
        pendingApprovals,
        urgentDeadlines,
        workloadData,
        casesByStatus,
        monthlyBilling
    } = useMemo(() => {
        if (!tenantData) {
            return {
                activeCasesCount: 0,
                clientCount: 0,
                pendingApprovals: [],
                urgentDeadlines: [],
                workloadData: [],
                casesByStatus: [],
                monthlyBilling: 0
            };
        }

        const urgentDate = addDays(new Date(), 5);

        const pendingRefunds = tenantData.refunds.filter(r => r.status === 'Pendente');
        const pendingExpenses = tenantData.financialTransactions.filter(t => t.type === 'Despesa' && t.status === 'Pendente');
        
        const workloadMap = tenantData.users.reduce((acc, user) => {
            acc.set(user.id, { name: user.name.split(' ')[0], deadlines: 0 });
            return acc;
        }, new Map<string, { name: string, deadlines: number }>());

        tenantData.deadlines.forEach(d => {
            if (d.status === 'Pendente' && workloadMap.has(d.responsibleId)) {
                workloadMap.get(d.responsibleId)!.deadlines += 1;
            }
        });
        
        const casesMap = tenantData.cases.reduce((acc, c) => {
            acc.set(c.status, (acc.get(c.status) || 0) + 1);
            return acc;
        }, new Map<string, number>());
        

        return {
            activeCasesCount: tenantData.cases.filter(c => c.status !== 'Finalizado').length,
            clientCount: tenantData.clients.length,
            pendingApprovals: [...pendingRefunds, ...pendingExpenses].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            urgentDeadlines: tenantData.deadlines.filter(d => d.status === 'Pendente' && isBefore(new Date(d.dueDate), urgentDate)),
            workloadData: Array.from(workloadMap.values()),
            casesByStatus: Array.from(casesMap.entries()).map(([name, value]) => ({name, value})),
            monthlyBilling: tenantData.invoices
                .filter(inv => new Date(inv.issueDate).getMonth() === new Date().getMonth())
                .reduce((sum, inv) => sum + inv.totalAmount, 0),
        };
    }, [tenantData]);

    const handleApproval = (item: Refund | FinancialTransaction, approved: boolean) => {
        if(!tenantData) return;
        const status = approved ? ('id' in item && 'attachmentUrl' in item ? 'Aprovado' : 'Aprovada') : 'Reprovado';
        
        if ('attachmentUrl' in item) { // It's a Refund
             updateRefund({ ...item, status: status as RefundStatus });
        } else { // It's a FinancialTransaction
             updateFinancialTransaction({ ...item, status: status as TransactionStatus });
        }
    };
    
    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

    if (!tenantData || !currentUser) return null;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna Esquerda: Métricas e Aprovações */}
            <div className="lg:col-span-1 space-y-6">
                 {/* Métricas */}
                <div className="grid grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{clientCount}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{activeCasesCount}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{monthlyBilling.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                        </CardContent>
                    </Card>
                     <Card className="border-destructive/50 bg-destructive/5 text-destructive">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Prazos Urgentes</CardTitle>
                            <AlertTriangle className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">{urgentDeadlines.length}</div>
                             <p className="text-xs">Nos próximos 5 dias</p>
                        </CardContent>
                    </Card>
                </div>
                 {/* Aprovações Pendentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aprovações Pendentes ({pendingApprovals.length})</CardTitle>
                        <CardDescription>Valide despesas e reembolsos da equipe.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingApprovals.slice(0, 4).map(item => {
                            const user = tenantData.users.find(u => u.id === item.userId);
                            const isRefund = 'attachmentUrl' in item;
                            return (
                                <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded-md border">
                                    <div>
                                        <p className="text-sm font-medium">{item.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {user?.name} - {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="outline" size="icon" className="h-7 w-7 text-green-600 hover:text-green-600" onClick={() => handleApproval(item, true)}>
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleApproval(item, false)}>
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                        {pendingApprovals.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">Nenhuma pendência!</p>}
                        {pendingApprovals.length > 4 && <Button variant="link" asChild className="w-full"><Link href="/financial">Ver todos</Link></Button>}
                    </CardContent>
                </Card>
            </div>

            {/* Coluna Direita: Gráficos e Listas */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Carga de Trabalho */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Carga de Trabalho da Equipe</CardTitle>
                            <CardDescription>Prazos pendentes por advogado.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={workloadData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={60} />
                                    <Tooltip wrapperClassName="!bg-popover !border-border" />
                                    <Bar dataKey="deadlines" name="Prazos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Processos por Fase */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Processos por Fase</CardTitle>
                            <CardDescription>Distribuição atual dos casos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                  <Pie data={casesByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {casesByStatus.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip wrapperClassName="!bg-popover !border-border" />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                 {/* Prazos Urgentes da Equipe */}
                <Card>
                    <CardHeader>
                        <CardTitle>Prazos Urgentes da Equipe</CardTitle>
                        <CardDescription>Prazos críticos vencendo nos próximos 5 dias.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                             {urgentDeadlines.slice(0,5).map(deadline => {
                                const responsible = tenantData.users.find(u => u.id === deadline.responsibleId);
                                return (
                                    <button 
                                        key={deadline.id} 
                                        onClick={() => handleOpenDeadlineModal(deadline)}
                                        className="w-full flex justify-between items-center text-sm p-2 rounded-md bg-secondary/50 hover:bg-secondary/80 transition-colors text-left"
                                    >
                                        <div>
                                            <p className="font-semibold">{deadline.title}</p>
                                            <p className="text-xs text-muted-foreground">{responsible?.name}</p>
                                        </div>
                                        <p className={cn("font-medium", new Date(deadline.dueDate) < new Date() ? 'text-destructive' : 'text-amber-600' )}>
                                            Vence em {new Date(deadline.dueDate).toLocaleDateString('pt-BR')}
                                        </p>
                                    </button>
                                )
                             })}
                             {urgentDeadlines.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">Nenhum prazo urgente!</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isDeadlineModalOpen && selectedDeadline && currentUser && (
                <DeadlineForm 
                    isOpen={isDeadlineModalOpen}
                    onClose={handleCloseDeadlineModal}
                    deadline={selectedDeadline}
                    onSave={handleSaveDeadline}
                    onDelete={handleDeleteDeadline}
                    currentUser={currentUser}
                    users={tenantData.users}
                    clients={tenantData.clients}
                />
            )}
        </div>
    )
}
