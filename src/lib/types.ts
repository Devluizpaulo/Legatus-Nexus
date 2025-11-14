

export type Tenant = {
  id: string;
  name: string;
  primaryColor: string;
  users: User[];
  clients: Client[];
  cases: Case[];
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
};

export type UserRole = "Master" | "Advogado" | "Financeiro" | "SuperAdmin";

export type User = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client
  role: UserRole;
  avatarUrl: string;
};

export type Client = {
  id: string;
  tenantId: string;
  name: string;
  document?: string;
  email: string;
  phone: string;
  caseIds: string[];
  notes?: string;
};

export type CaseStatus = 
  // Fases de Prospecção
  | "Novo Lead"
  | "Em Atendimento"
  | "Em Análise Jurídica"
  | "Aguardando Documentos"
  | "Proposta Enviada"
  | "Contrato Assinado"
  | "Acordo Extrajudicial"
  | "Preparando Inicial"
  // Fases Jurídicas
  | "Análise Inicial"
  | "Distribuição";

export type LegalArea = "Cível" | "Trabalhista" | "Tributário" | "Família e Sucessões" | "Empresarial";

export type Case = {
  id: string;
  tenantId:string;
  title: string;
  caseNumber?: string;
  comarca?: string;
  vara?: string;
  clientId: string;
  status: CaseStatus;
  area: LegalArea;
  responsible: string[]; // User IDs
  deadline?: string; // ISO date string
};

export type AppointmentType = 'Atendimento' | 'Reunião' | 'Audiência';
export type AppointmentStatus = 'Agendado' | 'Confirmado' | 'Cancelado' | 'Realizado';

export type Appointment = {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  location?: string;
  responsible: string[]; // User IDs
  clientId: string;
};

export type DeadlineStatus = 'Pendente' | 'Cumprido';

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type Deadline = {
  id: string;
  tenantId: string;
  title: string;
  caseNumber: string;
  dueDate: string; // ISO date string
  status: DeadlineStatus;
  responsibleId: string;
  clientId: string;
  checklist: ChecklistItem[];
};

export type TimeEntryStatus = 'Pendente' | 'Faturado';

export type TimeEntry = {
  id: string;
  tenantId: string;
  userId: string;
  clientId: string;
  caseId: string;
  date: string; // ISO Date String
  hours: number;
  description: string;
  status: TimeEntryStatus;
  invoiceId?: string;
};

export type TransactionType = 'Ganho' | 'Despesa';
export type TransactionStatus = 'Pendente' | 'Aprovada' | 'Liquidada' | 'Reprovada';

export type FinancialTransaction = {
  id: string;
  tenantId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // ISO Date String
  userId: string; // User who registered
  status: TransactionStatus;
  approverId?: string; // User who approved/rejected
  notes?: string;
};

export type RefundStatus = 'Pendente' | 'Aprovado' | 'Reprovado' | 'Pago';

export type Refund = {
  id: string;
  tenantId: string;
  userId: string; // User who requested
  description: string;
  amount: number;
  date: string; // Date of the expense
  status: RefundStatus;
  attachmentUrl?: string; // URL to the receipt
  clientId?: string; // Optional: for billing the client
  caseId?: string; // Optional: for billing the client
  approverId?: string; // User who approved/rejected
};

export type InvoiceStatus = 'Pendente' | 'Paga'; // "Atrasada" is a computed status in the UI

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  tenantId: string;
  clientId: string;
  caseId: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  paidDate?: string; // ISO date string
  status: InvoiceStatus;
  items: InvoiceItem[];
  totalAmount: number;
};

export type SubscriptionStatus = 'Ativa' | 'Inativa' | 'Pendente';

export type Subscription = {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
};

export type BillingStatus = 'Pago' | 'Pendente' | 'Atrasado';

export type BillingHistory = {
  id: string;
  tenantId: string;
  dueDate: string; // ISO date string
  amount: number;
  paymentDate?: string; // ISO date string
  status: BillingStatus;
};

export const EDITABLE_ROLES: UserRole[] = ["Advogado", "Financeiro"];

export type AuditEventType = 'USER_LOGIN' | 'CLIENT_CREATED' | 'CASE_STATUS_UPDATED' | 'DEADLINE_COMPLETED' | 'INVOICE_PAID' | 'USER_DELETED';

export type AuditLog = {
  id: string;
  tenantId: string;
  userId: string;
  eventType: AuditEventType;
  timestamp: string; // ISO date string
  details: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type SupportTicketStatus = 'Aberto' | 'Em Andamento' | 'Fechado';

export type SupportTicket = {
  id: string;
  tenantId: string;
  userId: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  createdAt: string; // ISO date string
};

export type Achievement = {
    id: string;
    userId: string;
    title: string;
    description: string;
    date: string; // ISO date string
    icon: string; // Lucide icon name
};
