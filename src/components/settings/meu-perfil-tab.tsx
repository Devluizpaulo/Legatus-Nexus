"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MeuPerfilTab() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>
                    Suas informações pessoais. Para alterar seus dados, contate o administrador do escritório.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={currentUser.name} readOnly />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={currentUser.email} readOnly />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="role">Cargo</Label>
                    <Input id="role" value={currentUser.role} readOnly />
                </div>
                 <Button variant="outline" className="mt-4">
                    Alterar Senha
                </Button>
            </CardContent>
        </Card>
    );
}
