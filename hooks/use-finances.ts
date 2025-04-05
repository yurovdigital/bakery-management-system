// hooks/use-finances.ts
import { useQuery } from '@tanstack/react-query'
import { fetchWithPagination } from '@/lib/api-client'
import { FinancialTransaction, StrapiData, StrapiResponse } from '@/types/api'
import apiClient from '@/lib/api-client'

// Ключи запросов для React Query
const TRANSACTIONS_QUERY_KEY = 'financial-transactions'

// Получение списка финансовых транзакций
export function useFinancialTransactions(
  page = 1,
  pageSize = 25,
  filters = {}
) {
  return useQuery<StrapiResponse<StrapiData<FinancialTransaction>[]>>({
    queryKey: [TRANSACTIONS_QUERY_KEY, page, pageSize, filters],
    queryFn: () =>
      fetchWithPagination('financial-transactions', page, pageSize, {
        ...filters,
        populate: ['order'],
        sort: ['date:desc'],
      }),
  })
}

// Получение финансовой статистики
export function useFinancialStats(period: 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['financial-stats', period],
    queryFn: async () => {
      // Здесь мы делаем запрос к специальному эндпоинту для получения статистики
      // Этот эндпоинт нужно будет создать в Strapi
      const response = await apiClient.get(`/financial-stats?period=${period}`)
      return response.data
    },
  })
}

// Получение данных для графика
export function useFinancialChartData(months = 6) {
  return useQuery({
    queryKey: ['financial-chart', months],
    queryFn: async () => {
      // Здесь мы делаем запрос к специальному эндпоинту для получения данных графика
      // Этот эндпоинт нужно будет создать в Strapi
      const response = await apiClient.get(`/financial-chart?months=${months}`)
      return response.data
    },
  })
}
