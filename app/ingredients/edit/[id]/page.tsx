'use client'

import type React from 'react'
import { use } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIngredient, useUpdateIngredient } from '@/hooks/use-ingredients'
import type { Ingredient } from '@/types/api'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'

// Определяем тип для параметров страницы
interface PageParams {
  id: string
}

export default function EditIngredientPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  // Используем React.use для доступа к params
  const unwrappedParams = use(params)
  const documentId = unwrappedParams.id

  const router = useRouter()
  const { data: ingredientData, isLoading, error } = useIngredient(documentId)
  const updateIngredient = useUpdateIngredient()

  const [ingredient, setIngredient] = useState<Partial<Ingredient>>({
    name: '',
    packageSize: 0,
    packageUnit: 'г',
    packagePrice: 0,
    pricePerUnit: null,
    inStock: true,
  })

  // Проверка на ошибку загрузки данных
  useEffect(() => {
    if (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные ингредиента',
        variant: 'destructive',
      })
      router.push('/ingredients')
    }
  }, [error, router])

  // Проверка на отсутствие данных после загрузки
  useEffect(() => {
    if (!isLoading && !ingredientData) {
      toast({
        title: 'Ингредиент не найден',
        description: 'Перенаправление на страницу ингредиентов',
      })
      router.push('/ingredients')
    }
  }, [ingredientData, isLoading, router])

  // Загружаем данные ингредиента при загрузке страницы
  useEffect(() => {
    if (ingredientData) {
      try {
        // Данные уже в плоском формате, просто используем их
        setIngredient({
          name: ingredientData.name || '',
          packageSize: ingredientData.packageSize || 0,
          packageUnit: ingredientData.packageUnit || 'г',
          packagePrice: ingredientData.packagePrice || 0,
          pricePerUnit: ingredientData.pricePerUnit || null,
          inStock: ingredientData.inStock ?? true,
          description: ingredientData.description || '',
        })
      } catch (error) {
        console.error('Error processing ingredient data:', error)
        toast({
          title: 'Ошибка данных',
          description: 'Формат данных ингредиента некорректен',
          variant: 'destructive',
        })
      }
    }
  }, [ingredientData])

  // Автоматически рассчитываем цену за единицу при изменении размера упаковки или цены
  useEffect(() => {
    if (
      ingredient.packageSize &&
      ingredient.packagePrice &&
      ingredient.packageSize > 0
    ) {
      const pricePerUnit = ingredient.packagePrice / ingredient.packageSize
      setIngredient(prev => ({ ...prev, pricePerUnit }))
    }
  }, [ingredient.packageSize, ingredient.packagePrice])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    // Преобразуем числовые значения
    if (type === 'number') {
      setIngredient(prev => ({
        ...prev,
        [name]: Number.parseFloat(value) || 0,
      }))
    } else {
      setIngredient(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleUnitChange = (value: string) => {
    setIngredient(prev => ({
      ...prev,
      packageUnit: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateIngredient.mutateAsync({
        id: documentId,
        data: ingredient,
      })
      toast({
        title: 'Успешно',
        description: 'Ингредиент успешно обновлен',
      })
      router.push('/ingredients')
    } catch (error) {
      console.error('Failed to update ingredient:', error)
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить ингредиент. Попробуйте еще раз.',
        variant: 'destructive',
      })
    }
  }

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
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-5 w-1/5' />
                <Skeleton className='h-10 w-full' />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <div className='flex justify-between w-full'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-24' />
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Дополнительная проверка на наличие данных перед рендерингом формы
  if (!ingredientData) {
    return null // Будет перенаправлено в useEffect
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>
        Редактирование ингредиента
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Редактирование ингредиента</CardTitle>
            <CardDescription>
              Измените информацию об ингредиенте
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Название ингредиента</Label>
              <Input
                id='name'
                name='name'
                placeholder='Например: Творожный сыр'
                value={ingredient.name || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='packageSize'>Размер упаковки</Label>
                <Input
                  id='packageSize'
                  name='packageSize'
                  type='number'
                  placeholder='Например: 1000'
                  value={ingredient.packageSize || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='packageUnit'>Единица измерения</Label>
                <Select
                  value={ingredient.packageUnit || 'г'}
                  onValueChange={handleUnitChange}
                >
                  <SelectTrigger id='packageUnit'>
                    <SelectValue placeholder='Выберите единицу' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='г'>грамм (г)</SelectItem>
                    <SelectItem value='мл'>миллилитр (мл)</SelectItem>
                    <SelectItem value='шт'>штука (шт)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='packagePrice'>Стоимость упаковки (₽)</Label>
              <Input
                id='packagePrice'
                name='packagePrice'
                type='number'
                step='0.01'
                placeholder='Например: 450'
                value={ingredient.packagePrice || ''}
                onChange={handleChange}
                required
              />
            </div>

            {ingredient.packageSize &&
              ingredient.packagePrice &&
              ingredient.packageSize > 0 && (
                <div className='rounded-md bg-muted p-4'>
                  <p className='text-sm font-medium'>
                    Стоимость за единицу: ₽
                    {(ingredient.packagePrice / ingredient.packageSize).toFixed(
                      2
                    )}
                    / {ingredient.packageUnit}
                  </p>
                </div>
              )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.push('/ingredients')}
              disabled={updateIngredient.isPending}
            >
              Отмена
            </Button>
            <Button type='submit' disabled={updateIngredient.isPending}>
              {updateIngredient.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
