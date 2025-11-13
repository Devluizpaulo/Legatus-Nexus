"use client";

import KanbanBoard from "@/components/cases/kanban-board";
import { useAuth } from "@/contexts/auth-context";

export default function CasesPage() {
    const { tenantData } = useAuth();
    if (!tenantData) return <div>Carregando...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Gerenciamento de Processos</h1>
                <p className="text-muted-foreground">Arraste e solte os processos para atualizar seus status.</p>
            </div>
            <div className="flex-1 overflow-x-auto">
                <KanbanBoard 
                    cases={tenantData.cases} 
                    clients={tenantData.clients} 
                    users={tenantData.users}
                />
            </div>
        </div>
    )
}
