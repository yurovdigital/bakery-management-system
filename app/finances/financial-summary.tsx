// app/finances/financial-summary.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUpIcon,
  TrendingDownIcon,
  PercentIcon,
  WalletIcon,
} from 'lucide-react'
import { useFinancialStats } from '@/hooks/use-finances'
import { Skeleton } from '@/components/ui/skeleton'

export function FinancialSummary() {
  const { data: monthlyStats, isLoading: monthLoading } =
    useFinancialStats('month')
  const { data: yearlyStats, isLoading: yearLoading } =
    useFinancialStats('year')

  if (monthLoading || yearLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                <Skeleton className='h-4 w-24' />
              </CardTitle>
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-24 mb-1' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Доходы (месяц)</CardTitle>
          <TrendingUpIcon
            className={`h-4 w-4 ${
              monthlyStats?.incomeChange >= 0
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            ₽{monthlyStats?.income.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground'>
            {monthlyStats?.incomeChange >= 0 ? '+' : ''}
            {monthlyStats?.incomeChange}% по сравнению с прошлым месяцем
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Расходы (месяц)</CardTitle>
          <TrendingDownIcon
            className={`h-4 w-4 ${
              monthlyStats?.expensesChange <= 0
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            ₽{monthlyStats?.expenses.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground'>
            {monthlyStats?.expensesChange >= 0 ? '+' : ''}
            {monthlyStats?.expensesChange}% по сравнению с прошлым месяцем
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Прибыль (месяц)</CardTitle>
          <WalletIcon
            className={`h-4 w-4 ${
              monthlyStats?.profitChange >= 0 ? 'text-blue-500' : 'text-red-500'
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            ₽{monthlyStats?.profit.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground'>
            {monthlyStats?.profitChange >= 0 ? '+' : ''}
            {monthlyStats?.profitChange}% по сравнению с прошлым месяцем
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Рентабельность</CardTitle>
          <PercentIcon className='h-4 w-4 text-purple-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {monthlyStats?.profitMargin}%
          </div>
          <p className='text-xs text-muted-foreground'>
            {monthlyStats?.marginChange >= 0 ? '+' : ''}
            {monthlyStats?.marginChange}% по сравнению с прошлым месяцем
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Доходы (год)</CardTitle>
          <TrendingUpIcon
            className={`h-4 w-4 ${
              yearlyStats?.incomeChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            ₽{yearlyStats?.income.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground'>
            {yearlyStats?.incomeChange >= 0 ? '+' : ''}
            {yearlyStats?.incomeChange}% по сравнению с прошлым годом
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Расходы (год)</CardTitle>
          <TrendingDownIcon
            className={`h-4 w-4 ${
              yearlyStats?.expensesChange <= 0
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            ₽{yearlyStats?.expenses.toLocaleString()}
          </div>
          <p className='text-xs text-muted-foreground'>
            {yearlyStats?.expensesChange >= 0 ? '+' : ''}
            {yearlyStats?.expensesChange}% по сравнению с прошлым годом
          </p>
        </CardContent>
      </Card>
    </>
  )
}
