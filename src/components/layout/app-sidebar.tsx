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
  UserCheck
} from 'lucide-react';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState, Fragment } from 'react';
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
  const initialOpen = item.subItems?.some((sub: any) => pathname.startsWith(sub.href || ''));
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuSubButton className="w-full justify-between pr-2">
            <span className="whitespace-normal text-left flex-1">{item.label}</span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
        </SidebarMenuSubButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.subItems.map((subItem: any, index: number) => (
            <Fragment key={subItem.label + index}>
              {subItem.subItems ? (
                  <SidebarMenuSubItem>
                    <SidebarCollapsibleItem item={subItem} pathname={pathname} />
                  </SidebarMenuSubItem>
              ) : (
                <SidebarMenuSubItem>
                  <Link href={subItem.href}>
                    <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                      <div className="flex items-center gap-2">
                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                        <span className="whitespace-normal">{subItem.label}</span>
                      </div>
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              )}
            </Fragment>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}


function SidebarComplexItem({ item, pathname }: { item: any, pathname: string }) {
    const { state } = useSidebar();
    const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href));

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
                    {item.subItems.map((subItem: any, index: number) => (
                       <Fragment key={subItem.label + index}>
                         {subItem.subItems ? (
                             <SidebarMenuSubItem>
                               <SidebarCollapsibleItem item={subItem} pathname={pathname} />
                             </SidebarMenuSubItem>
                         ) : (
                           <SidebarMenuSubItem>
                             <Link href={subItem.href}>
                               <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                 <div className="flex items-center gap-2">
                                   {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                   <span className="whitespace-normal">{subItem.label}</span>
                                 </div>
                               </SidebarMenuSubButton>
                             </Link>
                           </SidebarMenuSubItem>
                         )}
                       </Fragment>
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
              {item.subItems ? (
                  <SidebarComplexItem item={item} pathname={pathname} />
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
