import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function FinancialPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Financeiro</h1>
                <p className="text-muted-foreground">Controle de despesas, lançamentos e solicitações de reembolso com fluxo de aprovação.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Landmark /> Módulo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá gerenciar as finanças do seu escritório aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
