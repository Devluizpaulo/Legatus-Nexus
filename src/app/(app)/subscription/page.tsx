import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSignature } from "lucide-react";

export default function SubscriptionPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Assinatura</h1>
                <p className="text-muted-foreground">Gerencie o plano do seu escritório.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileSignature /> Módulo de Assinatura</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá gerenciar sua assinatura aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
