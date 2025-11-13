"use client";

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { DollarSign, Banknote, Landmark } from 'lucide-react';
import { subMonths, format } from 'date-fns';

export default function FinancialDashboard() {
    const { tenantData } = useAuth();

    const { totalGanhos, totalDespesas, saldo, chartData, faturamentoMensal } = useMemo(() => {
        if (!tenantData) return { totalGanhos: 0, totalDespesas: 0, saldo: 0, chartData: [], faturamentoMensal: 0 };
        
        let totalGanhos = 0;
        let totalDespesas = 0;
        let faturamentoMensal = 0;

        const today = new Date();
        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        tenantData.financialTransactions.forEach(t => {
            const transactionDate = new Date(t.date);
            if(transactionDate >= startOfCurrentMonth && transactionDate <= today && t.status === 'Liquidada') {
                 if (t.type === 'Ganho') {
                    totalGanhos += t.amount;
                } else {
                    totalDespesas += t.amount;
                }
            }
        });
        
        tenantData.invoices.forEach(i => {
             const issueDate = new Date(i.issueDate);
             if(issueDate >= startOfCurrentMonth && issueDate <= today) {
                faturamentoMensal += i.totalAmount;
             }
        });

        const dataMap = new Map<string, { faturamento: number }>();
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const monthKey = format(date, 'MMM/yy');
            dataMap.set(monthKey, { faturamento: 0 });
        }

        tenantData.invoices.forEach(inv => {
            const monthKey = format(new Date(inv.issueDate), 'MMM/yy');
            if (dataMap.has(monthKey)) {
                dataMap.get(monthKey)!.faturamento += inv.totalAmount;
            }
        });

        const chartData = Array.from(dataMap.entries()).map(([name, values]) => ({ name, ...values }));

        return {
            totalGanhos,
            totalDespesas,
            saldo: totalGanhos - totalDespesas,
            chartData,
            faturamentoMensal
        };
    }, [tenantData]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(faturamentoMensal)}</div>
                    <p className="text-xs text-muted-foreground">+12.5% em relação ao mês passado</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita (Mês)</CardTitle>
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalGanhos)}</div>
                     <p className="text-xs text-muted-foreground">Total de ganhos liquidados</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Despesas (Mês)</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{formatCurrency(totalDespesas)}</div>
                     <p className="text-xs text-muted-foreground">Total de despesas liquidadas</p>
                </CardContent>
            </Card>
             <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Faturamento nos Últimos 6 Meses</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${Number(value)/1000}k`}/>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="faturamento" stroke="hsl(var(--primary))" strokeWidth={2} name="Faturamento" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
