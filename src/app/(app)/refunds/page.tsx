import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function RefundsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Reembolsos</h1>
                <p className="text-muted-foreground">Gerencie as solicitações de reembolso da sua equipe.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Receipt /> Módulo de Reembolsos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá gerenciar os reembolsos aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
