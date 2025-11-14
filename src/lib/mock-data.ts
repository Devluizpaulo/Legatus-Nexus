
import { Tenant, User, Client, Case, CaseStatus, UserRole, Appointment, Deadline, TimeEntry, FinancialTransaction, Refund, RefundStatus, Invoice, InvoiceStatus, TimeEntryStatus, TransactionStatus, TransactionType, AppointmentStatus, AppointmentType, Subscription, Plan, BillingHistory, SubscriptionStatus, BillingStatus, AuditLog, AuditEventType, FaqItem, SupportTicket, SupportTicketStatus, Achievement, LegalArea } from "./types";
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
  { id: "case-0", tenantId: "tenant-1", title: "Análise de Viabilidade - Nova Ação", caseNumber: 'PROSP-001', clientId: "client-1", status: "Novo Lead", area: "Empresarial", responsible: ["user-1"], deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-1", tenantId: "tenant-1", title: "Defesa em Litígio Contratual", caseNumber: '0012345-67.2023.8.26.0100', comarca: 'São Paulo', vara: '10ª Vara Cível', clientId: "client-1", status: "Análise Inicial", area: "Cível", responsible: ["user-1", "user-2"], deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-2", tenantId: "tenant-1", title: "Consultoria Tributária", caseNumber: '0098765-43.2023.8.26.0001', comarca: 'São Paulo', vara: '2ª Vara de Execuções Fiscais', clientId: "client-1", status: "Fase de Instrução", area: "Tributário", responsible: ["user-2"], deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-3", tenantId: "tenant-1", title: "Ação de Propriedade Intelectual", caseNumber: '0054321-98.2022.8.26.0500', comarca: 'Rio de Janeiro', vara: '5ª Vara Empresarial', clientId: "client-2", status: "Recursos", area: "Empresarial", responsible: ["user-1"] },
  { id: "case-4", tenantId: "tenant-1", title: "Análise de Contrato Social", caseNumber: '0011223-34.2021.8.26.0100', comarca: 'São Paulo', vara: '1ª Vara Empresarial e de Conflitos de Arbitragem', clientId: "client-2", status: "Finalizado", area: "Empresarial", responsible: ["user-3"] },
  { id: "case-5", tenantId: "tenant-1", title: "Agravo de Instrumento - Stark", caseNumber: '0033445-56.2023.8.26.0100', comarca: 'São Paulo', vara: '10ª Vara Cível', clientId: 'client-1', status: 'Análise Inicial', area: "Cível", responsible: ['user-1'], deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "case-6", tenantId: "tenant-1", title: "Acordo Extrajudicial - Wayne", caseNumber: 'NEG-002', clientId: 'client-2', status: 'Contrato Assinado', area: "Cível", responsible: ['user-2'] },
  { id: "case-7", tenantId: "tenant-1", title: "Inicial - Danos Morais", caseNumber: 'PEND-003', clientId: 'client-1', status: 'Em Análise Jurídica', area: "Cível", responsible: ['user-2'] },
];

const today = new Date();
const appointments: Appointment[] = [
  { id: 'apt-1', tenantId: 'tenant-1', title: 'Reunião de alinhamento', description: 'Discutir próximos passos do caso Stark.', date: format(today, 'yyyy-MM-dd'), time: '10:00', type: 'Reunião', status: 'Agendado', location: 'Sala de Reuniões 1', responsible: ['user-1', 'user-2'], clientId: 'client-1' },
  { id: 'apt-2', tenantId: 'tenant-1', title: 'Audiência - Propriedade Intelectual', description: 'Apresentação de provas.', date: format(addDays(today, 2), 'yyyy-MM-dd'), time: '14:30', type: 'Audiência', status: 'Confirmado', location: 'Fórum Central, Sala 201', responsible: ['user-1'], clientId: 'client-2' },
  { id: 'apt-3', tenantId: 'tenant-1', title: 'Atendimento Sr. Wayne', description: 'Chamada para atualização semanal.', date: format(today, 'yyyy-MM-dd'), time: '16:00', type: 'Atendimento', status: 'Agendado', location: 'Google Meet', responsible: ['user-2'], clientId: 'client-2' },
];

