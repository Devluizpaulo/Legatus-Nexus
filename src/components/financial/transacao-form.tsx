"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { FinancialTransaction, User, TransactionType } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ALL_TRANSACTION_TYPES } from '@/lib/mock-data';

const transactionSchema = z.object({
  date: z.date({ required_error: "A data é obrigatória." }),
  type: z.enum(ALL_TRANSACTION_TYPES as [TransactionType, ...TransactionType[]], { required_error: "O tipo é obrigatório." }),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
  amount: z.preprocess(
    (val) => Number(String(val).replace(',', '.')),
    z.number().positive({ message: "O valor deve ser um número positivo." })
  ),
  notes: z.string().optional(),
});

type TransacaoFormData = z.infer<typeof transactionSchema>;

interface TransacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  transaction: FinancialTransaction | null;
  currentUser: User;
}

export default function TransacaoForm({ isOpen, onClose, onSave, transaction, currentUser }: TransacaoFormProps) {
  const form = useForm<TransacaoFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? {
      ...transaction,
      date: parseISO(transaction.date),
    } : {
      date: new Date(),
      type: 'Despesa',
      description: '',
      amount: 0,
      notes: '',
    },
  });

  const onSubmit = (data: TransacaoFormData) => {
    const submissionData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
      userId: transaction?.userId || currentUser.id,
      status: transaction?.status || 'Pendente',
    };
    if (transaction?.id) {
      onSave({ ...submissionData, id: transaction.id, tenantId: transaction.tenantId });
    } else {
      onSave(submissionData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Transação</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="Despesa" id="r-despesa" /></FormControl>
                        <FormLabel htmlFor="r-despesa" className="font-normal">Despesa</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="Ganho" id="r-ganho" /></FormControl>
                        <FormLabel htmlFor="r-ganho" className="font-normal">Ganho</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="Ex: 150.75" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl><Input placeholder="Ex: Honorários, Taxa de protocolo, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Detalhes adicionais sobre a transação..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
