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
import { EditIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDeleteIngredient } from '@/hooks/use-ingredients'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { Ingredient } from '@/types/api'

// Обновляем интерфейс для пропсов компонента
interface IngredientsListProps {
  ingredients: Ingredient[]
  isLoading: boolean
  pagination?: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
  onPageChange: (page: number) => void
}

export function IngredientsList({
  ingredients,
  isLoading,
  pagination,
  onPageChange,
}: IngredientsListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteIngredient = useDeleteIngredient()

  const handleDelete = async () => {
    if (deleteId) {
      await deleteIngredient.mutateAsync(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (documentId: string) => {
    router.push(`/ingredients/edit/${documentId}`)
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='w-full h-12' />
        ))}
      </div>
    )
  }

  // Проверка на пустой массив ингредиентов
  if (!ingredients || ingredients.length === 0) {
    return (
      <EmptyState
        title='Ингредиенты не найдены'
        description='Добавьте ингредиенты, чтобы они появились здесь'
        createLink='/ingredients/new'
        createLabel='Добавить ингредиент'
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
              <TableHead>Размер упаковки</TableHead>
              <TableHead>Цена упаковки</TableHead>
              <TableHead>Цена за единицу</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map(ingredient => (
              <TableRow key={ingredient.id}>
                <TableCell className='font-medium'>
                  {ingredient.name || 'Без названия'}
                </TableCell>
                <TableCell>
                  {ingredient.packageSize || 0} {ingredient.packageUnit || 'г'}
                </TableCell>
                <TableCell>₽{formatNumber(ingredient.packagePrice)}</TableCell>
                <TableCell>
                  ₽{formatNumber(ingredient.pricePerUnit)} /{' '}
                  {ingredient.packageUnit || 'г'}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(ingredient.documentId)}
                    >
                      <EditIcon className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => setDeleteId(ingredient.documentId)}
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

      {pagination && pagination.pageCount > 1 && (
        <Pagination className='mt-4'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={e => {
                  e.preventDefault()
                  if (pagination.page > 1) {
                    onPageChange(pagination.page - 1)
                  }
                }}
                className={
                  pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href='#'
                  onClick={e => {
                    e.preventDefault()
                    onPageChange(i + 1)
                  }}
                  isActive={pagination.page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={e => {
                  e.preventDefault()
                  if (pagination.page < pagination.pageCount) {
                    onPageChange(pagination.page + 1)
                  }
                }}
                className={
                  pagination.page >= pagination.pageCount
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Ингредиент будет удален из системы.
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
