"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant, Client, Case, Appointment } from '@/lib/types';
import { MOCK_USERS, MOCK_TENANTS, MOCK_CLIENTS, MOCK_CASES, MOCK_APPOINTMENTS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  tenantData: {
    clients: Client[];
    cases: Case[];
    users: User[];
    appointments: Appointment[];
  } | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateCases: (updatedCases: Case[]) => void;
  addAppointment: (newAppointment: Omit<Appointment, 'id' | 'tenantId'>) => void;
  updateAppointment: (updatedAppointment: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantData, setTenantData] = useState<{ clients: Client[]; cases: Case[]; users: User[], appointments: Appointment[] } | null>(null);
  const router = useRouter();
  
  const isAuthenticated = !!currentUser;

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
                appointments: MOCK_APPOINTMENTS.filter(a => a.tenantId === tenant.id),
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

  const addAppointment = (newAppointment: Omit<Appointment, 'id' | 'tenantId'>) => {
    if (tenantData && currentTenant) {
      const fullAppointment: Appointment = {
        ...newAppointment,
        id: `apt-${Date.now()}`,
        tenantId: currentTenant.id,
      };
      setTenantData({ ...tenantData, appointments: [...tenantData.appointments, fullAppointment] });
    }
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        appointments: tenantData.appointments.map(apt => 
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        ),
      });
    }
  };

  const deleteAppointment = (appointmentId: string) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        appointments: tenantData.appointments.filter(apt => apt.id !== appointmentId),
      });
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, currentTenant, tenantData, isAuthenticated, login, logout, updateCases, addAppointment, updateAppointment, deleteAppointment }}>
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
