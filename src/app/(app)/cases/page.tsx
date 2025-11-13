import KanbanBoard from "@/components/cases/kanban-board";

export default function CasesPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Gerenciamento de Processos</h1>
                <p className="text-muted-foreground">Arraste e solte os processos para atualizar seus status.</p>
            </div>
            <div className="flex-1">
                <KanbanBoard />
            </div>
        </div>
    )
}
