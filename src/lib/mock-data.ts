import { Tenant, User, Client, Case, CaseStatus, UserRole, Appointment, Deadline, TimeEntry, FinancialTransaction, Refund, RefundStatus } from "./types";
import { PlaceHolderImages } from "./placeholder-images";
import { format, addDays, subDays } from 'date-fns';

const users: User[] = [
  { id: "user-1", tenantId: "tenant-1", name: "Artur Morgan", email: "artur.morgan@example.com", password: "password", role: "Master", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '' },
  { id: "user-2", tenantId: "tenant-1", name: "Joana Marston", email: "joana.marston@example.com", password: "password", role: "Advogado", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl || '' },
  { id: "user-3", tenantId: "tenant-1", name: "Sônia Bell", email: "sonia.bell@example.com", password: "password", role: "Financeiro", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl || '' },
  { id: "user-4", tenantId: "tenant-2", name: "Micaías Bell", email: "micaias.bell@example.com", password: "password", role: "Master", avatarUrl: PlaceHolderImages.find(p => p.id === 'avatar4')?.imageUrl || '' },
  { id: "user-super", tenantId: "platform", name: "Super Admin", email: "super@legatus.com", password: "password", role: "SuperAdmin", avatarUrl: "" },
];

const clients: Client[] = [
  { id: "client-1", tenantId: "tenant-1", name: "Indústrias Stark", document: "12.345.678/0001-99", email: "contato@stark.com", phone: "11 98765-4321", caseIds: ["case-1", "case-2"], notes: "Cliente prioritário. Contato principal: Pepper Potts." },
  { id: "client-2", tenantId: "tenant-1", name: "Wayne Enterprises", document: "98.765.432/0001-11", email: "financeiro@wayne.com", phone: "21 91234-5678", caseIds: ["case-3"] },
];

const cases: Case[] = [
  { id: "case-1", tenantId: "tenant-1", title: "Defesa em Litígio Contratual", clientId: "client-1", status: "Análise Inicial", responsible: ["user-1", "user-2"], deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-2", tenantId: "tenant-1", title: "Consultoria Tributária", clientId: "client-1", status: "Fase de Instrução", responsible: ["user-2"], deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-3", tenantId: "tenant-1", title: "Ação de Propriedade Intelectual", clientId: "client-2", status: "Recursos", responsible: ["user-1"] },
  { id: "case-4", tenantId: "tenant-1", title: "Análise de Contrato Social", clientId: "client-2", status: "Finalizado", responsible: ["user-3"] }
];

const today = new Date();
const appointments: Appointment[] = [
  { id: 'apt-1', tenantId: 'tenant-1', title: 'Reunião de alinhamento', description: 'Discutir próximos passos do caso Stark.', date: format(today, 'yyyy-MM-dd'), time: '10:00', type: 'Reunião', status: 'Agendado', location: 'Sala de Reuniões 1', responsible: ['user-1', 'user-2'], clientId: 'client-1' },
  { id: 'apt-2', tenantId: 'tenant-1', title: 'Audiência - Propriedade Intelectual', description: 'Apresentação de provas.', date: format(addDays(today, 2), 'yyyy-MM-dd'), time: '14:30', type: 'Audiência', status: 'Confirmado', location: 'Fórum Central, Sala 201', responsible: ['user-1'], clientId: 'client-2' },
  { id: 'apt-3', tenantId: 'tenant-1', title: 'Atendimento Sr. Wayne', description: 'Chamada para atualização semanal.', date: format(today, 'yyyy-MM-dd'), time: '16:00', type: 'Atendimento', status: 'Agendado', location: 'Google Meet', responsible: ['user-2'], clientId: 'client-2' },
];

