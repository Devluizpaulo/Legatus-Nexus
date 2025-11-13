import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Suporte</h1>
                <p className="text-muted-foreground">Encontre ajuda e entre em contato conosco.</p>
            </div>
             <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Central de Suporte</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Esta página está em desenvolvimento. Em breve, você encontrará nossa documentação e canais de suporte aqui.</p>
                </CardContent>
            </Card>
        </div>
    )
}
