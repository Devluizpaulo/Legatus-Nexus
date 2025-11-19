
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound, useParams } from "next/navigation";
import { Client, Case, CaseStatus } from "@/lib/types";
import { useRouter } from "next/navigation";

import LeadIdentificationForm from "@/components/cases/lead-identification-form";
import CaseCharacterizationForm from "@/components/cases/case-characterization-form";
import LegalTriageForm from "@/components/cases/legal-triage-form";
import MeetingForm from "@/components/cases/meeting-form";
import ProposalForm from "@/components/cases/proposal-form";
import DocumentCollectionForm from "@/components/cases/document-collection-form";
import FinalAnalysisForm from "@/components/cases/final-analysis-form";
import DraftingForm from "@/components/cases/drafting-form";
import DistributionForm from "@/components/cases/distribution-form";
import { PROSPECT_STATUSES, LEGAL_FUNNELS } from "@/lib/mock-data";


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

    const handleNextStep = (currentStatus: string, updatedData: Partial<Case> = {}, redirectTo?: string) => {
        const currentIndex = PROSPECT_STATUSES.indexOf(currentStatus as any);
        if (currentIndex < PROSPECT_STATUSES.length - 1) {
            const nextStatus = PROSPECT_STATUSES[currentIndex + 1];
            updateCase({ ...caseData, ...updatedData, status: nextStatus });
             router.push(redirectTo || '/cases?phase=Prospecção');
        } else {
            console.error("No next step defined for status:", currentStatus);
            router.push(redirectTo ||'/cases?phase=Prospecção');
        }
    };
    

    const handleSaveLead = (clientData: Client) => {
        updateClient(clientData);
        handleNextStep("Lead Inicial");
    };

    const handleSaveQualification = (caseData: Partial<Case>) => {
        handleNextStep("Qualificação do Caso", caseData);
    };

    const handleSaveTriage = (caseData: Partial<Case>) => {
        handleNextStep("Triagem Jurídica", caseData);
    };
    
    const handleSaveMeeting = (caseData: Partial<Case>) => {
        handleNextStep("Reunião com Cliente", caseData);
    };

    const handleSaveProposal = (caseData: Partial<Case>) => {
        handleNextStep("Proposta Comercial", caseData);
    };
    
    const handleSaveDocumentCollection = (caseData: Partial<Case>) => {
        handleNextStep("Coleta de Documentos", caseData);
    };

    const handleSaveFinalAnalysis = (caseData: Partial<Case>) => {
        handleNextStep("Análise Jurídica Final", caseData);
    };

    const handleSaveDrafting = (caseData: Partial<Case>) => {
        handleNextStep("Redação da Inicial", caseData);
    };

    const handleSaveDistribution = (data: Partial<Case>) => {
      // Find the first status of the corresponding legal funnel
      const area = caseData.area;
      const legalFunnel = (LEGAL_FUNNELS as any)[area];
      const firstLegalStatus = legalFunnel ? (Object.values(legalFunnel)[0] as CaseStatus[])[0] : "Análise Inicial";

      updateCase({ ...caseData, ...data, status: firstLegalStatus });
      router.push(`/cases?area=${area}&instance=1`);
    };


    const statusIndex = PROSPECT_STATUSES.indexOf(caseData.status as any);

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <div>
                    <p className="text-sm font-semibold text-primary">Funil de Prospecção</p>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">{caseData.title}</h1>
                    {caseData.caseNumber && <p className="text-muted-foreground">{caseData.caseNumber}</p>}
                </div>
                
                {clientData && (
                    <>
                        <LeadIdentificationForm client={clientData} onSave={handleSaveLead} isReadOnly={statusIndex > 0} />
                        
                        {statusIndex >= 1 && <CaseCharacterizationForm caseData={caseData} onSave={handleSaveQualification} isReadOnly={statusIndex > 1} />}
                        
                        {statusIndex >= 2 && <LegalTriageForm caseData={caseData} onSave={handleSaveTriage} isReadOnly={statusIndex > 2} />}

                        {statusIndex >= 3 && <MeetingForm caseData={caseData} onSave={handleSaveMeeting} isReadOnly={statusIndex > 3} />}

                        {statusIndex >= 4 && <ProposalForm caseData={caseData} onSave={handleSaveProposal} isReadOnly={statusIndex > 4} />}

                        {statusIndex >= 5 && <DocumentCollectionForm caseData={caseData} onSave={handleSaveDocumentCollection} isReadOnly={statusIndex > 5} />}

                        {statusIndex >= 6 && <FinalAnalysisForm caseData={caseData} onSave={handleSaveFinalAnalysis} isReadOnly={statusIndex > 6} />}
                        
                        {statusIndex >= 7 && <DraftingForm caseData={caseData} onSave={handleSaveDrafting} isReadOnly={statusIndex > 7} />}
                        
                        {statusIndex >= 8 && <DistributionForm caseData={caseData} onSave={handleSaveDistribution} isReadOnly={statusIndex > 8} />}

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
                            <p className="font-semibold">Status Atual</p>
                            <p className="text-primary font-medium">{caseData.status}</p>
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
