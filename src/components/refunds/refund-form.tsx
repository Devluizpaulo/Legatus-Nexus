"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Refund, User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect } from 'react';

const refundSchema = z.object({
  date: z.date({ required_error: "A data da despesa é obrigatória." }),
  amount: z.preprocess(
    (val) => Number(String(val).replace(',', '.')),
    z.number().positive({ message: "O valor deve ser um número positivo." })
  ),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  attachmentUrl: z.string().optional(), // In a real app, this would be a file upload
});

type RefundFormData = z.infer<typeof refundSchema>;

interface RefundFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  refund: Refund | null;
  currentUser: User;
}

export default function RefundForm({ isOpen, onClose, onSave, refund, currentUser }: RefundFormProps) {
  const { tenantData } = useAuth();
  const form = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: refund ? {
      ...refund,
      date: parseISO(refund.date),
    } : {
      date: new Date(),
      amount: 0,
      description: '',
      clientId: '',
      caseId: '',
      attachmentUrl: '',
    },
  });

  const selectedClientId = form.watch('clientId');

  const filteredCases = tenantData?.cases.filter(c => c.clientId === selectedClientId) || [];

  useEffect(() => {
    if (selectedClientId) {
      const currentCaseId = form.getValues('caseId');
      if (currentCaseId && !filteredCases.some(c => c.id === currentCaseId)) {
        form.setValue('caseId', '');
      }
    }
  }, [selectedClientId, form, filteredCases]);
  
  useEffect(() => {
      form.reset(refund ? {
      ...refund,
      date: parseISO(refund.date),
    } : {
      date: new Date(),
      amount: 0,
      description: '',
      clientId: '',
      caseId: '',
      attachmentUrl: '',
    });
  }, [refund, form]);

  const onSubmit = (data: RefundFormData) => {
    const submissionData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
      userId: refund?.userId || currentUser.id,
      status: refund?.status || 'Pendente',
    };
    if (refund?.id) {
      onSave({ ...submissionData, id: refund.id, tenantId: refund.tenantId });
    } else {
      onSave(submissionData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{refund ? 'Editar Solicitação' : 'Nova Solicitação de Reembolso'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Despesa</FormLabel>
                  <FormControl><Input placeholder="Ex: Corrida de táxi para o fórum" {...field} /></FormControl>
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
                        <FormLabel>Data da Despesa</FormLabel>
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
                        <FormControl><Input type="number" step="0.01" placeholder="Ex: 45.50" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
              control={form.control}
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Comprovante</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Faturar para Cliente (Opcional)</h3>
                <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
                    <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                            {tenantData?.clients.map(client => (
                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="caseId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Processo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClientId}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                            <SelectContent>
                            {filteredCases.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar Solicitação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