const deadlines: Deadline[] = [
    { id: 'dl-1', tenantId: 'tenant-1', title: 'Contestação', caseNumber: '0012345-67.2023.8.26.0100', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-2', clientId: 'client-1', checklist: [{id: 't1', text: 'Analisar petição inicial', completed: true}, {id: 't2', text: 'Coletar documentos', completed: false}] },
    { id: 'dl-2', tenantId: 'tenant-1', title: 'Recurso de Apelação', caseNumber: '0054321-98.2022.8.26.0500', dueDate: format(addDays(today, 6), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-1', clientId: 'client-2', checklist: [] },
    { id: 'dl-3', tenantId: 'tenant-1', title: 'Pagamento de Guia', caseNumber: '0098765-43.2023.8.26.0001', dueDate: format(addDays(today, 15), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-3', clientId: 'client-1', checklist: [{id: 't3', text: 'Emitir guia', completed: true}, {id: 't4', text: 'Realizar pagamento', completed: true}] },
    { id: 'dl-4', tenantId: 'tenant-1', title: 'Entrega de Memorial', caseNumber: '0011223-34.2021.8.26.0100', dueDate: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'Cumprido', responsibleId: 'user-2', clientId: 'client-1', checklist: [{id: 't5', text: 'Finalizar redação', completed: true}, {id: 't6', text: 'Protocolar', completed: true}] },
    { id: 'dl-5', tenantId: 'tenant-1', title: 'Agravo de Instrumento', caseNumber: '0033445-56.2023.8.26.0100', dueDate: format(subDays(today, 1), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-1', clientId: 'client-2', checklist: [{id: 't7', text: 'Analisar decisão', completed: true}, {id: 't8', text: 'Minutar peça', completed: false}] },
];

const timeEntries: TimeEntry[] = [
    { id: 'te-1', tenantId: 'tenant-1', userId: 'user-2', clientId: 'client-1', caseId: 'case-1', date: format(subDays(today, 2), 'yyyy-MM-dd'), hours: 2.5, description: 'Análise da petição inicial e documentos.', status: 'Pendente' },
    { id: 'te-2', tenantId: 'tenant-1', userId: 'user-1', clientId: 'client-2', caseId: 'case-3', date: format(subDays(today, 1), 'yyyy-MM-dd'), hours: 4, description: 'Elaboração de parecer sobre propriedade intelectual.', status: 'Pendente' },
    { id: 'te-3', tenantId: 'tenant-1', userId: 'user-2', clientId: 'client-1', caseId: 'case-2', date: format(subDays(today, 3), 'yyyy-MM-dd'), hours: 3, description: 'Reunião com cliente sobre estratégia tributária.', status: 'Faturado', invoiceId: 'inv-123' },
];

const financialTransactions: FinancialTransaction[] = [
    { id: 'ft-1', tenantId: 'tenant-1', type: 'Ganho', description: 'Honorários Iniciais - Indústrias Stark', amount: 15000, date: format(subDays(today, 10), 'yyyy-MM-dd'), userId: 'user-3', status: 'Liquidada' },
    { id: 'ft-2', tenantId: 'tenant-1', type: 'Despesa', description: 'Compra de software de gestão de documentos', amount: 1200, date: format(subDays(today, 5), 'yyyy-MM-dd'), userId: 'user-1', status: 'Aprovada', approverId: 'user-1' },
    { id: 'ft-3', tenantId: 'tenant-1', type: 'Despesa', description: 'Taxas de protocolo - Processo Wayne', amount: 250.75, date: format(subDays(today, 1), 'yyyy-MM-dd'), userId: 'user-2', status: 'Pendente' },
    { id: 'ft-4', tenantId: 'tenant-1', type: 'Ganho', description: 'Honorários de Êxito - Caso Finalizado', amount: 25000, date: format(subDays(today, 20), 'yyyy-MM-dd'), userId: 'user-3', status: 'Liquidada' },
    { id: 'ft-5', tenantId: 'tenant-1', type: 'Despesa', description: 'Almoço com cliente', amount: 180.50, date: format(subDays(today, 1), 'yyyy-MM-dd'), userId: 'user-2', status: 'Reprovada', approverId: 'user-1', notes: 'Política não cobre despesas de alimentação.' },
];

const refunds: Refund[] = [
    { id: 'ref-1', tenantId: 'tenant-1', userId: 'user-2', description: 'Táxi para o fórum', amount: 45.50, date: format(subDays(today, 2), 'yyyy-MM-dd'), status: 'Pendente', clientId: 'client-1', caseId: 'case-1' },
    { id: 'ref-2', tenantId: 'tenant-1', userId: 'user-1', description: 'Cópia de processo', amount: 120.00, date: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'Aprovado', approverId: 'user-1', clientId: 'client-2', caseId: 'case-3' },
    { id: 'ref-3', tenantId: 'tenant-1', userId: 'user-2', description: 'Estacionamento audiência', amount: 30.00, date: format(subDays(today, 7), 'yyyy-MM-dd'), status: 'Pago', approverId: 'user-3', clientId: 'client-1', caseId: 'case-2' },
    { id: 'ref-4', tenantId: 'tenant-1', userId: 'user-1', description: 'Jantar com cliente potencial', amount: 250.00, date: format(subDays(today, 3), 'yyyy-MM-dd'), status: 'Reprovado', approverId: 'user-1' },
];


const tenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "Morgan, Marston & Bell Advocacia",
    primaryColor: "#1A237E",
    users: users.filter(u => u.tenantId === "tenant-1"),
    clients: clients.filter(c => c.tenantId === "tenant-1"),
    cases: cases.filter(c => c.tenantId === "tenant-1"),
    appointments: appointments.filter(a => a.tenantId === "tenant-1"),
    deadlines: deadlines.filter(d => d.tenantId === 'tenant-1'),
    timeEntries: timeEntries.filter(te => te.tenantId === 'tenant-1'),
    financialTransactions: financialTransactions.filter(ft => ft.tenantId === 'tenant-1'),
    refunds: refunds.filter(r => r.tenantId === 'tenant-1'),
  },
  {
    id: "tenant-2",
    name: "Bell & Associados",
    primaryColor: "#004D40",
    users: users.filter(u => u.tenantId === "tenant-2"),
    clients: [],
    cases: [],
    appointments: [],
    deadlines: [],
    timeEntries: [],
    financialTransactions: [],
    refunds: [],
  },
];

export const MOCK_USERS: User[] = users;
export const MOCK_TENANTS: Tenant[] = tenants;
export const MOCK_CLIENTS: Client[] = clients;
export const MOCK_CASES: Case[] = cases;
export const MOCK_APPOINTMENTS: Appointment[] = appointments;
export const MOCK_DEADLINES: Deadline[] = deadlines;
export const MOCK_TIME_ENTRIES: TimeEntry[] = timeEntries;
export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = financialTransactions;
export const MOCK_REFUNDS: Refund[] = refunds;

export const ALL_CASE_STATUSES: CaseStatus[] = ["Análise Inicial", "Fase de Instrução", "Recursos", "Finalizado"];
export const ALL_APPOINTMENT_TYPES: AppointmentType[] = ['Atendimento', 'Reunião', 'Audiência'];
export const ALL_APPOINTMENT_STATUSES: AppointmentStatus[] = ['Agendado', 'Confirmado', 'Cancelado', 'Realizado'];
export const ALL_DEADLINE_STATUSES: DeadlineStatus[] = ['Pendente', 'Cumprido'];
export const ALL_TIME_ENTRY_STATUSES: TimeEntryStatus[] = ['Pendente', 'Faturado'];
export const ALL_TRANSACTION_TYPES: TransactionType[] = ['Ganho', 'Despesa'];
export const ALL_TRANSACTION_STATUSES: TransactionStatus[] = ['Pendente', 'Aprovada', 'Liquidada', 'Reprovada'];
export const ALL_REFUND_STATUSES: RefundStatus[] = ['Pendente', 'Aprovado', 'Reprovado', 'Pago'];
