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
  Info
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

const masterMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/deadlines', label: 'Prazos', icon: GanttChartSquare },
  { href: '/clients', label: 'Clientes', icon: Users },
  { 
    label: 'Processos', 
    icon: Briefcase,
    subItems: [
        { href: '/cases?phase=Prospecção', label: 'Prospecção' },
        ...ALL_LEGAL_AREAS.map(area => ({
             href: `/cases?area=${encodeURIComponent(area)}`,
             label: area
        }))
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
    { href: '/cases', label: 'Processos', icon: Briefcase },
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
            return masterMenu;
        case 'Advogado':
            return advogadoMenu;
        case 'Financeiro':
            return financeiroMenu;
        default:
            return [];
    }
}

function SidebarCollapsibleItem({ item, pathname }: { item: any, pathname: string }) {
    const { state } = useSidebar();
    const [isOpen, setIsOpen] = useState(pathname.startsWith('/cases'));

    if (state === 'collapsed') {
      return (
        <Link href="/cases">
            <SidebarMenuButton asChild isActive={pathname.startsWith('/cases')} tooltip={item.label}>
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
                    <span>
                        <item.icon />
                        <span>{item.label}</span>
                    </span>
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub>
                    {item.subItems.map((subItem: any) => (
                        <SidebarMenuSubItem key={subItem.href}>
                             <Link href={subItem.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                   <span>{subItem.label}</span>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuSubItem>
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
                  <SidebarCollapsibleItem item={item} pathname={pathname} />
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
