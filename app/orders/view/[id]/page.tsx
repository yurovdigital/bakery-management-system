// app/orders/view/[id]/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useOrder } from '@/hooks/use-orders'
import { normalizeData, getRelation, getRelationArray } from '@/utils/strapi'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { PhoneIcon, MailIcon, MapPinIcon, ClipboardIcon } from 'lucide-react'

export default function ViewOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: orderData, isLoading } = useOrder(params.id)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-10 w-1/3' />
        <Card>
          <CardHeader>
            <Skeleton className='h-7 w-1/4 mb-2' />
            <Skeleton className='h-5 w-2/3' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-5 w-1/5' />
                <Skeleton className='h-10 w-full' />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className='h-10 w-24' />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Заказ не найден</h1>
        <Button onClick={() => router.push('/orders')}>
          Вернуться к списку заказов
        </Button>
      </div>
    )
  }

  const order = normalizeData(orderData)
  const client = order.client ? getRelation(order.client) : null
  const orderItems = order.orderItems ? getRelationArray(order.orderItems) : []

  // Функция для получения статуса заказа на русском
  function getOrderStatusLabel(status: string) {
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
  function getOrderStatusBadgeColor(status: string) {
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Заказ #{order.orderNumber}
        </h1>
        <Badge
          variant='outline'
          className={getOrderStatusBadgeColor(order.status)}
        >
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Информация о заказе</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Дата заказа
                </p>
                <p>
                  {format(new Date(order.orderDate), 'PPP', { locale: ru })}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Дата доставки
                </p>
                <p>
                  {format(new Date(order.deliveryDate), 'PPP', { locale: ru })}
                </p>
              </div>
            </div>

            {order.address && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Адрес доставки
                </p>
                <div className='flex items-start mt-1'>
                  <MapPinIcon className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                  <p>{order.address}</p>
                </div>
              </div>
            )}

            {order.notes && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Примечания
                </p>
                <div className='flex items-start mt-1'>
                  <ClipboardIcon className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                  <p>{order.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о клиенте</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {client ? (
              <>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    ФИО
                  </p>
                  <p className='font-medium'>{client.name}</p>
                </div>

                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Контакты
                  </p>
                  <div className='space-y-1 mt-1'>
                    <div className='flex items-center'>
                      <PhoneIcon className='h-4 w-4 mr-2 text-muted-foreground' />
                      <p>{client.phone}</p>
                    </div>
                    {client.email && (
                      <div className='flex items-center'>
                        <MailIcon className='h-4 w-4 mr-2 text-muted-foreground' />
                        <p>{client.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Статистика
                  </p>
                  <div className='grid grid-cols-2 gap-4 mt-1'>
                    <div>
                      <p className='text-sm'>
                        Всего заказов:{' '}
                        <span className='font-medium'>
                          {client.ordersCount}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className='text-sm'>
                        Сумма заказов:{' '}
                        <span className='font-medium'>
                          ₽{client.totalSpent.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className='text-muted-foreground'>
                Информация о клиенте не найдена
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Продукты в заказе</CardTitle>
        </CardHeader>
        <CardContent>
          {orderItems.length > 0 ? (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Продукт</TableHead>
                    <TableHead>Опция</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Кол-во</TableHead>
                    <TableHead className='text-right'>Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item, index) => {
                    const recipe = item.recipe ? getRelation(item.recipe) : null
                    return (
                      <TableRow key={index}>
                        <TableCell className='font-medium'>
                          {recipe?.name || 'Неизвестный продукт'}
                        </TableCell>
                        <TableCell>{item.option}</TableCell>
                        <TableCell>₽{item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className='text-right'>
                          ₽{item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell colSpan={4} className='text-right font-bold'>
                      Итого:
                    </TableCell>
                    <TableCell className='text-right font-bold'>
                      ₽{order.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className='text-muted-foreground'>В заказе нет продуктов</p>
          )}
        </CardContent>
        <CardFooter>
          <div className='flex gap-4'>
            <Button variant='outline' onClick={() => router.push('/orders')}>
              Назад к списку
            </Button>
            <Button onClick={() => router.push(`/orders/edit/${params.id}`)}>
              Редактировать заказ
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
