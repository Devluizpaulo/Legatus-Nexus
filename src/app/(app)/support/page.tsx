"use client";

import { useAuth } from '@/contexts/auth-context';
import FaqSection from '@/components/support/faq-section';
import TicketsSection from '@/components/support/tickets-section';

export default function SupportPage() {
    const { tenantData } = useAuth();
    if (!tenantData) return <div>Carregando...</div>;

    const { faqs, supportTickets } = tenantData;

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Central de Suporte</h1>
                <p className="text-muted-foreground">Encontre respostas ou abra um ticket para obter ajuda.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 items-start">
                <FaqSection faqs={faqs} />
                <TicketsSection tickets={supportTickets} />
            </div>
        </div>
    );
}
