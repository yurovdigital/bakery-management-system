// app/finances/financial-chart.tsx
'use client'

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useFinancialChartData } from '@/hooks/use-finances'
import { Skeleton } from '@/components/ui/skeleton'

export function FinancialChart() {
  const { data: chartData, isLoading } = useFinancialChartData(6)

  if (isLoading) {
    return (
      <div className='h-[300px] w-full flex items-center justify-center'>
        <Skeleton className='h-[250px] w-full' />
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className='h-[300px] w-full flex items-center justify-center text-muted-foreground'>
        Нет данных для отображения
      </div>
    )
  }

  return (
    <div className='h-[300px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip
            formatter={value => [`₽${value.toLocaleString()}`, undefined]}
            labelFormatter={label => `${label}`}
          />
          <Legend />
          <Line
            type='monotone'
            dataKey='income'
            name='Доходы'
            stroke='#10b981'
            activeDot={{ r: 8 }}
          />
          <Line
            type='monotone'
            dataKey='expenses'
            name='Расходы'
            stroke='#ef4444'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
