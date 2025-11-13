"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, UserRole, EDITABLE_ROLES } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const memberSchema = z.object({
  name: z.string().min(3, { message: "O nome é obrigatório." }),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  role: z.enum(EDITABLE_ROLES as [UserRole, ...UserRole[]], {
    required_error: "O cargo é obrigatório.",
  }),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface TeamMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  user: User | null;
}

export default function TeamMemberForm({ isOpen, onClose, onSave, user }: TeamMemberFormProps) {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
    } : {
      name: '',
      email: '',
      role: 'Advogado',
    },
  });

  const onSubmit = (data: MemberFormData) => {
    if (user?.id) {
      onSave({ ...user, ...data });
    } else {
      onSave(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Membro' : 'Novo Membro da Equipe'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do membro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@dominio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EDITABLE_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
