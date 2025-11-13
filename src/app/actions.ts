"use server";

import { summarizeLegalDocuments, SummarizeLegalDocumentsInput, SummarizeLegalDocumentsOutput } from "@/ai/flows/summarize-legal-documents";

export async function summarizeLegalDocumentAction(input: SummarizeLegalDocumentsInput): Promise<SummarizeLegalDocumentsOutput> {
    try {
        const result = await summarizeLegalDocuments(input);
        return result;
    } catch(error) {
        console.error("Error in summarizeLegalDocumentAction: ", error);
        // In a real app, you would have more robust error handling and logging
        return { summary: "Ocorreu um erro ao gerar o sumário. Por favor, tente novamente." };
    }
}
