// app/orders/orders-list.tsx
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
import { Badge } from '@/components/ui/badge'
import { EditIcon, EyeIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useDeleteOrder } from '@/hooks/use-orders'
import { Order, StrapiData } from '@/types/api'
import { normalizeData, getRelation } from '@/utils/strapi'
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
import { useRouter } from 'next/navigation'

// Типы статусов заказа
type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

// Функция для получения статуса заказа на русском
function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return 'В ожидании'
    case 'in-progress':
      return 'В работе'
    case 'completed':
      return 'Выполнен'
    case 'cancelled':
      return 'Отменен'
    default:
      return status
  }
}

// Функция для получения цвета бейджа в зависимости от статуса заказа
function getOrderStatusBadgeColor(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    default:
      return ''
  }
}

interface OrdersListProps {
  orders: StrapiData<Order>[]
  status?: OrderStatus
}

export function OrdersList({ orders, status }: OrdersListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const deleteOrder = useDeleteOrder()

  // Фильтрация заказов по статусу, если указан
  const filteredOrders = status
    ? orders.filter(order => {
        const normalizedOrder = normalizeData(order)
        return normalizedOrder.status === status
      })
    : orders

  const handleDelete = async () => {
    if (deleteId) {
      await deleteOrder.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/orders/edit/${id}`)
  }

  const handleView = (id: number) => {
    router.push(`/orders/view/${id}`)
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№ заказа</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Дата доставки</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(item => {
              const order = normalizeData(item)
              const client = order.client ? getRelation(order.client) : null

              return (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>
                    #{order.orderNumber}
                  </TableCell>
                  <TableCell>{client?.name || 'Клиент не указан'}</TableCell>
                  <TableCell>₽{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(order.deliveryDate).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={getOrderStatusBadgeColor(
                        order.status as OrderStatus
                      )}
                    >
                      {getOrderStatusLabel(order.status as OrderStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleView(order.id)}
                      >
                        <EyeIcon className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(order.id)}
                      >
                        <EditIcon className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setDeleteId(order.id)}
                      >
                        <TrashIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}

            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-8 text-muted-foreground'
                >
                  Заказы не найдены
                </TableCell>
              </TableRow>
            )}
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
              Это действие нельзя отменить. Заказ будет удален из системы.
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
