"use client";

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Briefcase, FolderKanban, Workflow } from 'lucide-react';
import { format, startOfMonth } from 'date-fns';

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function CasesDashboardPage() {
    const { tenantData } = useAuth();

    const {
        totalCases,
        activeCases,
        newCasesThisMonth,
        casesByStatus,
        casesByArea,
    } = useMemo(() => {
        if (!tenantData) {
            return {
                totalCases: 0,
                activeCases: 0,
                newCasesThisMonth: 0,
                casesByStatus: [],
                casesByArea: [],
            };
        }

        const today = new Date();
        const startOfThisMonth = startOfMonth(today);

        const statusMap = tenantData.cases.reduce((acc, c) => {
            acc.set(c.status, (acc.get(c.status) || 0) + 1);
            return acc;
        }, new Map<string, number>());
        
        const areaMap = tenantData.cases.reduce((acc, c) => {
            acc.set(c.area, (acc.get(c.area) || 0) + 1);
            return acc;
        }, new Map<string, number>());

        return {
            totalCases: tenantData.cases.length,
            activeCases: tenantData.cases.filter(c => c.status !== 'Encerramento / Arquivamento').length,
            newCasesThisMonth: tenantData.cases.filter(c => {
                const caseDate = c.deadline ? new Date(c.deadline) : new Date(); // Using deadline as a proxy for creation date for mock data
                return caseDate >= startOfThisMonth;
            }).length,
            casesByStatus: Array.from(statusMap.entries()).map(([name, value]) => ({ name, value })),
            casesByArea: Array.from(areaMap.entries()).map(([name, value]) => ({ name, value })),
        };
    }, [tenantData]);

    if (!tenantData) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard de Processos</h1>
                <p className="text-muted-foreground">Uma visão geral e analítica da sua carteira de processos.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalCases}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                        <Workflow className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{activeCases}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Casos (Mês)</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{newCasesThisMonth}</div></CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Processos por Status</CardTitle>
                        <CardDescription>Distribuição dos casos nas fases do funil.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={casesByStatus} layout="vertical" margin={{ left: 100 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                <Tooltip wrapperClassName="!bg-popover !border-border" />
                                <Bar dataKey="value" name="Qtd." fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Processos por Área Jurídica</CardTitle>
                        <CardDescription>Volume de casos em cada área de atuação.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                           <PieChart>
                                <Pie data={casesByArea} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {casesByArea.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip wrapperClassName="!bg-popover !border-border" />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
