"use client";

import { useState, useMemo } from 'react';
import type { FaqItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return faqs;
    const lowercasedFilter = searchTerm.toLowerCase();
    return faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(lowercasedFilter) ||
        faq.answer.toLowerCase().includes(lowercasedFilter)
    );
  }, [faqs, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar nas perguntas..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-wrap">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma pergunta encontrada para sua busca.</p>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
