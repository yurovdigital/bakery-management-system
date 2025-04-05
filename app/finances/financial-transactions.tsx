// app/finances/financial-transactions.tsx
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useFinancialTransactions } from '@/hooks/use-finances'
import { normalizeData } from '@/utils/strapi'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useState } from 'react'

// Функция для получения цвета бейджа в зависимости от категории
function getCategoryBadgeColor(category: string) {
  switch (category) {
    case 'Торты':
      return 'bg-pink-100 text-pink-800 hover:bg-pink-100'
    case 'Капкейки':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    case 'Моти':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'Разное':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
    case 'Ингредиенты':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    case 'Упаковка':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
    case 'Аренда':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    case 'Коммунальные':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }
}

interface FinancialTransactionsProps {
  type: 'income' | 'expense'
}

export function FinancialTransactions({ type }: FinancialTransactionsProps) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Фильтры для типа транзакции
  const filters = {
    filters: {
      type: type,
    },
    sort: ['date:desc'],
  }

  const { data, isLoading } = useFinancialTransactions(page, pageSize, filters)

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='w-full h-12' />
        ))}
      </div>
    )
  }

  const transactions = data?.data
    ? data.data.map(item => normalizeData(item))
    : []
  const pagination = data?.meta.pagination

  return (
    <>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead className='text-right'>Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge
                    variant='outline'
                    className={getCategoryBadgeColor(transaction.category)}
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  ₽{transaction.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}

            {transactions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-8 text-muted-foreground'
                >
                  Транзакции не найдены
                </TableCell>
              </TableRow>
            )}
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
                    setPage(pagination.page - 1)
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
                    setPage(i + 1)
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
                    setPage(pagination.page + 1)
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
    </>
  )
}
