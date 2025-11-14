
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Tenant, Client, Case, Appointment, Deadline, TimeEntry, FinancialTransaction, Refund, Invoice, Subscription, Plan, BillingHistory, AuditLog, FaqItem, SupportTicket, Achievement } from '@/lib/types';
import { MOCK_USERS, MOCK_TENANTS, MOCK_CLIENTS, MOCK_CASES, MOCK_APPOINTMENTS, MOCK_DEADLINES, MOCK_TIME_ENTRIES, MOCK_FINANCIAL_TRANSACTIONS, MOCK_REFUNDS, MOCK_INVOICES, MOCK_SUBSCRIPTIONS, MOCK_PLANS, MOCK_BILLING_HISTORY, MOCK_AUDIT_LOGS, MOCK_FAQS, MOCK_SUPPORT_TICKETS, MOCK_ACHIEVEMENTS } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

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
    refunds: Refund[];
    invoices: Invoice[];
    subscription: Subscription;
    plan: Plan;
    billingHistory: BillingHistory[];
    auditLogs: AuditLog[];
    faqs: FaqItem[];
    supportTickets: SupportTicket[];
    achievements: Achievement[];
  } | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateCases: (updatedCases: Case[]) => void;
  updateCase: (updatedCase: Case) => void;
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
  addRefund: (newRefund: Omit<Refund, 'id' | 'tenantId'>) => void;
  updateRefund: (updatedRefund: Refund) => void;
  deleteRefund: (refundId: string) => void;
  updateInvoice: (updatedInvoice: Invoice) => void;
  addUser: (newUser: Omit<User, 'id' | 'tenantId' | 'avatarUrl' | 'password'>) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  addSupportTicket: (newTicket: Omit<SupportTicket, 'id' | 'tenantId' | 'userId' | 'status' | 'createdAt'>) => void;
  allAuditLogs: AuditLog[];
  allUsers: User[];
  allTenants: Tenant[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantData, setTenantData] = useState<AuthContextType['tenantData']>(null);
  const router = useRouter();
  
  const isAuthenticated = !!currentUser;

  // Data for SuperAdmin
  const allAuditLogs = MOCK_AUDIT_LOGS;
  const allUsers = MOCK_USERS;
  const allTenants = MOCK_TENANTS;

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
                refunds: MOCK_REFUNDS.filter(r => r.tenantId === tenant.id),
                invoices: MOCK_INVOICES.filter(i => i.tenantId === tenant.id),
                subscription: MOCK_SUBSCRIPTIONS.find(s => s.tenantId === tenant.id)!,
                plan: MOCK_PLANS.find(p => p.id === MOCK_SUBSCRIPTIONS.find(s => s.tenantId === tenant.id)?.planId)!,
                billingHistory: MOCK_BILLING_HISTORY.filter(b => b.tenantId === tenant.id),
                auditLogs: MOCK_AUDIT_LOGS.filter(log => log.tenantId === tenant.id),
                faqs: MOCK_FAQS,
                supportTickets: MOCK_SUPPORT_TICKETS.filter(st => st.tenantId === tenant.id),
                achievements: MOCK_ACHIEVEMENTS.filter(ach => MOCK_USERS.find(u => u.id === ach.userId && u.tenantId === tenant.id)),
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

  const updateCase = (updatedCase: Case) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        cases: tenantData.cases.map(c => c.id === updatedCase.id ? updatedCase : c),
      });
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

  const addRefund = (newRefund: Omit<Refund, 'id' | 'tenantId'>) => {
    if (tenantData && currentTenant) {
      const fullRefund: Refund = {
        ...newRefund,
        id: `ref-${uuidv4()}`,
        tenantId: currentTenant.id,
      };
      setTenantData({ ...tenantData, refunds: [...tenantData.refunds, fullRefund] });
    }
  };

  const updateRefund = (updatedRefund: Refund) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        refunds: tenantData.refunds.map(r => r.id === updatedRefund.id ? updatedRefund : r),
      });
    }
  };

  const deleteRefund = (refundId: string) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        refunds: tenantData.refunds.filter(r => r.id !== refundId),
      });
    }
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        invoices: tenantData.invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i),
      });
    }
  };

  const addUser = (newUser: Omit<User, 'id' | 'tenantId' | 'avatarUrl' | 'password'>) => {
    if (tenantData && currentTenant) {
      const fullUser: User = {
        ...newUser,
        id: `user-${uuidv4()}`,
        tenantId: currentTenant.id,
        password: 'password', // Default password
        avatarUrl: '', // Placeholder
      };
      setTenantData({ ...tenantData, users: [...tenantData.users, fullUser] });
    }
  };

  const updateUser = (updatedUser: User) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        users: tenantData.users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser} : u),
      });
    }
  };

  const deleteUser = (userId: string) => {
    if (tenantData) {
      setTenantData({
        ...tenantData,
        users: tenantData.users.filter(u => u.id !== userId),
      });
    }
  };

  const addSupportTicket = (newTicket: Omit<SupportTicket, 'id' | 'tenantId' | 'userId' | 'status' | 'createdAt'>) => {
    if (tenantData && currentUser && currentTenant) {
      const fullTicket: SupportTicket = {
        ...newTicket,
        id: `ticket-${uuidv4()}`,
        tenantId: currentTenant.id,
        userId: currentUser.id,
        status: 'Aberto',
        createdAt: new Date().toISOString(),
      };
      setTenantData({ ...tenantData, supportTickets: [...tenantData.supportTickets, fullTicket] });
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
        updateCase, 
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
        deleteFinancialTransaction,
        addRefund,
        updateRefund,
        deleteRefund,
        updateInvoice,
        addUser,
        updateUser,
        deleteUser,
        addSupportTicket,
        allAuditLogs,
        allUsers,
        allTenants,
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
