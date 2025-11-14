
"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Case, ChecklistItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus, Trash, ListChecks, FileUp } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

const documentCollectionSchema = z.object({});

type DocumentCollectionFormData = z.infer<typeof documentCollectionSchema>;

interface DocumentCollectionFormProps {
  caseData: Case;
  onSave: (data: Partial<Case>) => void;
  isReadOnly: boolean;
}

const defaultChecklist: ChecklistItem[] = [
    { id: uuidv4(), text: "Procuração Ad-Judicia", completed: false },
    { id: uuidv4(), text: "Documentos Pessoais (RG/CPF ou CNH)", completed: false },
    { id: uuidv4(), text: "Comprovante de Residência", completed: false },
    { id: uuidv4(), text: "Contrato Social (se PJ)", completed: false },
];

export default function DocumentCollectionForm({ caseData, onSave, isReadOnly }: DocumentCollectionFormProps) {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    // Merge default checklist with existing case requirements, avoiding duplicates
    const existingTexts = new Set((caseData.requirements || []).map(i => i.text));
    const merged = [
        ...(caseData.requirements || []),
        ...defaultChecklist.filter(i => !existingTexts.has(i.text))
    ];
    setChecklist(merged);
  }, [caseData.requirements]);
  
  const handleToggleChecklistItem = (id: string) => {
    if (!isReadOnly) {
      setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    }
  };

  const onSubmit = () => {
    onSave({ requirements: checklist });
    toast({
      title: "Documentos Atualizados!",
      description: "O checklist de documentos foi salvo e o caso avançou para Análise Final.",
    });
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDocumentsCollected = progress === 100;

  return (
    <Card className={cn(isReadOnly && "bg-muted/30 border-dashed")}>
      <CardHeader>
        <CardTitle>6. Coleta de Documentos</CardTitle>
        <CardDescription>Gerencie o recebimento dos documentos essenciais para a propositura da ação.</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <CardContent className="space-y-4">
             <div>
                <div className='flex justify-between items-center mb-2'>
                    <FormLabel className="flex items-center gap-2"><ListChecks /> Checklist de Documentos Obrigatórios</FormLabel>
                    <span className="text-sm font-medium text-muted-foreground">{completedCount} de {totalCount} coletados</span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="mt-4 space-y-2 rounded-md border p-4 max-h-60 overflow-y-auto">
                    {checklist.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => handleToggleChecklistItem(item.id)} disabled={isReadOnly} />
                            <label htmlFor={item.id} className={cn("flex-1 text-sm", item.completed && "line-through text-muted-foreground", isReadOnly && "cursor-not-allowed")}>{item.text}</label>
                        </div>
                    ))}
                    {checklist.length === 0 && <p className="text-xs text-muted-foreground text-center">Nenhum documento necessário.</p>}
                </div>
            </div>
             <FormItem>
                <FormLabel className="flex items-center gap-2"><FileUp /> Upload de Arquivos</FormLabel>
                <FormControl><Input type="file" multiple disabled={isReadOnly} /></FormControl>
                <FormDescription>Envie todos os documentos recebidos do cliente.</FormDescription>
            </FormItem>
          </CardContent>
          {!isReadOnly && (
            <CardFooter className="flex justify-end">
                <Button type="submit" disabled={!allDocumentsCollected}>
                    {allDocumentsCollected ? 'Continuar para Análise Final' : 'Aguardando Documentos'}
                </Button>
            </CardFooter>
          )}
        </form>
    </Card>
  );
}
