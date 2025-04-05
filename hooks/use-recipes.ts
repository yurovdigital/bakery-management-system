// hooks/use-recipes.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchWithPagination,
  fetchById,
  create,
  update,
  remove,
} from '@/lib/api-client'
import { Recipe, StrapiData, StrapiResponse } from '@/types/api'
import { toast } from '@/components/ui/use-toast'

// Ключи запросов для React Query
const RECIPES_QUERY_KEY = 'recipes'

// Получение списка рецептов
export function useRecipes(page = 1, pageSize = 25, filters = {}) {
  return useQuery<StrapiResponse<StrapiData<Recipe>[]>>({
    queryKey: [RECIPES_QUERY_KEY, page, pageSize, filters],
    queryFn: () =>
      fetchWithPagination('recipes', page, pageSize, {
        ...filters,
        populate: ['recipeIngredients.ingredient'], // Подгружаем связанные данные
      }),
  })
}

// Получение одного рецепта по ID
export function useRecipe(id: number | string | null) {
  return useQuery<StrapiData<Recipe>>({
    queryKey: [RECIPES_QUERY_KEY, id],
    queryFn: () =>
      fetchById(`recipes/${id}?populate=recipeIngredients.ingredient`),
    enabled: !!id,
  })
}

// Создание нового рецепта
export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      recipe: Partial<Recipe>
      ingredients: { id: number; amount: number }[]
    }) => {
      // Сначала создаем рецепт
      return create('recipes', data.recipe).then(recipe => {
        // Затем добавляем ингредиенты к рецепту
        const recipeId = recipe.id
        const ingredientPromises = data.ingredients.map(ing => {
          return create('recipe-ingredients', {
            amount: ing.amount,
            ingredient: ing.id,
            recipe: recipeId,
            // Стоимость рассчитывается на сервере в хуке
          })
        })

        return Promise.all(ingredientPromises).then(() => recipe)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECIPES_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Рецепт успешно создан',
      })
    },
  })
}

// Обновление рецепта
export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
      ingredients,
    }: {
      id: number | string
      data: Partial<Recipe>
      ingredients?: { id: number; amount: number }[]
    }) => {
      // Обновляем основные данные рецепта
      return update('recipes', id, data).then(recipe => {
        // Если переданы ингредиенты, обновляем их
        if (ingredients) {
          // Здесь нужна дополнительная логика для обновления ингредиентов
          // Это может быть сложнее, чем просто создание новых
          // Возможно, потребуется удалить старые и создать новые
        }
        return recipe
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [RECIPES_QUERY_KEY, variables.id],
      })
      queryClient.invalidateQueries({ queryKey: [RECIPES_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Рецепт успешно обновлен',
      })
    },
  })
}

// Удаление рецепта
export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => remove('recipes', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECIPES_QUERY_KEY] })
      toast({
        title: 'Успешно',
        description: 'Рецепт успешно удален',
      })
    },
  })
}
