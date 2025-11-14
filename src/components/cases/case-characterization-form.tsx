
"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Case, UrgencyLevel, LegalArea } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ALL_LEGAL_AREAS } from '@/lib/mock-data';
import { FileText, Gavel, DollarSign, AlertTriangle } from 'lucide-react';

const caseSchema = z.object({
  area: z.string().min(1, "Área do direito é obrigatória"),
  summary: z.string().optional(),
  caseValue: z.preprocess(val => Number(val), z.number().optional()),
  urgency: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface CaseCharacterizationFormProps {
  caseData: Case;
  onSave: (data: Case) => void;
}

const urgencyLevels: UrgencyLevel[] = ["Normal", "Alta", "Emergência"];

export default function CaseCharacterizationForm({ caseData, onSave }: CaseCharacterizationFormProps) {
  const { toast } = useToast();
  const form = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      area: caseData.area || '',
      summary: caseData.summary || '',
      caseValue: caseData.caseValue || 0,
      urgency: caseData.urgency || 'Normal',
    },
  });

  const onSubmit: SubmitHandler<CaseFormData> = (data) => {
    const updatedData = { 
        ...caseData, 
        ...data,
        area: data.area as LegalArea,
        urgency: data.urgency as UrgencyLevel,
        status: 'Triagem Jurídica' // Avança para a próxima etapa
    };
    onSave(updatedData);
    toast({
      title: "Qualificação salva!",
      description: "O caso foi caracterizado e avançou para a Triagem Jurídica.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualificação do Caso</CardTitle>
        <CardDescription>Defina a área, urgência e detalhes financeiros para análise de viabilidade.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField control={form.control} name="area" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Gavel /> Área do Direito</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                    <SelectContent>{ALL_LEGAL_AREAS.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="caseValue" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><DollarSign /> Valor Envolvido (R$)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="urgency" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><AlertTriangle /> Urgência</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                    <SelectContent>{urgencyLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="summary" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><FileText /> Resumo do Caso</FormLabel>
                <FormControl><Textarea placeholder="Descreva o problema jurídico do lead..." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Salvar e Continuar para Triagem</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
