"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TeamMemberForm from '@/components/team/team-member-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function TeamPage() {
    const { tenantData, currentUser, addUser, updateUser, deleteUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleOpenModal = (user: User | null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (userData: User | Omit<User, 'id' | 'tenantId' | 'avatarUrl' | 'password'>) => {
        if ('id' in userData) {
            updateUser(userData);
        } else {
            addUser(userData);
        }
        handleCloseModal();
    };

    const handleDeleteUser = (userId: string) => {
        if (userId === currentUser?.id) {
            alert("Você não pode excluir a si mesmo.");
            return;
        }
        deleteUser(userId);
    };

    if (currentUser?.role !== 'Master') {
        return (
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Acesso Negado</h1>
                    <p className="text-muted-foreground">Você não tem permissão para gerenciar a equipe.</p>
                </div>
            </div>
        );
    }
    
    if (!tenantData) return <div>Carregando...</div>;

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Gerenciamento de Equipe</h1>
                <p className="text-muted-foreground">Adicione, edite e remova membros da sua equipe.</p>
            </div>
            
            <div className="flex justify-end">
                <Button onClick={() => handleOpenModal(null)}>
                    <Plus className="mr-2 h-4 w-4" /> Novo Membro
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tenantData.users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={user.id === currentUser.id}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação removerá o usuário permanentemente do sistema.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Excluir</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isModalOpen && (
                <TeamMemberForm 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    user={selectedUser}
                />
            )}
        </div>
    );
}