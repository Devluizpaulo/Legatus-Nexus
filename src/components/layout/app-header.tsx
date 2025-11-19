"use client"

import { PanelLeft, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { UserNav } from './user-nav'
import { Button } from '../ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Logo } from './logo';

export default function AppHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger asChild className="md:hidden">
            <Button size="icon" variant="outline">
                <PanelLeft />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
        </SidebarTrigger>
        <div className='hidden md:block'>
            <Logo />
        </div>
        <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Pesquisar..."
            className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
            />
        </div>
        <UserNav />
    </header>
  )
}
