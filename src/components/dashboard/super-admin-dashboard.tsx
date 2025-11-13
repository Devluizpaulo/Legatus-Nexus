"use client";

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, DollarSign, LineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SuperAdminDashboard() {
    const { allTenants, allUsers } = useAuth();

    const { 
        totalTenants, 
        totalUsers, 
        monthlyRecurringRevenue,
        planDistribution,
        recentActivity
    } = useMemo(() => {
        if (!allTenants || !allUsers) {
            return {
                totalTenants: 0,
                totalUsers: 0,
                monthlyRecurringRevenue: 0,
                planDistribution: [],
                recentActivity: [],
            };
        }

        const mrr = allTenants.reduce((acc, tenant) => acc + tenant.plan.price, 0);

        const plansMap = allTenants.reduce((acc, tenant) => {
            const planName = tenant.plan.name;
            acc.set(planName, (acc.get(planName) || 0) + 1);
            return acc;
        }, new Map<string, number>());
        
        const planData = Array.from(plansMap.entries()).map(([name, value]) => ({ name, value }));
        
        // Simulating some recent activity
        const activity = [
            { tenant: "Morgan, Marston & Bell", action: "Novo usuário adicionado", time: "2h atrás" },
            { tenant: "Bell & Associados", action: "Upgrade de plano para Profissional", time: "8h atrás" },
            { tenant: "Nova Advocacia", action: "Novo tenant cadastrado", time: "1 dia atrás" },
        ]

        return {
            totalTenants: allTenants.length,
            totalUsers: allUsers.length,
            monthlyRecurringRevenue: mrr,
            planDistribution: planData,
            recentActivity: activity,
        };
    }, [allTenants, allUsers]);

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Coluna Esquerda: Métricas */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Tenants</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalTenants}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalUsers}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">MRR (Receita Mensal)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthlyRecurringRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Coluna Direita: Gráficos e Atividade */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição de Planos</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={planDistribution}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip wrapperClassName="!bg-popover !border-border" />
                                <Bar dataKey="value" name="Tenants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente da Plataforma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Escritório</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Horário</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentActivity.map((act, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{act.tenant}</TableCell>
                                        <TableCell>{act.action}</TableCell>
                                        <TableCell className="text-muted-foreground">{act.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
