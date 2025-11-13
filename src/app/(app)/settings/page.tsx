"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { User, Building, Palette, Star, Users, FileSignature } from 'lucide-react';
import MeuPerfilTab from '@/components/settings/meu-perfil-tab';
import AparenciaTab from '@/components/settings/aparencia-tab';
import PerfilEscritorioTab from '@/components/settings/perfil-escritorio-tab';
import EquipeTab from '@/components/settings/equipe-tab';
import AvaliarTab from '@/components/settings/avaliar-tab';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import AssinaturaTab from '@/components/settings/assinatura-tab';

type TabId = 'perfil' | 'aparencia' | 'escritorio' | 'equipe' | 'assinatura' |'avaliar';

export default function SettingsPage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>('perfil');

    if (!currentUser) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Skeleton className="h-48 md:col-span-1" />
                <Skeleton className="h-96 md:col-span-3" />
            </div>
        );
    }
    
    const isMaster = currentUser.role === 'Master';
    const isFinanceiro = currentUser.role === 'Financeiro';
    const isSuperAdmin = currentUser.role === 'SuperAdmin';

    const tabs = [
        !isSuperAdmin && { id: 'perfil', label: 'Meu Perfil', icon: User },
        { id: 'aparencia', label: 'Aparência', icon: Palette },
        isMaster && { id: 'escritorio', label: 'Perfil do Escritório', icon: Building },
        isMaster && { id: 'equipe', label: 'Equipe', icon: Users },
        (isMaster || isFinanceiro) && { id: 'assinatura', label: 'Assinatura', icon: FileSignature },
        !isSuperAdmin && { id: 'avaliar', label: 'Avaliar Sistema', icon: Star },
    ].filter(Boolean) as { id: TabId; label: string; icon: React.ElementType }[];
    
    // Adjust initial active tab if it's not available for the current user
    if (!tabs.find(t => t.id === activeTab)) {
        setActiveTab(tabs[0]?.id || 'perfil');
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'perfil':
                return <MeuPerfilTab />;
            case 'aparencia':
                return <AparenciaTab />;
            case 'escritorio':
                return isMaster ? <PerfilEscritorioTab /> : null;
            case 'equipe':
                return isMaster ? <EquipeTab /> : null;
            case 'assinatura':
                return (isMaster || isFinanceiro) ? <AssinaturaTab /> : null;
            case 'avaliar':
                return <AvaliarTab />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">Gerencie suas preferências e as configurações do escritório.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <nav className="md:col-span-1 flex flex-row md:flex-col gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full text-left",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="md:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
