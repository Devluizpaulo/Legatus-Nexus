export type Tenant = {
  id: string;
  name: string;
  primaryColor: string;
  users: User[];
  clients: Client[];
  cases: Case[];
  appointments: Appointment[];
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
  email: string;
  phone: string;
  caseIds: string[];
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
