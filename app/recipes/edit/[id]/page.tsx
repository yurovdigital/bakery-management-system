// app/recipes/edit/[id]/page.tsx
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
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, XIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRecipe, useUpdateRecipe } from '@/hooks/use-recipes'
import { useIngredients } from '@/hooks/use-ingredients'
import type { Ingredient } from '@/types/api'
import { normalizeData, getRelationArray } from '@/utils/strapi'
import { Skeleton } from '@/components/ui/skeleton'

// Интерфейс для ингредиента в рецепте
interface RecipeIngredientItem {
  id: number
  name: string
  amount: number
  unit: string
  cost: number
}

type RecipeType = 'cake' | 'bento-cake' | 'cupcake' | 'mochi'

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: recipeData, isLoading: recipeLoading } = useRecipe(params.id)
  const { data: ingredientsData, isLoading: ingredientsLoading } =
    useIngredients(1, 100)
  const updateRecipe = useUpdateRecipe()

  const [recipe, setRecipe] = useState<{
    name: string
    type: RecipeType // Изменено с string на RecipeType
    description: string
    ingredients: RecipeIngredientItem[]
    cost: number
    price: number
  }>({
    name: '',
    type: 'cake',
    description: '',
    ingredients: [],
    cost: 0,
    price: 0,
  })

  const [selectedIngredient, setSelectedIngredient] = useState('')
  const [ingredientAmount, setIngredientAmount] = useState('')

  // Загружаем данные рецепта при загрузке страницы
  useEffect(() => {
    if (recipeData) {
      const normalizedRecipe = normalizeData(recipeData)

      // Получаем ингредиенты рецепта
      const recipeIngredients = normalizedRecipe.recipeIngredients
        ? getRelationArray(normalizedRecipe.recipeIngredients)
        : []

      // Преобразуем ингредиенты в нужный формат
      const ingredients: RecipeIngredientItem[] = recipeIngredients.map(ri => {
        const ingredientData = ri.ingredient?.data
        const ingredient = ingredientData ? normalizeData(ingredientData) : null
        return {
          id: ingredient?.id || 0,
          name: ingredient?.name || 'Неизвестный ингредиент',
          amount: ri.amount,
          unit: ingredient?.packageUnit || 'г',
          cost: ri.cost,
        }
      })

      setRecipe({
        name: normalizedRecipe.name,
        type: normalizedRecipe.type,
        description: normalizedRecipe.description || '',
        ingredients,
        cost: normalizedRecipe.cost,
        price: normalizedRecipe.price,
      })
    }
  }, [recipeData])

  // Получаем доступные ингредиенты
  const availableIngredients = ingredientsData?.data
    ? ingredientsData.data.map(item => normalizeData(item))
    : []

  // Добавление ингредиента в рецепт
  const addIngredient = () => {
    if (!selectedIngredient || !ingredientAmount) return

    const ingredient = availableIngredients.find(
      i => i.id.toString() === selectedIngredient
    )
    if (!ingredient) return

    const amount = Number.parseFloat(ingredientAmount)
    const cost =
      amount *
      (ingredient.pricePerUnit ||
        ingredient.packagePrice / ingredient.packageSize)

    const newIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      amount,
      unit: ingredient.packageUnit,
      cost,
    }

    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
      cost: prev.cost + cost,
    }))

    // Сброс полей
    setSelectedIngredient('')
    setIngredientAmount('')
  }

  // Удаление ингредиента из рецепта
  const removeIngredient = (index: number) => {
    const ingredient = recipe.ingredients[index]
    if (!ingredient) return

    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
      cost: prev.cost - ingredient.cost,
    }))
  }

  // Обновление цены при изменении себестоимости
  const updatePrice = (cost: number) => {
    // Наценка 100%
    return cost * 2
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setRecipe(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    // Проверяем, что значение соответствует допустимым типам
    if (
      value === 'cake' ||
      value === 'bento-cake' ||
      value === 'cupcake' ||
      value === 'mochi'
    ) {
      setRecipe(prev => ({ ...prev, type: value as RecipeType }))
    }
  }

  // И наконец, в функции handleSubmit при подготовке данных
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Подготавливаем данные для обновления
      const recipeData = {
        name: recipe.name,
        type: recipe.type, // Теперь это RecipeType, а не string
        description: recipe.description,
        cost: recipe.cost,
        price: recipe.price || updatePrice(recipe.cost),
      }

      // Обновляем рецепт
      await updateRecipe.mutateAsync({
        id: params.id,
        data: recipeData,
      })

      router.push('/recipes')
    } catch (error) {
      console.error('Failed to update recipe:', error)
    }
  }

  if (recipeLoading || ingredientsLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-10 w-1/3' />
        <Card>
          <CardHeader>
            <Skeleton className='h-7 w-1/4 mb-2' />
            <Skeleton className='h-5 w-2/3' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>
        Редактирование рецепта
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Редактирование рецепта</CardTitle>
            <CardDescription>
              Измените информацию о рецепте и ингредиентах
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Название рецепта</Label>
                <Input
                  id='name'
                  name='name'
                  placeholder='Например: Торт Наполеон'
                  value={recipe.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='type'>Тип продукта</Label>
                <Select value={recipe.type} onValueChange={handleTypeChange}>
                  <SelectTrigger id='type'>
                    <SelectValue placeholder='Выберите тип' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='cake'>Торт (за кг)</SelectItem>
                    <SelectItem value='bento-cake'>
                      Бенто-торт (400-500г)
                    </SelectItem>
                    <SelectItem value='cupcake'>
                      Капкейки (6, 9, 12 шт)
                    </SelectItem>
                    <SelectItem value='mochi'>Моти (4, 6, 9, 12 шт)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Описание</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Опишите рецепт...'
                value={recipe.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label>Ингредиенты</Label>
              <div className='grid grid-cols-3 gap-4'>
                <Select
                  value={selectedIngredient}
                  onValueChange={setSelectedIngredient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите ингредиент' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIngredients.map(ingredient => (
                      <SelectItem
                        key={ingredient.id}
                        value={ingredient.id.toString()}
                      >
                        {ingredient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='flex'>
                  <Input
                    type='number'
                    placeholder='Количество'
                    value={ingredientAmount}
                    onChange={e => setIngredientAmount(e.target.value)}
                    min='0'
                    step='0.01'
                  />
                </div>

                <Button
                  type='button'
                  onClick={addIngredient}
                  disabled={!selectedIngredient || !ingredientAmount}
                >
                  <PlusIcon className='h-4 w-4 mr-2' />
                  Добавить
                </Button>
              </div>

              {recipe.ingredients.length > 0 && (
                <div className='mt-4 rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ингредиент</TableHead>
                        <TableHead>Количество</TableHead>
                        <TableHead>Стоимость</TableHead>
                        <TableHead className='w-[50px]'></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipe.ingredients.map((ingredient, index) => (
                        <TableRow key={`${ingredient.id}-${index}`}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>
                            {ingredient.amount} {ingredient.unit}
                          </TableCell>
                          <TableCell>₽{ingredient.cost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => removeIngredient(index)}
                            >
                              <XIcon className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='cost'>Себестоимость</Label>
                <Input
                  id='cost'
                  name='cost'
                  type='number'
                  step='0.01'
                  value={recipe.cost.toFixed(2)}
                  readOnly
                  className='bg-muted'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='price'>Цена продажи</Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  step='0.01'
                  placeholder='Укажите цену продажи'
                  value={recipe.price || updatePrice(recipe.cost).toFixed(2)}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {recipe.cost > 0 && recipe.price > 0 && (
              <div className='rounded-md bg-muted p-4'>
                <p className='text-sm font-medium'>
                  Прибыль: ₽{(recipe.price - recipe.cost).toFixed(2)}
                  <span className='text-muted-foreground text-xs ml-2'>
                    (
                    {Math.round(
                      ((recipe.price - recipe.cost) / recipe.price) * 100
                    )}
                    %)
                  </span>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.push('/recipes')}
            >
              Отмена
            </Button>
            <Button type='submit' disabled={updateRecipe.isPending}>
              {updateRecipe.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
