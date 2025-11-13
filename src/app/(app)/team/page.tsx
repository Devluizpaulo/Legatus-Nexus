import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TeamPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Equipe</h1>
                <p className="text-muted-foreground">Gerencie os membros da sua equipe.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Módulo de Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá gerenciar sua equipe aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
