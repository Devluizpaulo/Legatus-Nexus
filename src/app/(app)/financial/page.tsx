"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import ControleHorasView from '@/components/financial/controle-horas-view';
import TransacoesView from '@/components/financial/transacoes-view';
import FluxoCaixaView from '@/components/financial/fluxo-caixa-view';
import { cn } from '@/lib/utils';
import { Clock, Landmark, BarChart3 } from 'lucide-react';

type ActiveTab = 'horas' | 'transacoes' | 'fluxo';

export default function FinancialPage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>('horas');

    const canViewFluxoCaixa = currentUser?.role === 'Master' || currentUser?.role === 'Financeiro';

    const tabs = [
        { id: 'horas', label: 'Controle de Horas', icon: Clock },
        { id: 'transacoes', label: 'Despesas e Ganhos', icon: Landmark },
        ...(canViewFluxoCaixa ? [{ id: 'fluxo', label: 'Fluxo de Caixa', icon: BarChart3 }] : [])
    ];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Financeiro</h1>
                <p className="text-muted-foreground">Gerencie horas, transações e o fluxo de caixa do seu escritório.</p>
            </div>

            <div className="border-b">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ActiveTab)}
                            className={cn(
                                'flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1">
                {activeTab === 'horas' && <ControleHorasView />}
                {activeTab === 'transacoes' && <TransacoesView />}
                {activeTab === 'fluxo' && canViewFluxoCaixa && <FluxoCaixaView />}
            </div>
        </div>
    );
}
