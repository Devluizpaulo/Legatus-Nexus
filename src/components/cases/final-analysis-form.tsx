
"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Case } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckSquare, FileSignature, Milestone } from 'lucide-react';

const finalAnalysisSchema = z.object({
  finalStrategy: z.string().min(10, "A estratégia final é obrigatória."),
  finalFacts: z.string().min(10, "A conferência dos fatos é obrigatória."),
});

type FinalAnalysisFormData = z.infer<typeof finalAnalysisSchema>;

interface FinalAnalysisFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

export default function FinalAnalysisForm({ caseData, onSave, isReadOnly }: FinalAnalysisFormProps) {
  const { toast } = useToast();
  const form = useForm<FinalAnalysisFormData>({
    resolver: zodResolver(finalAnalysisSchema),
    defaultValues: {
      finalStrategy: '',
      finalFacts: '',
    },
  });

  const onSubmit: SubmitHandler<FinalAnalysisFormData> = (data) => {
    onSave(data);
    toast({
      title: "Análise Final Concluída!",
      description: "O caso está pronto para a redação da petição inicial.",
    });
  };

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>7. Análise Jurídica Final</CardTitle>
        <CardDescription>Confira todos os dados e confirme a estratégia antes de redigir a peça inicial.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField control={form.control} name="finalFacts" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><CheckSquare /> Conferência de Fatos e Documentos</FormLabel>
                <FormControl><Textarea readOnly={isReadOnly} placeholder="Descreva a conferência final dos fatos e se todos os documentos estão corretos e presentes." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
             <FormField control={form.control} name="finalStrategy" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Milestone /> Estratégia Jurídica Final</FormLabel>
                <FormControl><Textarea readOnly={isReadOnly} placeholder="Descreva a estrutura lógica da petição e a tese jurídica a ser seguida." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit">Enviar para Redação Inicial</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
