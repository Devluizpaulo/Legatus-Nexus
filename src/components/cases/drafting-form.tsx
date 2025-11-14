
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
import { FileEdit, Paperclip } from 'lucide-react';
import { Input } from '../ui/input';

const draftingSchema = z.object({
  draftContent: z.string().min(50, "O conteúdo da petição é muito curto."),
});

type DraftingFormData = z.infer<typeof draftingSchema>;

interface DraftingFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

export default function DraftingForm({ caseData, onSave, isReadOnly }: DraftingFormProps) {
  const { toast } = useToast();
  const form = useForm<DraftingFormData>({
    resolver: zodResolver(draftingSchema),
    defaultValues: {
      draftContent: '',
    },
  });

  const onSubmit: SubmitHandler<DraftingFormData> = (data) => {
    onSave(data);
    toast({
      title: "Petição Salva!",
      description: "A petição inicial foi elaborada e está pronta para distribuição.",
    });
  };

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>8. Redação Inicial</CardTitle>
        <CardDescription>Elabore a petição inicial, anexe documentos e defina a estratégia final.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className='flex justify-end gap-2'>
                <Button variant="outline" size="sm" disabled={isReadOnly}>Carregar Modelo</Button>
                <Button variant="outline" size="sm" disabled={isReadOnly}>Salvar Versão</Button>
            </div>
            <FormField control={form.control} name="draftContent" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><FileEdit /> Conteúdo da Petição</FormLabel>
                <FormControl><Textarea readOnly={isReadOnly} placeholder="Comece a redigir a petição inicial aqui..." className="min-h-[400px] font-mono" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
             <FormItem>
                <FormLabel className="flex items-center gap-2"><Paperclip /> Anexos</FormLabel>
                <FormControl><Input type="file" multiple disabled={isReadOnly} /></FormControl>
                <FormDescription>Selecione todos os documentos que serão anexados à petição.</FormDescription>
                <FormMessage />
            </FormItem>
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit">Salvar e Enviar para Distribuição</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
