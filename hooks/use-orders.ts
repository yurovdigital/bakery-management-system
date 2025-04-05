// hooks/use-orders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchWithPagination,
  fetchById,
  create,
  update,
  remove,
} from '@/lib/api-client'
import { Order, OrderItem, StrapiData, StrapiResponse } from '@/types/api'
import { toast } from '@/components/ui/use-toast'
import apiClient from '@/lib/api-client'

// Ключи запросов для React Query
const ORDERS_QUERY_KEY = 'orders'

// Получение списка заказов
export function useOrders(page = 1, pageSize = 25, filters = {}) {
  return useQuery<StrapiResponse<StrapiData<Order>[]>>({
    queryKey: [ORDERS_QUERY_KEY, page, pageSize, filters],
    queryFn: () =>
      fetchWithPagination('orders', page, pageSize, {
        ...filters,
        populate: ['client', 'orderItems.recipe'], // Подгружаем связанные данные
      }),
  })
}

// Получение одного заказа по ID
export function useOrder(id: number | string | null) {
  return useQuery<StrapiData<Order>>({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => fetchById(`orders/${id}?populate=client,orderItems.recipe`),
    enabled: !!id,
  })
}

// Создание нового заказа
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      order: Partial<Order>
      items: Partial<OrderItem>[]
    }) => {
      // Сначала создаем заказ
      return create('orders', data.order).then(order => {
        // Затем добавляем позиции к заказу
        const orderId = order.id
        const itemPromises = data.items.map(item => {
          return create('order-items', {
            ...item,
            order: orderId,
          })
        })

        return Promise.all(itemPromises).then(() => order)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] })
      // Также инвалидируем кеш клиентов, так как обновляется их статистика
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast({
        title: 'Успешно',
        description: 'Заказ успешно создан',
      })
    },
  })
}

// Обновление статуса заказа
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string
      status: Order['status']
    }) => update('orders', id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_QUERY_KEY, variables.id],
      })
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Статус заказа успешно обновлен',
      })
    },
  })
}

// Удаление заказа
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => remove('orders', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] })
      // Также инвалидируем кеш клиентов, так как обновляется их статистика
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast({
        title: 'Успешно',
        description: 'Заказ успешно удален',
      })
    },
  })
}

// hooks/use-orders.ts
// Добавьте эту функцию в ваш файл с хуками заказов

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number
      data: Partial<Order>
    }) => {
      return await apiClient.put(`/orders/${id}`, { data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
      toast({
        title: 'Заказ обновлен',
        description: 'Заказ успешно обновлен в системе',
      })
    },
    onError: error => {
      console.error('Ошибка при обновлении заказа:', error)
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить заказ. Попробуйте еще раз.',
        variant: 'destructive',
      })
    },
  })
}
