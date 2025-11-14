
"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Client } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Building, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const leadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  origin: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadIdentificationFormProps {
  client: Client;
  onSave: (data: Client) => void;
}

const originOptions = ["Indicação", "Website", "Redes Sociais", "Evento", "Outro"];

export default function LeadIdentificationForm({ client, onSave }: LeadIdentificationFormProps) {
  const { toast } = useToast();
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      document: client.document || '',
      origin: client.origin || '',
    },
  });

  const onSubmit: SubmitHandler<LeadFormData> = (data) => {
    onSave({ ...client, ...data });
    toast({
      title: "Lead atualizado!",
      description: "As informações do lead foram salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação do Lead</CardTitle>
        <CardDescription>Informações básicas sobre o cliente em potencial.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><User /> Nome Completo</FormLabel>
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
                <FormField control={form.control} name="document" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Building /> CPF / CNPJ</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
            </div>
            <div className="flex justify-end">
                <Button type="submit">Salvar Informações do Lead</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
