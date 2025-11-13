"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AISummarizer from "@/components/cases/ai-summarizer";
import { notFound, useParams } from "next/navigation";

export default function CaseDetailPage() {
    const { id } = useParams();
    const { tenantData } = useAuth();
    
    if (!tenantData) return <div>Carregando...</div>

    const caseData = tenantData.cases.find(c => c.id === id);
    if (!caseData) {
        notFound();
    }
    const clientData = tenantData.clients.find(c => c.id === caseData.clientId);
    const responsibleUsers = tenantData.users.filter(u => caseData.responsible.includes(u.id));
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <div>
                    <Badge variant="secondary" className="mb-2">{caseData.status}</Badge>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">{caseData.title}</h1>
                </div>
                <AISummarizer />
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes do Processo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold">Cliente</p>
                            <p className="text-muted-foreground">{clientData?.name}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status</p>
                            <p className="text-muted-foreground">{caseData.status}</p>
                        </div>
                         {caseData.deadline && (
                            <div>
                                <p className="font-semibold">Prazo Final</p>
                                <p className="text-muted-foreground">{new Date(caseData.deadline).toLocaleDateString('pt-BR')}</p>
                            </div>
                         )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Responsáveis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {responsibleUsers.map(user => (
                             <div key={user.id} className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
