import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function BillingPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Faturamento</h1>
                <p className="text-muted-foreground">Acompanhe o faturamento do seu escritório.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Módulo de Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá gerenciar o faturamento aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
