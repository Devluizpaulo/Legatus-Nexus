"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Tenant, Client, Case } from '@/lib/types';
import { MOCK_USERS, MOCK_TENANTS, MOCK_CLIENTS, MOCK_CASES } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  tenantData: {
    clients: Client[];
    cases: Case[];
    users: User[];
  } | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateCases: (updatedCases: Case[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantData, setTenantData] = useState<{ clients: Client[]; cases: Case[]; users: User[] } | null>(null);
  const router = useRouter();

  const login = (email: string, pass: string): boolean => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      if(user.role !== "SuperAdmin") {
        const tenant = MOCK_TENANTS.find(t => t.id === user.tenantId);
        if (tenant) {
            setCurrentTenant(tenant);
            setTenantData({
                clients: MOCK_CLIENTS.filter(c => c.tenantId === tenant.id),
                cases: MOCK_CASES.filter(c => c.tenantId === tenant.id),
                users: MOCK_USERS.filter(u => u.tenantId === tenant.id),
            });
        }
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentTenant(null);
    setTenantData(null);
    router.push('/login');
  };
  
  const updateCases = (updatedCases: Case[]) => {
    if (tenantData) {
      setTenantData({ ...tenantData, cases: updatedCases });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentTenant, tenantData, isAuthenticated: !!currentUser, login, logout, updateCases }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
