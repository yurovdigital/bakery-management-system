// app/recipes/recipes-list.tsx
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
import { useDeleteRecipe } from '@/hooks/use-recipes'
import { Recipe, StrapiData } from '@/types/api'
import { normalizeData } from '@/utils/strapi'
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
  recipes: StrapiData<Recipe>[]
  type?: string
}

export function RecipesList({ recipes, type }: RecipesListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const deleteRecipe = useDeleteRecipe()

  // Фильтрация рецептов по типу, если указан
  const filteredRecipes = type
    ? recipes.filter(recipe => {
        const normalizedRecipe = normalizeData(recipe)
        return normalizedRecipe.type === type
      })
    : recipes

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRecipe.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/recipes/edit/${id}`)
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
            {filteredRecipes.map(item => {
              const recipe = normalizeData(item)
              const profit = recipe.price - recipe.cost
              const profitMargin = Math.round((profit / recipe.price) * 100)

              return (
                <TableRow key={recipe.id}>
                  <TableCell className='font-medium'>{recipe.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={getProductTypeBadgeColor(recipe.type)}
                    >
                      {getProductTypeLabel(recipe.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>₽{recipe.cost.toFixed(2)}</TableCell>
                  <TableCell>₽{recipe.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className='text-green-600'>₽{profit.toFixed(2)}</span>
                    <span className='text-muted-foreground text-xs ml-1'>
                      ({profitMargin}%)
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
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

            {filteredRecipes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-8 text-muted-foreground'
                >
                  Рецепты не найдены
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
