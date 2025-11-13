"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { TimeEntry, User } from '@/lib/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect } from 'react';

const timeEntrySchema = z.object({
  date: z.date({ required_error: "A data é obrigatória." }),
  clientId: z.string().min(1, { message: "O cliente é obrigatório." }),
  caseId: z.string().min(1, { message: "O processo é obrigatório." }),
  hours: z.preprocess(
    (val) => Number(String(val).replace(',', '.')),
    z.number().positive({ message: "As horas devem ser um número positivo." })
  ),
  description: z.string().min(1, { message: "A descrição é obrigatória." }),
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

interface TimeEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  entry: TimeEntry | null;
  currentUser: User;
}

export default function TimeEntryForm({ isOpen, onClose, onSave, entry, currentUser }: TimeEntryFormProps) {
  const { tenantData } = useAuth();
  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: entry ? {
      ...entry,
      date: parseISO(entry.date),
    } : {
      date: new Date(),
      clientId: '',
      caseId: '',
      hours: 0,
      description: '',
    },
  });

  const selectedClientId = form.watch('clientId');

  const filteredCases = tenantData?.cases.filter(c => c.clientId === selectedClientId) || [];

  useEffect(() => {
    // Reset caseId if the client changes and the selected case doesn't belong to the new client
    if (selectedClientId) {
      const currentCaseId = form.getValues('caseId');
      if (currentCaseId && !filteredCases.some(c => c.id === currentCaseId)) {
        form.setValue('caseId', '');
      }
    }
  }, [selectedClientId, form, filteredCases]);

  const onSubmit = (data: TimeEntryFormData) => {
    const submissionData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
      userId: currentUser.id,
      status: entry?.status || 'Pendente',
    };
    if (entry?.id) {
      onSave({ ...submissionData, id: entry.id, tenantId: entry.tenantId });
    } else {
      onSave(submissionData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{entry ? 'Editar Lançamento' : 'Lançar Horas'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger></FormControl>
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
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione o processo" /></SelectTrigger></FormControl>
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

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas Trabalhadas</FormLabel>
                  <FormControl><Input type="number" step="0.1" placeholder="Ex: 2.5" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Trabalho</FormLabel>
                  <FormControl><Textarea placeholder="Descreva a atividade realizada..." {...field} /></FormControl>
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