const deadlines: Deadline[] = [
    { id: 'dl-1', tenantId: 'tenant-1', title: 'Contestação', caseNumber: '0012345-67.2023.8.26.0100', dueDate: format(addDays(today, 2), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-2', clientId: 'client-1', checklist: [{id: 't1', text: 'Analisar petição inicial', completed: true}, {id: 't2', text: 'Coletar documentos', completed: false}] },
    { id: 'dl-2', tenantId: 'tenant-1', title: 'Recurso de Apelação', caseNumber: '0054321-98.2022.8.26.0500', dueDate: format(addDays(today, 4), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-1', clientId: 'client-2', checklist: [] },
    { id: 'dl-3', tenantId: 'tenant-1', title: 'Pagamento de Guia', caseNumber: '0098765-43.2023.8.26.0001', dueDate: format(addDays(today, 15), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-3', clientId: 'client-1', checklist: [{id: 't3', text: 'Emitir guia', completed: true}, {id: 't4', text: 'Realizar pagamento', completed: true}] },
    { id: 'dl-4', tenantId: 'tenant-1', title: 'Entrega de Memorial', caseNumber: '0011223-34.2021.8.26.0100', dueDate: format(subDays(today, 5), 'yyyy-MM-dd'), status: 'Cumprido', responsibleId: 'user-2', clientId: 'client-1', checklist: [{id: 't5', text: 'Finalizar redação', completed: true}, {id: 't6', text: 'Protocolar', completed: true}] },
    { id: 'dl-5', tenantId: 'tenant-1', title: 'Agravo de Instrumento', caseNumber: '0033445-56.2023.8.26.0100', dueDate: format(addDays(today, 1), 'yyyy-MM-dd'), status: 'Pendente', responsibleId: 'user-1', clientId: 'client-2', checklist: [{id: 't7', text: 'Analisar decisão', completed: true}, {id: 't8', text: 'Minutar peça', completed: false}] },
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

const invoices: Invoice[] = [
    { 
        id: 'inv-001', 
        tenantId: 'tenant-1', 
        clientId: 'client-1', 
        caseId: 'case-1', 
        issueDate: format(subDays(today, 10), 'yyyy-MM-dd'), 
        dueDate: format(addDays(subDays(today, 10), 30), 'yyyy-MM-dd'), 
        status: 'Pendente',
        items: [
            { id: 'item-1', description: 'Horas de consultoria - Análise Contratual', quantity: 10, unitPrice: 350, total: 3500 },
            { id: 'item-2', description: 'Reembolso de despesa - Táxi Fórum', quantity: 1, unitPrice: 45.50, total: 45.50 }
        ],
        totalAmount: 3545.50,
    },
    { 
        id: 'inv-002', 
        tenantId: 'tenant-1', 
        clientId: 'client-2', 
        caseId: 'case-3', 
        issueDate: format(subDays(today, 45), 'yyyy-MM-dd'), 
        dueDate: format(subDays(today, 15), 'yyyy-MM-dd'), 
        status: 'Pendente',
        items: [
            { id: 'item-3', description: 'Elaboração de parecer - Propriedade Intelectual', quantity: 1, unitPrice: 5000, total: 5000 },
        ],
        totalAmount: 5000,
    },
    { 
        id: 'inv-003', 
        tenantId: 'tenant-1', 
        clientId: 'client-1', 
        caseId: 'case-2', 
        issueDate: format(subDays(today, 60), 'yyyy-MM-dd'), 
        dueDate: format(subDays(today, 30), 'yyyy-MM-dd'), 
        paidDate: format(subDays(today, 25), 'yyyy-MM-dd'),
        status: 'Paga',
        items: [
            { id: 'item-4', description: 'Consultoria Tributária - Reunião Inicial', quantity: 3, unitPrice: 400, total: 1200 },
        ],
        totalAmount: 1200,
    }
];

const plans: Plan[] = [
    { id: 'plan-1', name: 'Solo', price: 129 },
    { id: 'plan-2', name: 'Profissional', price: 399 },
    { id: 'plan-3', name: 'Enterprise', price: 999 },
];

const subscriptions: Subscription[] = [
    { id: 'sub-1', tenantId: 'tenant-1', planId: 'plan-2', status: 'Ativa' },
    { id: 'sub-2', tenantId: 'tenant-2', planId: 'plan-1', status: 'Ativa' },
];

const billingHistory: BillingHistory[] = [
    { id: 'bill-1', tenantId: 'tenant-1', dueDate: format(subDays(today, 30), 'yyyy-MM-dd'), amount: 399, paymentDate: format(subDays(today, 28), 'yyyy-MM-dd'), status: 'Pago' },
    { id: 'bill-2', tenantId: 'tenant-1', dueDate: format(today, 'yyyy-MM-dd'), amount: 399, status: 'Pendente' },
    { id: 'bill-3', tenantId: 'tenant-1', dueDate: format(addDays(today, 30), 'yyyy-MM-dd'), amount: 399, status: 'Pendente' },
];

const auditLogs: AuditLog[] = [
  { id: 'log-1', tenantId: 'tenant-1', userId: 'user-1', eventType: 'USER_LOGIN', timestamp: subDays(today, 1).toISOString(), details: 'Usuário Artur Morgan fez login.' },
  { id: 'log-2', tenantId: 'tenant-1', userId: 'user-2', eventType: 'CLIENT_CREATED', timestamp: subDays(today, 2).toISOString(), details: 'Cliente "Nova Empresa Global" foi criado por Joana Marston.' },
  { id: 'log-3', tenantId: 'tenant-1', userId: 'user-1', eventType: 'CASE_STATUS_UPDATED', timestamp: subDays(today, 1).toISOString(), details: 'Status do processo "Defesa em Litígio Contratual" alterado para "Fase de Instrução".' },
  { id: 'log-4', tenantId: 'tenant-1', userId: 'user-3', eventType: 'INVOICE_PAID', timestamp: today.toISOString(), details: 'Fatura "inv-003" marcada como paga por Sônia Bell.' },
  { id: 'log-5', tenantId: 'tenant-2', userId: 'user-4', eventType: 'USER_LOGIN', timestamp: today.toISOString(), details: 'Usuário Micaías Bell fez login.' },
  { id: 'log-6', tenantId: 'tenant-1', userId: 'user-2', eventType: 'DEADLINE_COMPLETED', timestamp: subDays(today, 5).toISOString(), details: 'Prazo "Entrega de Memorial" foi marcado como cumprido.' },
];

const faqs: FaqItem[] = [
  { id: 'faq-1', question: 'Como eu altero minha senha?', answer: 'Para alterar sua senha, vá para a seção "Configurações" no menu do usuário, clique em "Segurança" e siga as instruções para definir uma nova senha.' },
  { id: 'faq-2', question: 'Posso exportar os dados de um processo?', answer: 'Sim. Na página de detalhes do processo, você encontrará um botão "Exportar" que permite gerar um PDF com todas as informações e o histórico do caso.' },
  { id: 'faq-3', question: 'Como funciona o faturamento de horas?', answer: 'Todas as horas lançadas com status "Pendente" podem ser selecionadas ao gerar uma nova fatura para um cliente. Uma vez que a fatura é emitida, o status das horas é atualizado para "Faturado".' },
  { id: 'faq-4', question: 'O que acontece se um prazo for perdido?', answer: 'O sistema não impede o vencimento de um prazo, mas o destaca visualmente em vermelho e envia notificações aos responsáveis para alertar sobre o risco. A responsabilidade final é sempre do usuário.' },
];

const supportTickets: SupportTicket[] = [
  { id: 'ticket-1', tenantId: 'tenant-1', userId: 'user-2', subject: 'Dificuldade em gerar relatório financeiro', description: 'Não estou conseguindo encontrar a opção para gerar o relatório de faturamento mensal. Onde fica?', status: 'Fechado', createdAt: subDays(today, 10).toISOString() },
  { id: 'ticket-2', tenantId: 'tenant-1', userId: 'user-1', subject: 'Sugestão: Integração com calendário Google', description: 'Seria muito útil se a agenda do Legatus Nexus pudesse ser sincronizada com o Google Calendar. Fica a sugestão para futuras atualizações.', status: 'Em Andamento', createdAt: subDays(today, 2).toISOString() },
];

const achievements: Achievement[] = [
    { id: 'ach-1', userId: 'user-2', title: 'Mestre dos Prazos', description: 'Cumpriu 10 prazos seguidos antes do vencimento.', date: format(subDays(today, 3), 'yyyy-MM-dd'), icon: 'Award' },
    { id: 'ach-2', userId: 'user-2', title: 'Advogado(a) do Mês', description: 'Maior número de horas faturadas no mês.', date: format(subDays(today, 15), 'yyyy-MM-dd'), icon: 'Trophy' },
    { id: 'ach-3', userId: 'user-2', title: 'Iniciante Produtivo', description: 'Completou suas 10 primeiras tarefas.', date: format(subDays(today, 20), 'yyyy-MM-dd'), icon: 'Rocket' },
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
    invoices: invoices.filter(i => i.tenantId === 'tenant-1'),
    subscription: subscriptions.find(s => s.tenantId === 'tenant-1')!,
    plan: plans.find(p => p.id === subscriptions.find(s => s.tenantId === 'tenant-1')?.planId)!,
    billingHistory: billingHistory.filter(b => b.tenantId === 'tenant-1'),
    auditLogs: auditLogs.filter(log => log.tenantId === 'tenant-1'),
    faqs: faqs,
    supportTickets: supportTickets.filter(st => st.tenantId === 'tenant-1'),
    achievements: achievements.filter(ach => users.find(u => u.id === ach.userId && u.tenantId === 'tenant-1')),
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
    invoices: [],
    subscription: subscriptions.find(s => s.tenantId === 'tenant-2')!,
    plan: plans.find(p => p.id === subscriptions.find(s => s.tenantId === 'tenant-2')?.planId)!,
    billingHistory: billingHistory.filter(b => b.tenantId === 'tenant-2'),
    auditLogs: auditLogs.filter(log => log.tenantId === 'tenant-2'),
    faqs: faqs,
    supportTickets: [],
    achievements: [],
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
export const MOCK_INVOICES: Invoice[] = invoices;
export const MOCK_SUBSCRIPTIONS: Subscription[] = subscriptions;
export const MOCK_PLANS: Plan[] = plans;
export const MOCK_BILLING_HISTORY: BillingHistory[] = billingHistory;
export const MOCK_AUDIT_LOGS: AuditLog[] = auditLogs;
export const MOCK_FAQS: FaqItem[] = faqs;
export const MOCK_SUPPORT_TICKETS: SupportTicket[] = supportTickets;
export const MOCK_ACHIEVEMENTS: Achievement[] = achievements;

export const ALL_CASE_STATUSES: CaseStatus[] = [
    // Prospecção
    "Novo Lead",
    "Em Atendimento",
    "Em Análise Jurídica",
    "Aguardando Documentos",
    "Proposta Enviada",
    "Contrato Assinado",
    "Acordo Extrajudicial",
    "Preparando Inicial",
    // Jurídico
    "Análise Inicial", 
    "Distribuição",
    "Fase de Instrução", 
    "Recursos", 
    "Finalizado"
];
export const ALL_LEGAL_AREAS: LegalArea[] = ["Cível", "Trabalhista", "Tributário", "Família e Sucessões", "Empresarial"];
export const ALL_APPOINTMENT_TYPES: AppointmentType[] = ['Atendimento', 'Reunião', 'Audiência'];
export const ALL_APPOINTED_STATUSES: AppointmentStatus[] = ['Agendado', 'Confirmado', 'Cancelado', 'Realizado'];
export const ALL_DEADLINE_STATUSES: DeadlineStatus[] = ['Pendente', 'Cumprido'];
export const ALL_TIME_ENTRY_STATUSES: TimeEntryStatus[] = ['Pendente', 'Faturado'];
export const ALL_TRANSACTION_TYPES: TransactionType[] = ['Ganho', 'Despesa'];
export const ALL_TRANSACTION_STATUSES: TransactionStatus[] = ['Pendente', 'Aprovada', 'Liquidada', 'Reprovada'];
export const ALL_REFUND_STATUSES: RefundStatus[] = ['Pendente', 'Aprovado', 'Reprovado', 'Pago'];
export const ALL_INVOICE_STATUSES: InvoiceStatus[] = ['Pendente', 'Paga'];
export const ALL_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['Ativa', 'Inativa', 'Pendente'];
export const ALL_BILLING_STATUSES: BillingStatus[] = ['Pago', 'Pendente', 'Atrasado'];
export const ALL_AUDIT_EVENT_TYPES: AuditEventType[] = ['USER_LOGIN', 'CLIENT_CREATED', 'CASE_STATUS_UPDATED', 'DEADLINE_COMPLETED', 'INVOICE_PAID', 'USER_DELETED'];
export const ALL_SUPPORT_TICKET_STATUSES: SupportTicketStatus[] = ['Aberto', 'Em Andamento', 'Fechado'];
