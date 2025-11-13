import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function AuditPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Auditoria</h1>
                <p className="text-muted-foreground">Monitore as ações realizadas no sistema.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History /> Módulo de Auditoria</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá visualizar os logs de auditoria aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
