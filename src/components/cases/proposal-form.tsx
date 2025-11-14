
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
import { CalendarIcon, DollarSign, FileSignature, FileUp, Percent, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const proposalSchema = z.object({
  feeType: z.enum(["fixo", "exito", "misto", "mensalidade"], { required_error: "Tipo de honorário é obrigatório."}),
  feeValue: z.preprocess(val => Number(val), z.number().positive("O valor deve ser positivo.")),
  feePercentage: z.preprocess(val => Number(val), z.number().optional()),
  installments: z.preprocess(val => Number(val), z.number().int().optional()),
  contractUrl: z.string().url("URL do contrato inválida.").optional(),
  signedAt: z.date().optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

export default function ProposalForm({ caseData, onSave, isReadOnly }: ProposalFormProps) {
  const { toast } = useToast();
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      feeType: "fixo",
      feeValue: 0,
    },
  });
  
  const feeType = form.watch("feeType");

  const onSubmit: SubmitHandler<ProposalFormData> = (data) => {
    onSave(data);
    toast({
      title: "Proposta Salva!",
      description: "O contrato foi definido e o caso aguarda a coleta de documentos.",
    });
  };

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>5. Proposta e Assinatura do Contrato</CardTitle>
        <CardDescription>Defina os termos comerciais e anexe o contrato assinado.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="feeType" render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2"><FileSignature /> Tipo de Honorário</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4" disabled={isReadOnly}>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="fixo" id="fixo"/></FormControl><FormLabel htmlFor="fixo" className="font-normal">Fixo</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="exito" id="exito"/></FormControl><FormLabel htmlFor="exito" className="font-normal">Êxito</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="misto" id="misto"/></FormControl><FormLabel htmlFor="misto" className="font-normal">Misto</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="mensalidade" id="mensalidade"/></FormControl><FormLabel htmlFor="mensalidade" className="font-normal">Mensalidade</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {(feeType === 'fixo' || feeType === 'misto' || feeType === 'mensalidade') && (
                 <FormField control={form.control} name="feeValue" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><DollarSign /> Valor Fixo (R$)</FormLabel>
                        <FormControl><Input type="number" step="0.01" readOnly={isReadOnly} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
               )}
               {(feeType === 'exito' || feeType === 'misto') && (
                 <FormField control={form.control} name="feePercentage" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Percent /> Percentual de Êxito (%)</FormLabel>
                        <FormControl><Input type="number" step="0.1" readOnly={isReadOnly} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
               )}
               {(feeType === 'fixo' || feeType === 'misto' || feeType === 'mensalidade') && (
                 <FormField control={form.control} name="installments" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Parcelamento</FormLabel>
                         <FormControl><Input type="number" readOnly={isReadOnly} placeholder="Nº de parcelas" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
               )}
            </div>
             <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" disabled={isReadOnly} type="button"><Download className="mr-2 h-4 w-4" /> Gerar Contrato</Button>
                <Button variant="outline" size="sm" disabled={isReadOnly} type="button">Enviar para Assinatura</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="contractUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileUp /> Contrato Assinado (URL)</FormLabel>
                        <FormControl><Input readOnly={isReadOnly} type="url" placeholder="https://..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="signedAt" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data da Assinatura</FormLabel>
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
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit">Salvar e Iniciar Coleta de Documentos</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
