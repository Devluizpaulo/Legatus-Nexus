"use client";

import { useAuth } from '@/contexts/auth-context';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSkeleton,
  useSidebar
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Clock,
  Landmark,
  FileText,
  Settings,
  LogOut,
  User,
  GanttChartSquare,
  BadgeHelp,
  BarChart3,
  Receipt,
  FileSignature,
  History,
  Info,
  FolderKanban,
  Archive,
  ChevronDown,
  Folder,
  ClipboardList,
  Library,
  Truck,
  UserCheck,
  Shield
} from 'lucide-react';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState, Fragment, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ALL_LEGAL_AREAS } from '@/lib/mock-data';

const masterMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { 
    label: 'Processos', 
    icon: FolderKanban,
    href: '/cases', 
    subItems: [
      { href: '/cases/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/cases?phase=Prospecção', label: 'Prospecção' },
      { 
        label: 'Cível',
        subItems: [
          { href: '/cases?area=Cível&instance=1', label: '1ª Instância' },
          { href: '/cases?area=Cível&instance=2', label: '2ª Instância' },
          { href: '/cases?area=Cível&tribunal=STJ', label: 'STJ' },
          { href: '/cases?area=Cível&tribunal=STF', label: 'STF' },
          { href: '/cases?area=Cível&status=Execução', label: 'Cumprimento / Execução' },
        ]
      },
      {
        label: 'Trabalhista',
        subItems: [
          { href: '/cases?area=Trabalhista&instance=1', label: '1ª Instância' },
          { href: '/cases?area=Trabalhista&instance=2', label: '2ª Instância (TRT)' },
          { href: '/cases?area=Trabalhista&tribunal=TST', label: 'TST' },
        ]
      },
       {
        label: 'Criminal',
        icon: Shield,
        subItems: [
          { href: '/cases?area=Criminal&phase=inquerito', label: 'Fase de Inquérito' },
          { href: '/cases?area=Criminal&instance=1', label: '1ª Instância' },
          { href: '/cases?area=Criminal&instance=2', label: '2ª Instância' },
          { href: '/cases?area=Criminal&tribunal=superior', label: 'Tribunais Superiores' },
          { href: '/cases?area=Criminal&phase=execucao', label: 'Execução Penal' },
        ]
      },
      { href: '/cases?status=Arquivo', label: 'Arquivo Geral', icon: Archive },
    ]
  },
  { 
    label: 'Agenda & Prazos', 
    icon: Calendar,
    href: '/agenda',
    subItems: [
        { href: '/agenda', label: 'Agenda Geral', icon: Calendar },
        { href: '/deadlines', label: 'Controle de Prazos', icon: GanttChartSquare },
    ]
  },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/documents', label: 'Documentos (GED)', icon: Folder },
  { href: '/tasks', label: 'Tarefas Internas', icon: ClipboardList },
  { 
    label: 'Gestão Financeira', 
    icon: Landmark,
    href: '/financial',
    subItems: [
        { href: '/financial', label: 'Controle de Horas', icon: Clock },
        { href: '/financial?tab=transacoes', label: 'Despesas e Ganhos', icon: Landmark },
        { href: '/billing', label: 'Faturamento', icon: FileText },
        { href: '/refunds', label: 'Reembolsos', icon: Receipt },
        { href: '/financial?tab=fluxo', label: 'Fluxo de Caixa', icon: BarChart3 },
    ]
  },
  { 
    label: 'Recursos', 
    icon: Library,
    href: '/library',
    subItems: [
        { href: '/library/templates', label: 'Biblioteca de Modelos', icon: Library },
        { href: '/correspondents', label: 'Correspondentes', icon: Truck },
    ]
  },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/team', label: 'Equipe', icon: Users },
  { href: '/client-portal', label: 'Portal do Cliente', icon: UserCheck },
  { href: '/audit', label: 'Auditoria', icon: History },
  { href: '/support', label: 'Suporte', icon: Info },
];

const advogadoMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cases', label: 'Processos', icon: FolderKanban },
    { href: '/clients', label: 'Clientes', icon: Users },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: '/deadlines', label: 'Prazos', icon: GanttChartSquare },
    { href: '/time-tracking', label: 'Horas', icon: Clock },
];

const financeiroMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/billing', label: 'Faturamento', icon: FileText },
    { href: '/financial', label: 'Despesas e Ganhos', icon: Landmark },
    { href: '/reports', label: 'Relatórios', icon: BarChart3 },
];

const getMenuItems = (role: string) => {
    switch (role) {
        case 'Master':
            return masterMenuItems;
        case 'Advogado':
            return advogadoMenu;
        case 'Financeiro':
            return financeiroMenu;
        default:
            return [];
    }
}

// Componente recursivo para renderizar itens de menu aninhados
function SidebarCollapsibleItem({ item, pathname }: { item: any; pathname: string; }) {
  const { state } = useSidebar();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isParentActive = hasSubItems && (item.href ? pathname.startsWith(item.href) : item.subItems.some((sub: any) => pathname.startsWith(sub.href)));
  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [pathname, isParentActive]);

  if (!hasSubItems) {
    return (
        <SidebarMenuItem>
            <Link href={item.href!}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <span>
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                    </span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
    );
  }
  
  const CollapsibleComponent = state === 'collapsed' ? 'div' : Collapsible;
  const TriggerComponent = state === 'collapsed' ? 'div' : CollapsibleTrigger;
  const ContentComponent = state === 'collapsed' ? 'div' : CollapsibleContent;

  return (
    <CollapsibleComponent asChild>
      <SidebarMenuItem>
        <TriggerComponent asChild>
          <SidebarMenuButton asChild isActive={isParentActive} tooltip={item.label}>
             <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                </div>
                {state !== 'collapsed' && <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />}
             </div>
          </SidebarMenuButton>
        </TriggerComponent>
        <ContentComponent>
          <SidebarMenuSub>
            {item.subItems.map((subItem: any, index: number) => (
               <SidebarCollapsibleItem key={index} item={subItem} pathname={pathname} />
            ))}
          </SidebarMenuSub>
        </ContentComponent>
      </SidebarMenuItem>
    </CollapsibleComponent>
  )
}

export default function AppSidebar() {
  const { currentUser, currentTenant, logout } = useAuth();
  const pathname = usePathname();
  
  if (!currentUser || !currentTenant) return <SidebarMenuSkeleton showIcon />;

  const menuItems = getMenuItems(currentUser.role);

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <Separator />
      <SidebarContent className='p-2'>
        <SidebarMenu>
           {menuItems.map((item, index) => (
             <SidebarCollapsibleItem key={index} item={item} pathname={pathname} />
           ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className='p-2'>
         <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings">
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip="Configurações">
                      <span><Settings /><span>Configurações</span></span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Sair">
                    <LogOut/>
                    <span>Sair</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
