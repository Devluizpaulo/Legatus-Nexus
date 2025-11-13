"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { Deadline, ChecklistItem, User, Client, DeadlineStatus } from '@/lib/types';
import { ALL_DEADLINE_STATUSES } from '@/lib/mock-data';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Trash, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { v4 as uuidv4 } from 'uuid';

const deadlineSchema = z.object({
  title: z.string().min(3, { message: "O título é obrigatório." }),
  caseNumber: z.string().optional(),
  dueDate: z.date({ required_error: "A data de vencimento é obrigatória." }),
  status: z.enum(ALL_DEADLINE_STATUSES as [DeadlineStatus, ...DeadlineStatus[]]),
  responsibleId: z.string().min(1, { message: "O responsável é obrigatório." }),
  clientId: z.string().min(1, { message: "O cliente é obrigatório." }),
});

type DeadlineFormData = z.infer<typeof deadlineSchema>;

interface DeadlineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete: (id: string) => void;
  deadline: Deadline | null;
  currentUser: User;
  users: User[];
  clients: Client[];
}

export default function DeadlineForm({ isOpen, onClose, onSave, onDelete, deadline, currentUser, users, clients }: DeadlineFormProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(deadline?.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const form = useForm<DeadlineFormData>({
    resolver: zodResolver(deadlineSchema),
    defaultValues: {
      title: deadline?.title || '',
      caseNumber: deadline?.caseNumber || '',
      dueDate: deadline ? parseISO(deadline.dueDate) : new Date(),
      status: deadline?.status || 'Pendente',
      responsibleId: deadline?.responsibleId || currentUser.id,
      clientId: deadline?.clientId || '',
    },
  });

  useEffect(() => {
    if (deadline) {
        setChecklist(deadline.checklist);
        form.reset({
            title: deadline.title,
            caseNumber: deadline.caseNumber,
            dueDate: parseISO(deadline.dueDate),
            status: deadline.status,
            responsibleId: deadline.responsibleId,
            clientId: deadline.clientId,
        });
    } else {
        setChecklist([]);
        form.reset({
            title: '',
            caseNumber: '',
            dueDate: new Date(),
            status: 'Pendente',
            responsibleId: currentUser.id,
            clientId: '',
        });
    }
  }, [deadline, form, currentUser.id]);


  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([...checklist, { id: uuidv4(), text: newChecklistItem.trim(), completed: false }]);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };
  
  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };


  const onSubmit = (data: DeadlineFormData) => {
    const submissionData = {
      ...data,
      dueDate: format(data.dueDate, 'yyyy-MM-dd'),
      checklist,
    };
    if (deadline?.id) {
      onSave({ ...submissionData, id: deadline.id });
    } else {
      onSave(submissionData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{deadline ? 'Editar Prazo' : 'Novo Prazo'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="title" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Ex: Apresentar contestação" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="dueDate" control={form.control} render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Vencimento</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR}/></PopoverContent></Popover>
                    <FormMessage /></FormItem>
                )}/>
                <FormField name="status" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent>{ALL_DEADLINE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField name="caseNumber" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Número do Processo</FormLabel><FormControl><Input placeholder="0000000-00.0000.0.00.0000" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="clientId" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Cliente</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger></FormControl>
                    <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField name="responsibleId" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Responsável</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..."/></SelectTrigger></FormControl>
                    <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>

            <div>
                <FormLabel>Checklist de Tarefas</FormLabel>
                <div className="mt-2 space-y-2">
                    {checklist.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => handleToggleChecklistItem(item.id)} />
                            <label htmlFor={item.id} className={cn("flex-1 text-sm", item.completed && "line-through text-muted-foreground")}>{item.text}</label>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveChecklistItem(item.id)}><Trash className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </div>
                 <div className="flex items-center gap-2 mt-3">
                    <Input
                        type="text"
                        placeholder="Adicionar nova tarefa..."
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklistItem(); } }}
                    />
                    <Button type="button" onClick={handleAddChecklistItem}><Plus className="h-4 w-4" /></Button>
                </div>
            </div>

            <DialogFooter>
              <div className="w-full flex justify-between">
                {deadline?.id ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" size="icon"><Trash className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Isso excluirá permanentemente o prazo.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(deadline.id)}>Excluir</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : <div></div>}
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
