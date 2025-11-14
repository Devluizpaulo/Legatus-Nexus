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
  ChevronDown
} from 'lucide-react';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ALL_LEGAL_AREAS } from '@/lib/mock-data';

const masterMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/deadlines', label: 'Prazos', icon: GanttChartSquare },
  { href: '/clients', label: 'Clientes', icon: Users },
  { 
    label: 'Processos', 
    icon: FolderKanban,
    href: '/cases', // Adicionado para o estado colapsado
    subItems: [
      { href: '/cases?phase=Prospecção', label: 'Prospecção' },
      { 
        label: 'Cível',
        subItems: [
          { href: '/cases?area=Cível&instance=1', label: '1ª Instância' },
          { href: '/cases?area=Cível&instance=2', label: '2ª Instância' },
          { 
            label: 'Tribunais Superiores',
            subItems: [
              { href: '/cases?area=Cível&tribunal=STJ', label: 'STJ' },
              { href: '/cases?area=Cível&tribunal=STF', label: 'STF' },
            ]
          },
          { href: '/cases?area=Cível&status=Execução', label: 'Cumprimento de Sentença / Execução' },
          { href: '/cases?area=Cível&status=Arquivo', label: 'Arquivo Cível' },
        ]
      },
      {
        label: 'Trabalhista',
        subItems: [
          { href: '/cases?area=Trabalhista&instance=1', label: '1ª Instância' },
          { href: '/cases?area=Trabalhista&instance=2', label: '2ª Instância' },
          { 
            label: 'Tribunais Superiores',
            subItems: [
              { href: '/cases?area=Trabalhista&tribunal=TST', label: 'TST' },
              { href: '/cases?area=Trabalhista&tribunal=STF', label: 'STF' },
            ]
          },
          { href: '/cases?area=Trabalhista&status=Execução', label: 'Execução Trabalhista' },
          { href: '/cases?area=Trabalhista&status=Arquivo', label: 'Arquivo Trabalhista' },
        ]
      },
      {
        label: 'Direito de Família e Sucessões',
        subItems: [
          { href: '/cases?area=Família&instance=1', label: '1ª Instância' },
          { href: '/cases?area=Família&instance=2', label: '2ª Instância' },
          { 
            label: 'Tribunais Superiores',
            subItems: [
              { href: '/cases?area=Família&tribunal=STJ', label: 'STJ' },
              { href: '/cases?area=Família&tribunal=STF', label: 'STF' },
            ]
          },
          { href: '/cases?area=Família&status=Execução', label: 'Cumprimento de Sentença / Execução' },
          { href: '/cases?area=Família&status=Arquivo', label: 'Arquivo Família' },
        ]
      },
      {
        label: 'Outros Processos',
        subItems: [
           { href: '/cases?area=Outros&instance=1', label: '1ª Instância' },
           { href: '/cases?area=Outros&instance=2', label: '2ª Instância' },
           { href: '/cases?area=Outros&instance=superior', label: 'Tribunais Superiores' },
           { href: '/cases?area=Outros&status=Arquivo', label: 'Arquivo' },
        ]
      },
      { href: '/cases?status=Arquivo', label: 'Arquivo Geral', icon: Archive },
    ]
  },
  { href: '/financial', label: 'Financeiro', icon: Landmark },
  { href: '/refunds', label: 'Reembolsos', icon: Receipt },
  { href: '/billing', label: 'Faturamento', icon: FileText },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/team', label: 'Equipe', icon: Users },
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
function RecursiveMenuItem({ item, pathname, level = 0 }: { item: any; pathname: string; level?: number }) {
  const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href || item.label));

  if (!item.subItems) {
    return (
      <SidebarMenuSubItem>
        <Link href={item.href}>
          <SidebarMenuSubButton asChild isActive={pathname === item.href}>
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span className="whitespace-normal">{item.label}</span>
            </div>
          </SidebarMenuSubButton>
        </Link>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <SidebarMenuSubButton>
            <div className="flex items-center justify-between w-full">
                <span className="whitespace-normal text-left flex-1">{item.label}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </div>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub style={{ marginLeft: `${level > 0 ? 1 : 0}rem`}}>
            {item.subItems.map((subItem: any) => (
              <RecursiveMenuItem key={subItem.label} item={subItem} pathname={pathname} level={level + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  );
}


function SidebarProcessosItem({ item, pathname }: { item: any, pathname: string }) {
    const { state } = useSidebar();
    const [isOpen, setIsOpen] = useState(pathname.startsWith('/cases'));

    // No modo colapsado, o ícone de Processos é um link direto para a página principal de casos.
    if (state === 'collapsed') {
      return (
        <Link href={item.href}>
            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                <span>
                    <item.icon />
                    <span>{item.label}</span>
                </span>
            </SidebarMenuButton>
        </Link>
      )
    }

    // No modo expandido, é um menu colapsável com sub-itens.
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-2">
                             <item.icon />
                            <span>{item.label}</span>
                         </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </div>
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub>
                    {item.subItems.map((subItem: any) => (
                        <RecursiveMenuItem key={subItem.label} item={subItem} pathname={pathname} />
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
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
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.label === 'Processos' && item.subItems ? (
                  <SidebarProcessosItem item={item} pathname={pathname} />
              ) : (
                <Link href={item.href!}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href!)} tooltip={item.label}>
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
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
