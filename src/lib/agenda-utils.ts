import { AppointmentType } from './types';

export const appointmentColors: Record<AppointmentType | 'Prazo', { background: string; border: string }> = {
    'Reunião': { background: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-500 dark:border-blue-400' },
    'Audiência': { background: 'bg-red-100 dark:bg-red-900/40', border: 'border-red-500 dark:border-red-400' },
    'Atendimento': { background: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-500 dark:border-green-400' },
    'Prazo': { background: 'bg-yellow-100 dark:bg-yellow-900/40', border: 'border-yellow-500 dark:border-yellow-400' },
};
