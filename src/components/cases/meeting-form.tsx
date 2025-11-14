
"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Case } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Users, Video, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';

const meetingSchema = z.object({
  meetingDate: z.date().optional(),
  meetingNotes: z.string().min(10, "As anotações da reunião são obrigatórias."),
  meetingLink: z.string().url("URL da gravação inválida").optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

interface MeetingFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

export default function MeetingForm({ caseData, onSave, isReadOnly }: MeetingFormProps) {
  const { toast } = useToast();
  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      meetingDate: new Date(), // Mock, em um caso real viria da agenda
      meetingNotes: '',
      meetingLink: '',
    },
  });

  const onSubmit: SubmitHandler<MeetingFormData> = (data) => {
    onSave(data);
    toast({
      title: "Reunião Registrada!",
      description: "O caso avançou para a etapa de Proposta Comercial.",
    });
  };

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>4. Reunião com o Cliente</CardTitle>
        <CardDescription>Registre os detalhes e os próximos passos definidos na entrevista jurídica.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="meetingDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">Data e Hora da Reunião</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isReadOnly}>
                                        {field.value ? format(field.value, "PPP 'às' HH:mm", { locale: ptBR }) : <span>Escolha uma data</span>}
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
                <FormItem>
                    <FormLabel className="flex items-center gap-2"><Users /> Responsável pela Reunião</FormLabel>
                    <FormControl><Input readOnly defaultValue={caseData.responsible.join(', ')} /></FormControl>
                </FormItem>
             </div>

            <FormField control={form.control} name="meetingNotes" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><FileText /> Anotações, Pontos Fortes/Fracos e Estratégias</FormLabel>
                <FormControl><Textarea readOnly={isReadOnly} placeholder="Descreva detalhadamente o que foi discutido e definido na reunião com o cliente..." className="min-h-[150px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>

             <FormField control={form.control} name="meetingLink" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Video /> Link da Gravação (Opcional)</FormLabel>
                <FormControl><Input readOnly={isReadOnly} type="url" placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit">Salvar e Criar Proposta</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
