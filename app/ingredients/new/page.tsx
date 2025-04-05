// app/ingredients/new/page.tsx
'use client'

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
import { useCreateIngredient } from '@/hooks/use-ingredients'
import { Ingredient } from '@/types/api'

export default function NewIngredientPage() {
  const router = useRouter()
  const createIngredient = useCreateIngredient()

  const [ingredient, setIngredient] = useState<Partial<Ingredient>>({
    name: '',
    packageSize: 0,
    packageUnit: 'г',
    packagePrice: 0,
    pricePerUnit: null,
    inStock: true,
  })

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
      setIngredient(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setIngredient(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleUnitChange = (value: string) => {
    setIngredient(prev => ({
      ...prev,
      packageUnit: value as Ingredient['packageUnit'],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      console.log('Submitting ingredient:', ingredient)
      await createIngredient.mutateAsync(ingredient)
      router.push('/ingredients')
    } catch (error) {
      // Ошибка обрабатывается в API клиенте
      console.error('Failed to create ingredient:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>
        Добавление ингредиента
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Новый ингредиент</CardTitle>
            <CardDescription>
              Заполните информацию о новом ингредиенте
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Название ингредиента</Label>
              <Input
                id='name'
                name='name'
                placeholder='Например: Творожный сыр'
                value={ingredient.name}
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
                  value={ingredient.packageUnit}
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

            {ingredient.packageSize && ingredient.packagePrice && (
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
              disabled={createIngredient.isPending}
            >
              Отмена
            </Button>
            <Button type='submit' disabled={createIngredient.isPending}>
              {createIngredient.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
