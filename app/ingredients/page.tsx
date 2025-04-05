// app/ingredients/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PlusIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { IngredientsList } from './ingredients-list'
import { useState } from 'react'
import { useIngredients } from '@/hooks/use-ingredients'

export default function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Фильтры для поиска
  const filters = searchQuery
    ? {
        filters: {
          name: {
            $containsi: searchQuery,
          },
        },
      }
    : {}

  // Получаем данные из API
  const { data, isLoading, error } = useIngredients(page, pageSize, filters)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Ингредиенты</h1>
        <Button asChild>
          <Link href='/ingredients/new'>
            <PlusIcon className='h-4 w-4 mr-2' />
            Добавить ингредиент
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Управление ингредиентами</CardTitle>
          <CardDescription>
            Здесь вы можете просматривать, добавлять и редактировать ингредиенты
            для ваших рецептов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <div className='relative'>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Поиск ингредиентов...'
                className='w-full pl-8'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <IngredientsList
            ingredients={data?.data || []}
            isLoading={isLoading}
            pagination={data?.meta.pagination}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
