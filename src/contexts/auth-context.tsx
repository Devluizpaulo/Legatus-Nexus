"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant, Client, Case, Appointment, Deadline, TimeEntry, FinancialTransaction } from '@/lib/types';
import { MOCK_USERS, MOCK_TENANTS, MOCK_CLIENTS, MOCK_CASES, MOCK_APPOINTMENTS, MOCK_DEADLINES, MOCK_TIME_ENTRIES, MOCK_FINANCIAL_TRANSACTIONS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  tenantData: {
    clients: Client[];
    cases: Case[];
    users: User[];
    appointments: Appointment[];
    deadlines: Deadline[];
    timeEntries: TimeEntry[];
    financialTransactions: FinancialTransaction[];
  } | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateCases: (updatedCases: Case[]) => void;
  addAppointment: (newAppointment: Omit<Appointment, 'id' | 'tenantId'>) => void;
  updateAppointment: (updatedAppointment: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
  addDeadline: (newDeadline: Omit<Deadline, 'id' | 'tenantId'>) => void;
  updateDeadline: (updatedDeadline: Deadline) => void;
  deleteDeadline: (deadlineId: string) => void;
  addClient: (newClient: Omit<Client, 'id' | 'tenantId' | 'caseIds'>) => void;
  updateClient: (updatedClient: Client) => void;
  deleteClient: (clientId: string) => void;
  addTimeEntry: (newTimeEntry: Omit<TimeEntry, 'id' | 'tenantId'>) => void;
  updateTimeEntry: (updatedTimeEntry: TimeEntry) => void;
  deleteTimeEntry: (timeEntryId: string) => void;
  addFinancialTransaction: (newTransaction: Omit<FinancialTransaction, 'id' | 'tenantId'>) => void;
  updateFinancialTransaction: (updatedTransaction: FinancialTransaction) => void;
  deleteFinancialTransaction: (transactionId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantData, setTenantData] = useState<AuthContextType['tenantData']>(null);
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
                deadlines: MOCK_DEADLINES.filter(d => d.tenantId === tenant.id),
                timeEntries: MOCK_TIME_ENTRIES.filter(te => te.tenantId === tenant.id),
                financialTransactions: MOCK_FINANCIAL_TRANSACTIONS.filter(ft => ft.tenantId === tenant.id),
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
        id: `apt-${uuidv4()}`,
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
  
  const addDeadline = (newDeadline: Omit<Deadline, 'id' | 'tenantId'>) => {
    if (tenantData && currentTenant) {
      const fullDeadline: Deadline = {
        ...newDeadline,
        id: `dl-${uuidv4()}`,
        tenantId: currentTenant.id,
      };
      setTenantData({ ...tenantData, deadlines: [...tenantData.deadlines, fullDeadline] });
    }
  };

  const updateDeadline = (updatedDeadline: Deadline) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        deadlines: tenantData.deadlines.map(dl => 
          dl.id === updatedDeadline.id ? updatedDeadline : dl
        ),
      });
    }
  };
  
  const deleteDeadline = (deadlineId: string) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        deadlines: tenantData.deadlines.filter(dl => dl.id !== deadlineId),
      });
    }
  };

  const addClient = (newClient: Omit<Client, 'id' | 'tenantId' | 'caseIds'>) => {
    if (tenantData && currentTenant) {
        const fullClient: Client = {
            ...newClient,
            id: `client-${uuidv4()}`,
            tenantId: currentTenant.id,
            caseIds: [],
        };
        setTenantData({ ...tenantData, clients: [...tenantData.clients, fullClient] });
    }
  };

  const updateClient = (updatedClient: Client) => {
    if (tenantData) {
        setTenantData({
            ...tenantData,
            clients: tenantData.clients.map(c => c.id === updatedClient.id ? { ...c, ...updatedClient} : c)
        });
    }
  };
  
  const deleteClient = (clientId: string) => {
    if (tenantData) {
        // This is a cascade delete for the mock data
        const newClients = tenantData.clients.filter(c => c.id !== clientId);
        const newCases = tenantData.cases.filter(c => c.clientId !== clientId);
        const newAppointments = tenantData.appointments.filter(a => a.clientId !== clientId);
        const newDeadlines = tenantData.deadlines.filter(d => d.clientId !== clientId);

        setTenantData({
            ...tenantData,
            clients: newClients,
            cases: newCases,
            appointments: newAppointments,
            deadlines: newDeadlines,
        });
    }
  };

  const addTimeEntry = (newTimeEntry: Omit<TimeEntry, 'id' | 'tenantId'>) => {
    if (tenantData && currentTenant) {
        const fullTimeEntry: TimeEntry = {
            ...newTimeEntry,
            id: `te-${uuidv4()}`,
            tenantId: currentTenant.id,
        };
        setTenantData({ ...tenantData, timeEntries: [...tenantData.timeEntries, fullTimeEntry] });
    }
  };

  const updateTimeEntry = (updatedTimeEntry: TimeEntry) => {
      if (tenantData) {
          setTenantData({
              ...tenantData,
              timeEntries: tenantData.timeEntries.map(te => te.id === updatedTimeEntry.id ? updatedTimeEntry : te),
          });
      }
  };

  const deleteTimeEntry = (timeEntryId: string) => {
      if (tenantData) {
          setTenantData({
              ...tenantData,
              timeEntries: tenantData.timeEntries.filter(te => te.id !== timeEntryId),
          });
      }
  };

  const addFinancialTransaction = (newTransaction: Omit<FinancialTransaction, 'id' | 'tenantId'>) => {
      if (tenantData && currentTenant) {
          const fullTransaction: FinancialTransaction = {
              ...newTransaction,
              id: `ft-${uuidv4()}`,
              tenantId: currentTenant.id,
          };
          setTenantData({ ...tenantData, financialTransactions: [...tenantData.financialTransactions, fullTransaction] });
      }
  };

  const updateFinancialTransaction = (updatedTransaction: FinancialTransaction) => {
      if (tenantData) {
          setTenantData({
              ...tenantData,
              financialTransactions: tenantData.financialTransactions.map(ft => ft.id === updatedTransaction.id ? updatedTransaction : ft),
          });
      }
  };

  const deleteFinancialTransaction = (transactionId: string) => {
      if (tenantData) {
          setTenantData({
              ...tenantData,
              financialTransactions: tenantData.financialTransactions.filter(ft => ft.id !== transactionId),
          });
      }
  };

  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        currentTenant, 
        tenantData, 
        isAuthenticated, 
        login, 
        logout, 
        updateCases, 
        addAppointment, 
        updateAppointment, 
        deleteAppointment, 
        addDeadline, 
        updateDeadline, 
        deleteDeadline, 
        addClient, 
        updateClient, 
        deleteClient,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
        addFinancialTransaction,
        updateFinancialTransaction,
        deleteFinancialTransaction
    }}>
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
