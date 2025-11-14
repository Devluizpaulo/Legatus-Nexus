
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound, useParams } from "next/navigation";
import LeadIdentificationForm from "@/components/cases/lead-identification-form";
import { Client, Case } from "@/lib/types";
import { useRouter } from "next/navigation";
import CaseCharacterizationForm from "@/components/cases/case-characterization-form";
import LegalTriageForm from "@/components/cases/legal-triage-form";

export default function CaseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { tenantData, updateClient, updateCase } = useAuth();
    
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

    const handleSaveLead = (clientData: Client) => {
        updateClient(clientData);
        updateCase({ ...caseData, status: 'Qualificação do Caso' });
        router.push('/cases?phase=Prospecção');
    };

    const handleSaveQualification = (caseData: Case) => {
        updateCase({ ...caseData, status: 'Triagem Jurídica'});
        router.push('/cases?phase=Prospecção');
    };

    const handleSaveTriage = (caseData: Case) => {
        updateCase({ ...caseData, status: 'Reunião com Cliente' });
        router.push('/cases?phase=Prospecção');
    };

    const isProspectingPhase = caseData.status === 'Lead Inicial';
    const isQualificationPhase = caseData.status === 'Qualificação do Caso';
    const isTriagePhase = caseData.status === 'Triagem Jurídica';

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <div>
                    <Badge variant="secondary" className="mb-2">{caseData.status}</Badge>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">{caseData.title}</h1>
                    {caseData.caseNumber && <p className="text-muted-foreground">{caseData.caseNumber}</p>}
                </div>
                
                {clientData && (
                    <>
                        <LeadIdentificationForm client={clientData} onSave={handleSaveLead} isReadOnly={!isProspectingPhase} />
                        {isQualificationPhase && <CaseCharacterizationForm caseData={caseData} onSave={handleSaveQualification} isReadOnly={false} />}
                        {isTriagePhase && (
                            <>
                                <LeadIdentificationForm client={clientData} onSave={() => {}} isReadOnly={true} />
                                <CaseCharacterizationForm caseData={caseData} onSave={() => {}} isReadOnly={true} />
                                <LegalTriageForm caseData={caseData} onSave={handleSaveTriage} />
                            </>
                        )}
                    </>
                )}

            </div>
            <div className="space-y-6">
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Detalhes do Processo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
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
            </div>
        </div>
    )
}
