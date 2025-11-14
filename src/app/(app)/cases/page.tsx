
"use client";

import { Suspense } from "react";
import KanbanBoard from "@/components/cases/kanban-board";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

function CasesPageContent() {
    const { tenantData } = useAuth();
    if (!tenantData) {
        return (
             <div className="flex gap-4 h-full pb-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="min-w-[300px] w-[300px] flex flex-col">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="flex-1" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-x-auto">
            <KanbanBoard 
                cases={tenantData.cases} 
                clients={tenantData.clients} 
                users={tenantData.users}
            />
        </div>
    );
}


export default function CasesPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Gerenciamento de Processos</h1>
                <p className="text-muted-foreground">Arraste e solte os processos para atualizar seus status.</p>
            </div>
            <Suspense fallback={<div>Carregando funil...</div>}>
                <CasesPageContent />
            </Suspense>
        </div>
    )
}
