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

export default function LoginPage() {
  const [email, setEmail] = useState("artur.morgan@example.com");
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
      // Simulate API call
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
    <Tabs defaultValue="advogado" className="w-full">
      <CardHeader>
        <CardTitle>Acessar Plataforma</CardTitle>
        <CardDescription>Use suas credenciais para entrar no Legatus Nexus.</CardDescription>
      </CardHeader>
      <CardContent>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="advogado">Escritório/Advogado</TabsTrigger>
            <TabsTrigger value="cliente" disabled>Cliente</TabsTrigger>
        </TabsList>
        <TabsContent value="advogado">
            <form onSubmit={handleLogin}>
                <div className="space-y-4 pt-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
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
        </TabsContent>
         <TabsContent value="cliente">
            <div className="space-y-4 pt-4">
                <p className="text-sm text-center text-muted-foreground">O portal do cliente está em desenvolvimento. Em breve você poderá acessar seus processos por aqui.</p>
            </div>
        </TabsContent>
      </CardContent>
    </Tabs>
  );
}
