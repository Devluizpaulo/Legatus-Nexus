"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function EquipeTab() {
    const router = useRouter();

    const handleNavigate = () => {
        router.push('/team');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestão de Equipe</CardTitle>
                <CardDescription>
                    Adicione, edite ou remova membros da sua equipe, e gerencie suas permissões.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    A gestão completa da sua equipe é feita em uma seção dedicada para garantir maior controle e segurança.
                </p>
                <Button onClick={handleNavigate}>
                    <Users className="mr-2 h-4 w-4" />
                    Acessar Gestão de Equipe
                </Button>
            </CardContent>
        </Card>
    );
}
