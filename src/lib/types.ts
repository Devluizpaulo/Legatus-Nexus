export type Tenant = {
  id: string;
  name: string;
  primaryColor: string;
  users: User[];
  clients: Client[];
  cases: Case[];
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
