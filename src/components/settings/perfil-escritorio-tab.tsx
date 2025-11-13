"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(3, "O nome do escritório é obrigatório."),
  logoUrl: z.string().optional(),
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilEscritorioTab() {
    const { currentTenant } = useAuth();
    const { toast } = useToast();

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentTenant?.name || '',
            // In a real app, you would handle file uploads differently.
            // This is just for demonstration.
            logoUrl: '', 
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
        },
    });

    const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
        // In a real app, this would call a context function to update tenant data
        console.log("Dados do escritório atualizados:", data);
        toast({
            title: "Perfil do escritório salvo!",
            description: "As informações foram atualizadas com sucesso (simulação).",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Perfil do Escritório</CardTitle>
                <CardDescription>
                    Edite as informações públicas e de contato do seu escritório.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Escritório</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <FormControl><Input type="file" /></FormControl>
                                    <FormDescription>Envie a logo do seu escritório.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField control={form.control} name="cep" render={({ field }) => (
                                <FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="rua" render={({ field }) => (
                                <FormItem className="lg:col-span-2"><FormLabel>Rua</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="numero" render={({ field }) => (
                                <FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="bairro" render={({ field }) => (
                                <FormItem className="lg:col-span-2"><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="cidade" render={({ field }) => (
                                <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="estado" render={({ field }) => (
                                <FormItem><FormLabel>Estado</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Salvar Alterações</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
