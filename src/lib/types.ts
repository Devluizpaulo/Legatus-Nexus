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

export type CaseStatus = "Análise Inicial" | "Fase de Instrução" | "Recursos" | "Finalizado";

export type Case = {
  id: string;
  tenantId:string;
  title: string;
  clientId: string;
  status: CaseStatus;
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
