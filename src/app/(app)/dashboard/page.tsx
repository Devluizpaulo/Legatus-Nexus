"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Briefcase, DollarSign, GanttChartSquare, Users, AlertTriangle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { MOCK_CASES, MOCK_CLIENTS } from "@/lib/mock-data";

const AttorneyDashboard = () => {
    const activeCases = MOCK_CASES.filter(c => c.status !== 'Finalizado').length;
    const upcomingDeadlines = MOCK_CASES.filter(c => c.deadline && new Date(c.deadline) > new Date()).length;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeCases}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prazos Próximos</CardTitle>
                    <GanttChartSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{upcomingDeadlines}</div>
                    <p className="text-xs text-muted-foreground">nos próximos 30 dias</p>
                </CardContent>
            </Card>
        </div>
    )
};

const FinancialDashboard = () => {
     const data = [
        { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Fev", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Abr", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Mai", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ 45.231,89</div>
                    <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
                </CardContent>
            </Card>
             <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Visão Geral do Faturamento</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`}/>
                        <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

const MasterDashboard = () => (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_CLIENTS.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_CASES.filter(c => c.status !== 'Finalizado').length}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ 45.231,89</div>
                    <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prazos em Risco</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">3</div>
                     <p className="text-xs text-muted-foreground">Vencendo nos próximos 2 dias</p>
                </CardContent>
            </Card>
        </div>
        <FinancialDashboard />
    </div>
)


export default function DashboardPage() {
    const { currentUser } = useAuth();

    const renderDashboard = () => {
        switch(currentUser?.role) {
            case "Master":
                return <MasterDashboard />;
            case "Advogado":
                return <AttorneyDashboard />;
            case "Financeiro":
                return <FinancialDashboard />;
            default:
                return <div>Dashboard não disponível para seu cargo.</div>
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Bem-vindo(a) de volta, {currentUser?.name.split(' ')[0]}!</p>
            </div>
            {renderDashboard()}
        </div>
    )
}
