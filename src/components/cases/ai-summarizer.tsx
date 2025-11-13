"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { summarizeLegalDocumentAction } from "@/app/actions";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";

export default function AISummarizer() {
  const [documentText, setDocumentText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!documentText.trim()) {
      setError("O texto do documento não pode estar vazio.");
      return;
    }
    setError("");
    setIsLoading(true);
    setSummary("");
    
    try {
      const result = await summarizeLegalDocumentAction({ documentText });
      if (result.summary) {
        setSummary(result.summary);
      } else {
        setError("Não foi possível gerar o sumário. Tente novamente.");
      }
    } catch (e) {
      setError("Ocorreu um erro de comunicação com o serviço de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary"/>
            <CardTitle>Sumarizador de Documentos com IA</CardTitle>
        </div>
        <CardDescription>
          Cole o texto de um documento legal abaixo para gerar um sumário conciso.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Textarea
          placeholder="Cole o texto do documento aqui..."
          className="min-h-[200px]"
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Sumarizando..." : "Gerar Sumário"}
        </Button>

        {(isLoading || summary) && (
             <Card className="bg-secondary/50 dark:bg-card/60">
                <CardHeader>
                    <CardTitle className="text-lg">Sumário Gerado</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <p className="text-sm whitespace-pre-wrap">{summary}</p>
                    )}
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
