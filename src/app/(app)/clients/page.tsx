"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import type { Client } from '@/lib/types';
import ClientCard from '@/components/clients/client-card';
import ClientForm from '@/components/clients/client-form';

export default function ClientsPage() {
  const { tenantData, currentUser, addClient, updateClient, deleteClient } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    if (!tenantData?.clients) return [];
    if (!searchTerm) return tenantData.clients;

    const lowercasedFilter = searchTerm.toLowerCase();
    return tenantData.clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowercasedFilter) ||
        (client.document && client.document.toLowerCase().includes(lowercasedFilter))
    );
  }, [tenantData?.clients, searchTerm]);
  
  const getClientCounts = (clientId: string) => {
    const appointments = tenantData?.appointments.filter(a => a.clientId === clientId).length || 0;
    const deadlines = tenantData?.deadlines.filter(d => d.clientId === clientId).length || 0;
    return { appointments, deadlines };
  }

  const handleOpenModal = (client?: Client) => {
    setSelectedClient(client || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'tenantId' | 'caseIds'> | Client) => {
    if ('id' in clientData) {
      updateClient(clientData);
    } else {
      addClient(clientData);
    }
    handleCloseModal();
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Todos os dados associados (processos, prazos, etc.) serão perdidos.')) {
        deleteClient(clientId);
    }
  };

  if (!tenantData || !currentUser) {
    return <div>Carregando...</div>;
  }
  
  const canDelete = currentUser.role === 'Master' || currentUser.role === 'Advogado';

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua carteira de clientes.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
                type="search"
                placeholder="Buscar por nome ou documento..."
                className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
           </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      </header>

      <div className="flex-1 mt-6">
        {filteredClients.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClients.map((client) => (
                    <ClientCard 
                        key={client.id}
                        client={client}
                        counts={getClientCounts(client.id)}
                        onEdit={() => handleOpenModal(client)}
                        onDelete={handleDeleteClient}
                        canDelete={canDelete}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-center h-full rounded-lg border border-dashed py-12">
                <p className="text-lg font-semibold text-muted-foreground">Nenhum cliente encontrado</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {searchTerm ? 'Tente ajustar sua busca ou ' : 'Comece adicionando um novo cliente para visualizá-lo aqui.'}
                    {!searchTerm && <Button variant="link" className="p-0 h-auto" onClick={() => handleOpenModal()}>adicionar um novo cliente</Button>}
                </p>
            </div>
        )}
      </div>
      
      {isModalOpen && (
        <ClientForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveClient}
          client={selectedClient}
        />
      )}
    </div>
  );
}
