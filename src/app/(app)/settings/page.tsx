import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">Gerencie as configurações do seu escritório.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings /> Configurações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você poderá personalizar as configurações da sua conta aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
