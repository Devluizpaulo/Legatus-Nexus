"use client";

import { useAuth } from '@/contexts/auth-context';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton
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

const masterMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/deadlines', label: 'Prazos', icon: GanttChartSquare },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/cases', label: 'Processos', icon: Briefcase },
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
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                  <span>
                    <item.icon />
                    <span>{item.label}</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className='p-2'>
         <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings">
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')}>
                      <span><Settings /><span>Configurações</span></span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} >
                    <LogOut/>
                    <span>Sair</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
