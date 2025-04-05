// app/page.tsx
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ShoppingCartIcon,
  CakeIcon,
  UsersIcon,
  ClipboardListIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { useIngredients } from '@/hooks/use-ingredients'
import { useRecipes } from '@/hooks/use-recipes'
import { useClients } from '@/hooks/use-clients'
import { useOrders } from '@/hooks/use-orders'
import { useFinancialStats } from '@/hooks/use-finances'
import { Skeleton } from '@/components/ui/skeleton'
import { normalizeData } from '@/utils/strapi'

export default function Dashboard() {
  // Получаем количество ингредиентов
  const { data: ingredientsData, isLoading: ingredientsLoading } =
    useIngredients(1, 1)

  // Получаем количество рецептов
  const { data: recipesData, isLoading: recipesLoading } = useRecipes(1, 1)

  // Получаем количество клиентов
  const { data: clientsData, isLoading: clientsLoading } = useClients(1, 1)

  // Получаем активные заказы
  const { data: ordersData, isLoading: ordersLoading } = useOrders(1, 5, {
    filters: {
      status: {
        $in: ['pending', 'in-progress'],
      },
    },
    sort: ['orderDate:desc'],
  })

  // Получаем финансовую статистику
  const { data: financialStats, isLoading: financialLoading } =
    useFinancialStats('month')

  // Получаем популярные продукты
  const { data: popularProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      const response = await apiClient.get('/popular-products')
      return response.data
    },
  })

  // Получаем последние заказы
  const { data: latestOrders, isLoading: latestOrdersLoading } = useOrders(
    1,
    5,
    {
      sort: ['orderDate:desc'],
      populate: ['client'],
    }
  )

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Дашборд</h1>
        <Button asChild>
          <Link href='/orders/new'>Новый заказ</Link>
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Ингредиенты</CardTitle>
            <ShoppingCartIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {ingredientsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {ingredientsData?.meta.pagination?.total || 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              Всего ингредиентов в системе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Рецепты</CardTitle>
            <CakeIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {recipesLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {recipesData?.meta.pagination?.total || 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              Всего рецептов в системе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Клиенты</CardTitle>
            <UsersIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {clientsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {clientsData?.meta.pagination?.total || 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              Всего клиентов в базе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Заказы</CardTitle>
            <ClipboardListIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {ordersData?.meta.pagination?.total || 0}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>Активных заказов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Доходы</CardTitle>
            <TrendingUpIcon className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            {financialLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold'>
                ₽{financialStats?.income.toLocaleString()}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>За текущий месяц</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Расходы</CardTitle>
            <TrendingDownIcon className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            {financialLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold'>
                ₽{financialStats?.expenses.toLocaleString()}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>За текущий месяц</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Последние 5 заказов в системе</CardDescription>
          </CardHeader>
          <CardContent>
            {latestOrdersLoading ? (
              <div className='space-y-4'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className='h-12 w-full' />
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {latestOrders?.data.map(orderData => {
                  const order = normalizeData(orderData)
                  const client = order.client?.data
                    ? normalizeData(order.client.data)
                    : null

                  return (
                    <div
                      key={order.id}
                      className='flex items-center justify-between'
                    >
                      <div>
                        <p className='font-medium'>
                          Заказ #{order.orderNumber}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {client?.name || 'Клиент не указан'}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>
                          ₽{order.total.toLocaleString()}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {new Date(order.orderDate).toLocaleDateString(
                            'ru-RU'
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {(!latestOrders?.data || latestOrders.data.length === 0) && (
                  <p className='text-center py-4 text-muted-foreground'>
                    Нет заказов
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные продукты</CardTitle>
            <CardDescription>
              Самые популярные продукты за месяц
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className='space-y-4'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className='h-6 w-full' />
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {popularProducts?.map((product: any, i: any) => (
                  <div key={i} className='flex items-center justify-between'>
                    <p className='font-medium'>{product.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {product.count} шт.
                    </p>
                  </div>
                ))}

                {(!popularProducts || popularProducts.length === 0) && (
                  <p className='text-center py-4 text-muted-foreground'>
                    Нет данных
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
