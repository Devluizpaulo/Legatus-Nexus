"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar"
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) { // check for explicit false, as initial state is undefined
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !currentUser) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="w-full h-full p-4">
                <div className="flex h-full">
                    <Skeleton className="h-full w-64 mr-4" />
                    <div className="flex-1 flex flex-col">
                        <Skeleton className="h-16 w-full mb-4" />
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full bg-background">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsible="icon">
            <AppSidebar />
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
