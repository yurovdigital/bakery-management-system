'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditIcon, PhoneIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDeleteClient } from '@/hooks/use-clients'
import { EmptyState } from '@/components/empty-state'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Client } from '@/types/api'

interface ClientsListProps {
  clients: (Client & { id: number })[]
  isLoading: boolean
}

export function ClientsList({ clients, isLoading }: ClientsListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const deleteClient = useDeleteClient()

  const handleDelete = async () => {
    if (deleteId) {
      await deleteClient.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/clients/edit/${id}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Проверка на пустой массив клиентов
  if (!clients || clients.length === 0) {
    return (
      <EmptyState
        title='Клиенты не найдены'
        description='Добавьте клиентов, чтобы они появились здесь'
        createLink='/clients/new'
        createLabel='Добавить клиента'
      />
    )
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead>Заказов</TableHead>
              <TableHead>Сумма заказов</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map(client => (
              <TableRow key={client.id}>
                <TableCell className='font-medium'>
                  {client.name || 'Без имени'}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <div className='flex items-center'>
                      <PhoneIcon className='h-3 w-3 mr-1' />
                      {client.phone || 'Нет телефона'}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {client.email || 'Нет email'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.orders || 0}</TableCell>
                <TableCell>
                  ₽{(client.totalSpent || 0).toLocaleString()}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(client.id)}
                    >
                      <EditIcon className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setDeleteId(client.id)}
                    >
                      <TrashIcon className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Клиент будет удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
