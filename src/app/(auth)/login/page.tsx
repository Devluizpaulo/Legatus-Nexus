"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function LoginForm({ role }: { role: 'escritorio' | 'advogado' }) {
    const [email, setEmail] = useState(role === 'escritorio' ? "artur.morgan@example.com" : "joana.marston@example.com");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const success = login(email, password);

            if (success) {
                toast({
                    title: "Login bem-sucedido!",
                    description: "Redirecionando para o seu dashboard.",
                });
                router.push("/dashboard");
            } else {
                setError("Credenciais inválidas. Tente novamente.");
            }
        } catch (err) {
            setError("Ocorreu um erro. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="space-y-4 pt-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor={`email-${role}`}>Email</Label>
                    <Input
                        id={`email-${role}`}
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`password-${role}`}>Senha</Label>
                    <Input
                        id={`password-${role}`}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>
            <CardFooter className="flex flex-col gap-4 px-0 pt-6 pb-0">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                    Não tem uma conta? <Link href="/register" className="text-primary hover:underline">Cadastre-se</Link>
                </p>
            </CardFooter>
        </form>
    );
}


export default function LoginPage() {
  return (
    <Tabs defaultValue="escritorio" className="w-full">
      <CardHeader>
        <CardTitle>Acessar Plataforma</CardTitle>
        <CardDescription>Use suas credenciais para entrar no Legatus Nexus.</CardDescription>
      </CardHeader>
      <CardContent>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="escritorio">Escritório</TabsTrigger>
            <TabsTrigger value="advogado">Advogado</TabsTrigger>
        </TabsList>
        <TabsContent value="escritorio">
           <LoginForm role="escritorio" />
        </TabsContent>
         <TabsContent value="advogado">
           <LoginForm role="advogado" />
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
