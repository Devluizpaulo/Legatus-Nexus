"use client"

import { useAuth } from "@/contexts/auth-context"
import AttorneyDashboard from "@/components/dashboard/attorney-dashboard";
import FinancialDashboard from "@/components/dashboard/financial-dashboard";
import MasterDashboard from "@/components/dashboard/master-dashboard";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { currentUser, tenantData } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    }

    const renderDashboard = () => {
        if (!currentUser || !tenantData) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                    </div>
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-80" />
                        <Skeleton className="h-80" />
                        <Skeleton className="h-80" />
                    </div>
                </div>
            )
        }
        
        switch(currentUser?.role) {
            case "Master":
                return <MasterDashboard />;
            case "Advogado":
                return <AttorneyDashboard />;
            case "Financeiro":
                return <FinancialDashboard />;
            case "SuperAdmin":
                return <SuperAdminDashboard />;
            default:
                return <p className="text-muted-foreground">Dashboard não disponível para o seu cargo.</p>
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">{getGreeting()}, {currentUser?.name.split(' ')[0]}!</p>
            </div>
            {renderDashboard()}
        </div>
    )
}
