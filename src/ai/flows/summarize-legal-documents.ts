'use server';

/**
 * @fileOverview A flow that summarizes legal documents.
 *
 * - summarizeLegalDocuments - A function that handles the summarization of legal documents.
 * - SummarizeLegalDocumentsInput - The input type for the summarizeLegalDocuments function.
 * - SummarizeLegalDocumentsOutput - The return type for the summarizeLegalDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLegalDocumentsInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the legal document to be summarized.'),
});

export type SummarizeLegalDocumentsInput = z.infer<
  typeof SummarizeLegalDocumentsInputSchema
>;

const SummarizeLegalDocumentsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the legal document.'),
});

export type SummarizeLegalDocumentsOutput = z.infer<
  typeof SummarizeLegalDocumentsOutputSchema
>;

export async function summarizeLegalDocuments(
  input: SummarizeLegalDocumentsInput
): Promise<SummarizeLegalDocumentsOutput> {
  return summarizeLegalDocumentsFlow(input);
}

const summarizeLegalDocumentsPrompt = ai.definePrompt({
  name: 'summarizeLegalDocumentsPrompt',
  input: {schema: SummarizeLegalDocumentsInputSchema},
  output: {schema: SummarizeLegalDocumentsOutputSchema},
  prompt: `You are an expert legal assistant tasked with summarizing legal documents. Please provide a concise and accurate summary of the following document:\n\n{{{documentText}}}`,
});

const summarizeLegalDocumentsFlow = ai.defineFlow(
  {
    name: 'summarizeLegalDocumentsFlow',
    inputSchema: SummarizeLegalDocumentsInputSchema,
    outputSchema: SummarizeLegalDocumentsOutputSchema,
  },
  async input => {
    const {output} = await summarizeLegalDocumentsPrompt(input);
    return output!;
  }
);
