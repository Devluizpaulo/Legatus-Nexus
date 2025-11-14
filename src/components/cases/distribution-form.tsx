
"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Case } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, FileUp, Gavel, Landmark, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';

const distributionSchema = z.object({
  caseNumber: z.string().min(1, "Número do processo é obrigatório"),
  distributionDate: z.date({ required_error: "Data de distribuição é obrigatória"}),
  comarca: z.string().min(1, "Foro / Comarca é obrigatório"),
  vara: z.string().min(1, "Vara é obrigatória"),
  proofUrl: z.string().url("URL do comprovante inválida").optional(),
});

type DistributionFormData = z.infer<typeof distributionSchema>;

interface DistributionFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

export default function DistributionForm({ caseData, onSave, isReadOnly }: DistributionFormProps) {
  const { toast } = useToast();
  const form = useForm<DistributionFormData>({
    resolver: zodResolver(distributionSchema),
    defaultValues: {
      caseNumber: caseData.caseNumber || '',
      distributionDate: caseData.deadline ? new Date(caseData.deadline) : new Date(), // Mocking
      comarca: caseData.comarca || '',
      vara: caseData.vara || '',
      proofUrl: '',
    },
  });

  const onSubmit: SubmitHandler<DistributionFormData> = (data) => {
    onSave(data);
    toast({
      title: "Processo Distribuído com Sucesso!",
      description: "O Lead foi convertido em Processo e movido para o funil jurídico correspondente.",
    });
  };

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>9. Distribuição / Protocolo</CardTitle>
        <CardDescription>Registre as informações do processo recém-distribuído para movê-lo ao funil jurídico.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="caseNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Hash /> Número do Processo</FormLabel>
                        <FormControl><Input readOnly={isReadOnly} placeholder="0000000-00.0000.0.00.0000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="distributionDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data da Distribuição</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isReadOnly}>
                                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={isReadOnly} locale={ptBR}/>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}/>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="comarca" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Landmark /> Foro / Comarca</FormLabel>
                        <FormControl><Input readOnly={isReadOnly} placeholder="Ex: Foro Central Cível - João Mendes" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="vara" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Gavel /> Vara</FormLabel>
                        <FormControl><Input readOnly={isReadOnly} placeholder="Ex: 10ª Vara Cível" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
             </div>
             <FormField control={form.control} name="proofUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileUp /> Comprovante da Distribuição (URL)</FormLabel>
                        <FormControl><Input readOnly={isReadOnly} type="url" placeholder="https://..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit">Concluir Prospecção e Gerar Processo</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
