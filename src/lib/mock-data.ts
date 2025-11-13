import { Tenant, User, Client, Case, CaseStatus, UserRole } from "./types";
import { PlaceHolderImages } from "./placeholder-images";

const users: User[] = [
  { id: "user-1", tenantId: "tenant-1", name: "Artur Morgan", email: "artur.morgan@example.com", password: "password", role: "Master", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '' },
  { id: "user-2", tenantId: "tenant-1", name: "Joana Marston", email: "joana.marston@example.com", password: "password", role: "Advogado", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl || '' },
  { id: "user-3", tenantId: "tenant-1", name: "Sônia Bell", email: "sonia.bell@example.com", password: "password", role: "Financeiro", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl || '' },
  { id: "user-4", tenantId: "tenant-2", name: "Micaías Bell", email: "micaias.bell@example.com", password: "password", role: "Master", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar4')?.imageUrl || '' },
  { id: "user-super", tenantId: "platform", name: "Super Admin", email: "super@legatus.com", password: "password", role: "SuperAdmin", avatarUrl: "" },
];

const clients: Client[] = [
  { id: "client-1", tenantId: "tenant-1", name: "Indústrias Stark", email: "contato@stark.com", phone: "11 98765-4321", caseIds: ["case-1", "case-2"] },
  { id: "client-2", tenantId: "tenant-1", name: "Wayne Enterprises", email: "financeiro@wayne.com", phone: "21 91234-5678", caseIds: ["case-3"] },
];

const cases: Case[] = [
  { id: "case-1", tenantId: "tenant-1", title: "Defesa em Litígio Contratual", clientId: "client-1", status: "Análise Inicial", responsible: ["user-1", "user-2"], deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-2", tenantId: "tenant-1", title: "Consultoria Tributária", clientId: "client-1", status: "Fase de Instrução", responsible: ["user-2"], deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-3", tenantId: "tenant-1", title: "Ação de Propriedade Intelectual", clientId: "client-2", status: "Recursos", responsible: ["user-1"] },
  { id: "case-4", tenantId: "tenant-1", title: "Análise de Contrato Social", clientId: "client-2", status: "Finalizado", responsible: ["user-3"] }
];

const tenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "Morgan, Marston & Bell Advocacia",
    primaryColor: "#1A237E",
    users: users.filter(u => u.tenantId === "tenant-1"),
    clients: clients.filter(c => c.tenantId === "tenant-1"),
    cases: cases.filter(c => c.tenantId === "tenant-1"),
  },
  {
    id: "tenant-2",
    name: "Bell & Associados",
    primaryColor: "#004D40",
    users: users.filter(u => u.tenantId === "tenant-2"),
    clients: [],
    cases: [],
  },
];

export const MOCK_USERS: User[] = users;
export const MOCK_TENANTS: Tenant[] = tenants;
export const MOCK_CLIENTS: Client[] = clients;
export const MOCK_CASES: Case[] = cases;

export const ALL_CASE_STATUSES: CaseStatus[] = ["Análise Inicial", "Fase de Instrução", "Recursos", "Finalizado"];
