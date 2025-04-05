// hooks/use-clients.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchWithPagination,
  fetchById,
  create,
  update,
  remove,
} from '@/lib/api-client'
import { Client, StrapiData, StrapiResponse } from '@/types/api'
import { toast } from '@/components/ui/use-toast'

// Ключи запросов для React Query
const CLIENTS_QUERY_KEY = 'clients'

// Получение списка клиентов
export function useClients(page = 1, pageSize = 25, filters = {}) {
  return useQuery<StrapiResponse<StrapiData<Client>[]>>({
    queryKey: [CLIENTS_QUERY_KEY, page, pageSize, filters],
    queryFn: () => fetchWithPagination('clients', page, pageSize, filters),
  })
}

// Получение одного клиента по ID
export function useClient(id: number | string | null) {
  return useQuery<StrapiData<Client>>({
    queryKey: [CLIENTS_QUERY_KEY, id],
    queryFn: () => fetchById(`clients/${id}?populate=orders`),
    enabled: !!id,
  })
}

// Создание нового клиента
export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Client>) => create('clients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Клиент успешно добавлен',
      })
    },
  })
}

// Обновление клиента
export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string
      data: Partial<Client>
    }) => update('clients', id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CLIENTS_QUERY_KEY, variables.id],
      })
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Данные клиента успешно обновлены',
      })
    },
  })
}

// Удаление клиента
export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => remove('clients', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Клиент успешно удален',
      })
    },
  })
}
