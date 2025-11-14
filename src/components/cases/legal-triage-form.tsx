
"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Case, ChecklistItem, ViabilityLevel } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ALL_VIABILITY_LEVELS } from '@/lib/mock-data';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';
import { Plus, Trash, FileSearch, Target, ListChecks } from 'lucide-react';

const triageSchema = z.object({
  triageAnalysis: z.string().min(10, { message: "A análise é obrigatória." }),
  viability: z.string().min(1, { message: "A viabilidade é obrigatória" }),
});

type TriageFormData = z.infer<typeof triageSchema>;

interface LegalTriageFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

export default function LegalTriageForm({ caseData, onSave, isReadOnly }: LegalTriageFormProps) {
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<ChecklistItem[]>(caseData.requirements || []);
  const [newRequirement, setNewRequirement] = useState('');

  const form = useForm<TriageFormData>({
    resolver: zodResolver(triageSchema),
    defaultValues: {
      triageAnalysis: caseData.triageAnalysis || '',
      viability: caseData.viability || '',
    },
  });

   useEffect(() => {
    setRequirements(caseData.requirements || []);
    form.reset({
      triageAnalysis: caseData.triageAnalysis || '',
      viability: caseData.viability || '',
    });
  }, [caseData, form]);

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !isReadOnly) {
      setRequirements([...requirements, { id: uuidv4(), text: newRequirement.trim(), completed: false }]);
      setNewRequirement('');
    }
  };

  const handleToggleRequirement = (id: string) => {
    if (!isReadOnly) {
      setRequirements(requirements.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    }
  };
  
  const handleRemoveRequirement = (id: string) => {
    if (!isReadOnly) {
      setRequirements(requirements.filter(item => item.id !== id));
    }
  };

  const onSubmit: SubmitHandler<TriageFormData> = (data) => {
    onSave({ 
      ...data,
      requirements,
      viability: data.viability as ViabilityLevel,
    });
    toast({
      title: "Triagem Jurídica Salva!",
      description: "O caso avançou para a etapa de Reunião com Cliente.",
    });
  };

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>3. Triagem Jurídica (Análise de Viabilidade)</CardTitle>
        <CardDescription>Analise a viabilidade jurídica do caso e defina os próximos passos.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="triageAnalysis" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2"><FileSearch /> Análise Preliminar / Parecer Jurídico</FormLabel>
                <FormControl><Textarea readOnly={isReadOnly} placeholder="Descreva sua análise sobre a viabilidade, riscos e pontos de atenção do caso..." className="min-h-[120px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
             <FormField control={form.control} name="viability" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Target /> Nível de Viabilidade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                    <SelectContent>{ALL_VIABILITY_LEVELS.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
            <div>
                <FormLabel className="flex items-center gap-2"><ListChecks /> Checklist de Requisitos / Documentos Faltantes</FormLabel>
                <div className="mt-2 space-y-2 rounded-md border p-4">
                    {requirements.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => handleToggleRequirement(item.id)} disabled={isReadOnly} />
                            <label htmlFor={item.id} className={cn("flex-1 text-sm", item.completed && "line-through text-muted-foreground", isReadOnly && "cursor-not-allowed")}>{item.text}</label>
                            {!isReadOnly && <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveRequirement(item.id)}><Trash className="h-4 w-4" /></Button>}
                        </div>
                    ))}
                    {requirements.length === 0 && <p className="text-xs text-muted-foreground text-center">Nenhum requisito adicionado.</p>}
                </div>
                {!isReadOnly && (
                 <div className="flex items-center gap-2 mt-3">
                    <Input
                        type="text"
                        placeholder="Adicionar requisito (Ex: Procuração, RG/CPF...)"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRequirement(); } }}
                        readOnly={isReadOnly}
                    />
                    <Button type="button" onClick={handleAddRequirement} disabled={isReadOnly}><Plus className="h-4 w-4" /></Button>
                </div>
                )}
            </div>
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit">Salvar e Agendar Reunião</Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
