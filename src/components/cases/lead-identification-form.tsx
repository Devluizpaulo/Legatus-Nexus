"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Building, Star, Target, FileText, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter } from 'next/navigation';

const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.string().optional(),
  origin: z.string().optional(),
  defendant: z.string().optional(),
  initialSummary: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadIdentificationFormProps {
  client: Client;
  onSave: (data: Client) => void;
}

const originOptions = ["Indicação", "Website", "Redes Sociais", "Evento", "Outro"];

export default function LeadIdentificationForm({ client, onSave }: LeadIdentificationFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      document: client.document || '',
      address: client.address || '',
      origin: client.origin || '',
      defendant: client.defendant || '',
      initialSummary: client.initialSummary || '',
    },
  });

  const onSubmit: SubmitHandler<LeadFormData> = (data) => {
    onSave({ ...client, ...data });
    toast({
      title: "Lead atualizado!",
      description: "As informações do lead foram salvas com sucesso.",
    });
    router.push('/cases?phase=Prospecção');
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Identificação do Cliente (Lead)</CardTitle>
            <CardDescription>Informações básicas sobre o cliente em potencial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><User /> Nome Completo</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="document" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Building /> CPF / CNPJ</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Mail /> E-mail</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Phone /> Telefone / WhatsApp</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2"><MapPin /> Endereço Completo</FormLabel>
                        <FormControl><Input placeholder="Rua, Número, Bairro, Cidade - Estado, CEP" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="origin" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Star /> Origem do Lead</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {originOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="defendant" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Target /> Contra quem pretende mover a ação?</FormLabel>
                        <FormControl><Input placeholder="Nome da pessoa ou empresa" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
             <FormField control={form.control} name="initialSummary" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><FileText /> Observações gerais do caso (resumo inicial)</FormLabel>
                <FormControl><Textarea placeholder="Descreva brevemente o problema relatado pelo cliente..." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Salvar e Continuar para Qualificação</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
