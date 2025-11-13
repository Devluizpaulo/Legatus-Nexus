"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AparenciaTab() {
    const { currentUser, currentTenant } = useAuth();
    const [theme, setTheme] = useState('light');
    const { toast } = useToast();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        toast({
            title: "Tema alterado!",
            description: `O tema foi alterado para ${newTheme === 'dark' ? 'Escuro' : 'Claro'}.`,
        });
    };
    
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        // In a real app, this would call a function to update the tenant's primary color
        // and re-generate the CSS variables.
        console.log("Nova cor primária:", newColor);
        toast({
            title: "Cor alterada!",
            description: "A cor primária do escritório foi atualizada (simulação).",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                    Personalize a aparência do sistema para você e sua equipe.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label>Tema do Sistema</Label>
                        <div className="text-sm text-muted-foreground">
                            Alterne entre os modos claro e escuro.
                        </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={toggleTheme}>
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
                {currentUser?.role === 'Master' && currentTenant && (
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label>Cor Principal do Escritório</Label>
                            <div className="text-sm text-muted-foreground">
                                Afeta botões, links e outros elementos para toda a equipe.
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="color"
                                defaultValue={currentTenant.primaryColor}
                                onChange={handleColorChange}
                                className="h-10 w-16 p-1 bg-background border rounded-md cursor-pointer"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
