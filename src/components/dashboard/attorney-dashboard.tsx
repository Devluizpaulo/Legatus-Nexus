"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { List, Calendar, GanttChartSquare, AlertTriangle, Award, Trophy, Rocket, Check } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { format, isToday, isWithinInterval, startOfToday, endOfToday, addDays, endOfWeek } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";

const ICONS: { [key: string]: React.ElementType } = {
  Award,
  Trophy,
  Rocket,
};

export default function AttorneyDashboard() {
    const { currentUser, tenantData } = useAuth();
    
    const { 
        todayAppointments, 
        weekAppointments,
        todayDeadlines,
        weekDeadlines,
        pendingAppointmentsCount,
        pendingDeadlinesCount,
        urgentDeadlines,
        recentAchievements,
        appointmentsByType,
        deadlinesByStatus
    } = useMemo(() => {
        if (!currentUser || !tenantData) {
            return { 
                todayAppointments: [], 
                weekAppointments: [],
                todayDeadlines: [],
                weekDeadlines: [],
                pendingAppointmentsCount: 0, 
                pendingDeadlinesCount: 0,
                urgentDeadlines: [],
                recentAchievements: [],
                appointmentsByType: [],
                deadlinesByStatus: [],
            };
        }

        const today = startOfToday();
        const next7Days = { start: today, end: addDays(today, 7) };
        const urgentDeadlineDate = addDays(today, 3);
        
        const userAppointments = tenantData.appointments.filter(a => a.responsible.includes(currentUser.id) && new Date(a.date) >= today);
        const userDeadlines = tenantData.deadlines.filter(d => d.responsibleId === currentUser.id && d.status === 'Pendente');

        return {
            todayAppointments: userAppointments.filter(a => isToday(new Date(a.date))),
            weekAppointments: userAppointments.filter(a => isWithinInterval(new Date(a.date), next7Days)),
            todayDeadlines: userDeadlines.filter(d => isToday(new Date(d.dueDate))),
            weekDeadlines: userDeadlines.filter(d => isWithinInterval(new Date(d.dueDate), next7Days)),
            pendingAppointmentsCount: userAppointments.length,
            pendingDeadlinesCount: userDeadlines.length,
            urgentDeadlines: userDeadlines.filter(d => new Date(d.dueDate) <= urgentDeadlineDate),
            recentAchievements: [...tenantData.achievements]
              .filter(a => a.userId === currentUser.id)
              .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3),
            appointmentsByType: tenantData.appointments.reduce((acc, apt) => {
                const type = apt.type;
                const existing = acc.find(item => item.name === type);
                if (existing) {
                    existing.value += 1;
                } else {
                    acc.push({ name: type, value: 1 });
                }
                return acc;
            }, [] as { name: string; value: number }[]),
            deadlinesByStatus: tenantData.deadlines.reduce((acc, deadline) => {
                const status = deadline.status;
                const existing = acc.find(item => item.name === status);
                if(existing) {
                    existing.value += 1;
                } else {
                    acc.push({ name: status, value: 1 });
                }
                return acc;
            }, [] as { name: string; value: number }[]),
        };

    }, [currentUser, tenantData]);

    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

    if (!currentUser || !tenantData) return null;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {/* Resumo Dia / Semana */}
             <Card className="xl:col-span-2">
                <CardHeader><CardTitle>Resumo do Dia e da Semana</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                     <div>
                        <h3 className="font-semibold mb-2">Hoje, {format(new Date(), 'dd/MM')}</h3>
                        <div className="space-y-2 text-sm">
                            {todayAppointments.length === 0 && todayDeadlines.length === 0 && <p className="text-muted-foreground">Nenhuma atividade para hoje.</p>}
                            {todayAppointments.map(apt => <div key={apt.id} className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {apt.title} às {apt.time}</div>)}
                            {todayDeadlines.map(d => <div key={d.id} className="flex items-center gap-2"><GanttChartSquare className="h-4 w-4 text-destructive" /> Prazo: {d.title}</div>)}
                        </div>
                     </div>
                     <div>
                        <h3 className="font-semibold mb-2">Próximos 7 dias</h3>
                        <div className="space-y-2 text-sm">
                            {weekAppointments.length === 0 && weekDeadlines.length === 0 && <p className="text-muted-foreground">Nenhuma atividade para a semana.</p>}
                            {weekAppointments.slice(0,3).map(apt => <div key={apt.id} className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {apt.title} ({format(new Date(apt.date), 'dd/MM')})</div>)}
                            {weekDeadlines.slice(0,3).map(d => <div key={d.id} className="flex items-center gap-2"><GanttChartSquare className="h-4 w-4 text-destructive" /> Prazo: {d.title} ({format(new Date(d.dueDate), 'dd/MM')})</div>)}
                             {(weekAppointments.length > 3 || weekDeadlines.length > 3) && <Link href="/agenda" className="text-primary hover:underline text-xs">Ver mais...</Link>}
                        </div>
                     </div>
                </CardContent>
            </Card>

            {/* Métricas Pessoais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-6">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Meus Compromissos</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{pendingAppointmentsCount}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Meus Prazos</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{pendingDeadlinesCount}</p></CardContent>
                </Card>
                <Card className="border-destructive/50 bg-destructive/5 text-destructive">
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><AlertTriangle /> Prazos Urgentes</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{urgentDeadlines.length}</p><p className="text-xs">Vencendo nos próximos 3 dias</p></CardContent>
                </Card>
            </div>

            {/* Conquistas */}
            <Card>
                <CardHeader>
                    <CardTitle>Minhas Conquistas</CardTitle>
                    <CardDescription>Suas medalhas e marcos recentes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recentAchievements.length > 0 ? recentAchievements.map(ach => {
                        const Icon = ICONS[ach.icon] || Award;
                        return (
                            <div key={ach.id} className="flex items-center gap-4">
                                <div className="p-2 bg-accent rounded-full text-accent-foreground"><Icon className="h-5 w-5" /></div>
                                <div>
                                    <p className="font-semibold">{ach.title}</p>
                                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                                </div>
                            </div>
                        )
                    }) : <p className="text-sm text-muted-foreground text-center py-4">Continue trabalhando para desbloquear novas conquistas!</p>}
                </CardContent>
            </Card>

            {/* Gráficos de Desempenho */}
            <Card>
                <CardHeader>
                    <CardTitle>Compromissos por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={appointmentsByType}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip wrapperClassName="!bg-popover !border-border" />
                            <Bar dataKey="value" name="Qtd" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Prazos por Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                       <PieChart>
                          <Pie data={deadlinesByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {deadlinesByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip wrapperClassName="!bg-popover !border-border" />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
