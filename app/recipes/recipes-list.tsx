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
import { useDeleteRecipe } from '@/hooks/use-recipes'
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
import type { Recipe } from '@/types/api'

// Типы продукции
type ProductType = 'cake' | 'bento-cake' | 'cupcake' | 'mochi'

// Функция для получения типа продукта на русском
function getProductTypeLabel(type: string) {
  switch (type) {
    case 'cake':
      return 'Торт'
    case 'bento-cake':
      return 'Бенто-торт'
    case 'cupcake':
      return 'Капкейк'
    case 'mochi':
      return 'Моти'
    default:
      return type
  }
}

// Функция для получения цвета бейджа в зависимости от типа продукта
function getProductTypeBadgeColor(type: string) {
  switch (type) {
    case 'cake':
      return 'bg-pink-100 text-pink-800 hover:bg-pink-100'
    case 'bento-cake':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    case 'cupcake':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    case 'mochi':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    default:
      return ''
  }
}

interface RecipesListProps {
  recipes: (Recipe & { id: number })[]
  isLoading: boolean
  type?: ProductType | string
}

export function RecipesList({ recipes, isLoading, type }: RecipesListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const deleteRecipe = useDeleteRecipe()

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRecipe.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/recipes/edit/${id}`)
  }

  const handleView = (id: number) => {
    router.push(`/recipes/${id}`)
  }

  // Фильтрация рецептов по типу, если указан
  const filteredRecipes = type
    ? recipes.filter(recipe => recipe.type === type)
    : recipes

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Проверка на пустой массив рецептов
  if (!filteredRecipes || filteredRecipes.length === 0) {
    return (
      <EmptyState
        title='Рецепты не найдены'
        description='Добавьте рецепты, чтобы они появились здесь'
        createLink='/recipes/new'
        createLabel='Создать рецепт'
      />
    )
  }

  // Функция для безопасного форматирования чисел
  const formatNumber = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '0.00'
    return value.toFixed(2)
  }

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Себестоимость</TableHead>
              <TableHead>Цена продажи</TableHead>
              <TableHead>Прибыль</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecipes.map(recipe => {
              const cost = recipe.cost || 0
              const price = recipe.price || 0
              const profit = price - cost
              const profitPercent =
                price > 0 ? Math.round((profit / price) * 100) : 0

              return (
                <TableRow key={recipe.id}>
                  <TableCell className='font-medium'>
                    {recipe.name || 'Без названия'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={getProductTypeBadgeColor(recipe.type)}
                    >
                      {getProductTypeLabel(recipe.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>₽{formatNumber(cost)}</TableCell>
                  <TableCell>₽{formatNumber(price)}</TableCell>
                  <TableCell>
                    <span className='text-green-600'>
                      ₽{formatNumber(profit)}
                    </span>
                    <span className='text-muted-foreground text-xs ml-1'>
                      ({profitPercent}%)
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleView(recipe.id)}
                      >
                        <EyeIcon className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(recipe.id)}
                      >
                        <EditIcon className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setDeleteId(recipe.id)}
                      >
                        <TrashIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
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
              Это действие нельзя отменить. Рецепт будет удален из системы.
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
