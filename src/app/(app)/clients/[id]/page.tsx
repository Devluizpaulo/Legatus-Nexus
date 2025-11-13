"use client";

import { useAuth } from "@/contexts/auth-context";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Calendar, GanttChartSquare, Mail, Phone } from "lucide-react";

export default function ClientDetailPage() {
    const { id } = useParams();
    const { tenantData } = useAuth();

    const client = tenantData?.clients.find(c => c.id === id);
    const clientCases = tenantData?.cases.filter(c => c.clientId === id) || [];
    const clientAppointments = tenantData?.appointments.filter(a => a.clientId === id) || [];
    const clientDeadlines = tenantData?.deadlines.filter(d => d.clientId === id) || [];

    if (!client) {
        return notFound();
    }
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                    {/* Placeholder for client logo or avatar */}
                    <AvatarFallback className="text-3xl">{getInitials(client.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-headline text-4xl font-bold tracking-tight">{client.name}</h1>
                    <p className="text-muted-foreground">{client.document}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações de Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{client.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                    {client.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Observações</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> Processos ({clientCases.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {clientCases.length > 0 ? (
                             <ul className="space-y-2">
                                {clientCases.map(c => <li key={c.id} className="text-sm text-muted-foreground">{c.title} - <span className="font-medium text-foreground">{c.status}</span></li>)}
                             </ul>
                           ) : <p className="text-sm text-muted-foreground">Nenhum processo associado.</p>}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar /> Compromissos ({clientAppointments.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {clientAppointments.length > 0 ? (
                                <ul className="space-y-2">
                                {clientAppointments.map(a => <li key={a.id} className="text-sm text-muted-foreground">{a.title} em {new Date(a.date).toLocaleDateString('pt-BR')} às {a.time}</li>)}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">Nenhum compromisso agendado.</p>}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GanttChartSquare /> Prazos ({clientDeadlines.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {clientDeadlines.length > 0 ? (
                                <ul className="space-y-2">
                                {clientDeadlines.map(d => <li key={d.id} className="text-sm text-muted-foreground">{d.title} - Vencimento: {new Date(d.dueDate).toLocaleDateString('pt-BR')}</li>)}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">Nenhum prazo pendente.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
