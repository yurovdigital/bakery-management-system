import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchById,
  fetchWithPagination,
  create,
  update,
  remove,
} from '@/lib/api-client'
import { toast } from '@/components/ui/use-toast'
import type { Ingredient } from '@/types/api'

// Получение списка ингредиентов
export function useIngredients(page = 1, pageSize = 25, filters = {}) {
  return useQuery({
    queryKey: ['ingredients', page, pageSize, filters],
    queryFn: () => fetchWithPagination('/ingredients', page, pageSize, filters),
    staleTime: 1000 * 60 * 5, // 5 минут
  })
}

// Получение одного ингредиента
export function useIngredient(id?: string | number) {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: () => fetchById('/ingredients', id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 минут
  })
}

// Создание ингредиента
export function useCreateIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Ingredient>) => create('/ingredients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast({
        title: 'Ингредиент создан',
        description: 'Ингредиент успешно добавлен в систему',
      })
    },
    onError: (error: any) => {
      console.error('Create ingredient failed:', error)
      toast({
        title: 'Ошибка создания',
        description:
          'Не удалось создать ингредиент. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
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
      id: string | number
      data: Partial<Ingredient>
    }) => update('/ingredients', id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['ingredient', variables.id] })
      toast({
        title: 'Ингредиент обновлен',
        description: 'Ингредиент успешно обновлен в системе',
      })
    },
    onError: (error: any) => {
      console.error('Update ingredient failed:', error)
      toast({
        title: 'Ошибка обновления',
        description:
          'Не удалось обновить ингредиент. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
      })
    },
  })
}

// Удаление ингредиента по documentId
export function useDeleteIngredient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) => remove('/ingredients', documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast({
        title: 'Ингредиент удален',
        description: 'Ингредиент успешно удален из системы',
      })
    },
    onError: (error: any) => {
      console.error('Delete ingredient failed:', error)
      toast({
        title: 'Ошибка удаления',
        description:
          'Не удалось удалить ингредиент. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
      })
    },
  })
}
