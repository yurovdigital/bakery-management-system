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
import { useRouter } from 'next/navigation'
import { useDeleteOrder } from '@/hooks/use-orders'
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
import type { Order } from '@/types/api'

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
  orders: (Order & { id: number })[]
  isLoading: boolean
  status?: OrderStatus
}

export function OrdersList({ orders, isLoading, status }: OrdersListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const deleteOrder = useDeleteOrder()

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
    router.push(`/orders/${id}`)
  }

  // Фильтрация заказов по статусу, если указан
  const filteredOrders = status
    ? orders.filter(order => order.status === status)
    : orders

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Проверка на пустой массив заказов
  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <EmptyState
        title='Заказы не найдены'
        description='Добавьте заказы, чтобы они появились здесь'
        createLink='/orders/new'
        createLabel='Новый заказ'
      />
    )
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№ заказа</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Продукты</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Дата доставки</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className='font-medium'>#{order.id}</TableCell>
                <TableCell>{order.client || 'Без клиента'}</TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    {order.products && order.products.length > 0 ? (
                      order.products.map((product, index) => (
                        <span key={index} className='text-sm'>
                          {product.name} ({product.option})
                        </span>
                      ))
                    ) : (
                      <span className='text-sm text-muted-foreground'>
                        Нет продуктов
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>₽{order.total?.toLocaleString() || '0'}</TableCell>
                <TableCell>
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString('ru-RU')
                    : 'Не указана'}
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
