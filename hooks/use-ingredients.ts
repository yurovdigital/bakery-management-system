// hooks/use-ingredients.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchWithPagination,
  fetchById,
  create,
  update,
  remove,
} from '@/lib/api-client'
import { Ingredient, StrapiData, StrapiResponse } from '@/types/api'
import { toast } from '@/components/ui/use-toast'

// Ключи запросов для React Query
const INGREDIENTS_QUERY_KEY = 'ingredients'

// Получение списка ингредиентов
export function useIngredients(page = 1, pageSize = 25, filters = {}) {
  return useQuery<StrapiResponse<StrapiData<Ingredient>[]>>({
    queryKey: [INGREDIENTS_QUERY_KEY, page, pageSize, filters],
    queryFn: () => fetchWithPagination('ingredients', page, pageSize, filters),
  })
}

// Получение одного ингредиента по ID
export function useIngredient(id: number | string | null) {
  return useQuery<StrapiData<Ingredient>>({
    queryKey: [INGREDIENTS_QUERY_KEY, id],
    queryFn: () => fetchById('ingredients', id!),
    enabled: !!id, // Запрос выполняется только если id не null
  })
}

// Создание нового ингредиента
export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Ingredient>) => create('ingredients', data),
    onSuccess: () => {
      // Инвалидируем кеш, чтобы обновить список ингредиентов
      queryClient.invalidateQueries({ queryKey: [INGREDIENTS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Ингредиент успешно добавлен',
      })
    },
  })
}

// Обновление ингредиента
export function useUpdateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string
      data: Partial<Ingredient>
    }) => update('ingredients', id, data),
    onSuccess: (_, variables) => {
      // Инвалидируем кеш для конкретного ингредиента и списка
      queryClient.invalidateQueries({
        queryKey: [INGREDIENTS_QUERY_KEY, variables.id],
      })
      queryClient.invalidateQueries({ queryKey: [INGREDIENTS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Ингредиент успешно обновлен',
      })
    },
  })
}

// Удаление ингредиента
export function useDeleteIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => remove('ingredients', id),
    onSuccess: () => {
      // Инвалидируем кеш, чтобы обновить список ингредиентов
      queryClient.invalidateQueries({ queryKey: [INGREDIENTS_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Ингредиент успешно удален',
      })
    },
  })
}
