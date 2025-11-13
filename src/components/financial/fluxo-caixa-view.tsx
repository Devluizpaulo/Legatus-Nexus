"use client";

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react';
import { subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function FluxoCaixaView() {
    const { tenantData } = useAuth();

    const { totalGanhos, totalDespesas, saldo, chartData } = useMemo(() => {
        if (!tenantData) return { totalGanhos: 0, totalDespesas: 0, saldo: 0, chartData: [] };

        const today = new Date();
        const last30Days = eachDayOfInterval({ start: subMonths(today, 1), end: today });
        
        let totalGanhos = 0;
        let totalDespesas = 0;
        
        const dataMap = new Map<string, { ganhos: number, despesas: number }>();

        last30Days.forEach(day => {
            const dateKey = format(day, 'MM/dd');
            dataMap.set(dateKey, { ganhos: 0, despesas: 0 });
        });

        tenantData.financialTransactions.forEach(t => {
            const transactionDate = new Date(t.date);
            if(transactionDate >= last30Days[0] && transactionDate <= today && t.status === 'Liquidada') {
                 const dateKey = format(transactionDate, 'MM/dd');
                 const current = dataMap.get(dateKey) || { ganhos: 0, despesas: 0 };
                
                if (t.type === 'Ganho') {
                    totalGanhos += t.amount;
                    current.ganhos += t.amount;
                } else {
                    totalDespesas += t.amount;
                    current.despesas += t.amount;
                }

                dataMap.set(dateKey, current);
            }
        });
        
        const chartData = Array.from(dataMap.entries()).map(([name, values]) => ({ name, ...values }));

        return {
            totalGanhos,
            totalDespesas,
            saldo: totalGanhos - totalDespesas,
            chartData
        };
    }, [tenantData]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ganhos (Últimos 30 dias)</CardTitle>
                        <ArrowUp className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalGanhos)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Despesas (Últimos 30 dias)</CardTitle>
                        <ArrowDown className="h-5 w-5 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{formatCurrency(totalDespesas)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo (Últimos 30 dias)</CardTitle>
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(saldo)}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral (Últimos 30 dias)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Legend />
                            <Bar dataKey="ganhos" fill="hsl(var(--chart-2))" name="Ganhos" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="despesas" fill="hsl(var(--destructive))" name="Despesas" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
