import axios from 'axios'
import { toast } from '@/components/ui/use-toast'

// Базовый URL для Strapi API
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'

// API токен - для клиентских запросов используем токен из переменной окружения
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем токен авторизации к запросам
apiClient.interceptors.request.use(config => {
  if (API_TOKEN) {
    config.headers.Authorization = `Bearer ${API_TOKEN}`
  }
  return config
})

// Обработка ошибок с более подробной информацией
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)

    // Не показываем уведомление для 404 ошибок (отсутствие данных)
    if (error.response?.status !== 404) {
      const message =
        error.response?.data?.error?.message ||
        'Произошла ошибка при выполнении запроса'

      toast({
        title: `Ошибка ${error.response?.status || ''}`,
        description: message,
        variant: 'destructive',
      })
    }

    return Promise.reject(error)
  }
)

// Получение данных с пагинацией с обработкой пустых данных
export async function fetchWithPagination(
  endpoint: string,
  page = 1,
  pageSize = 25,
  filters = {}
) {
  try {
    const params = {
      pagination: {
        page,
        pageSize,
      },
      ...filters,
    }

    const response = await apiClient.get(endpoint, { params })
    return {
      data: response.data.data || [], // Возвращаем пустой массив, если данных нет
      meta: response.data.meta || {
        pagination: { page, pageSize, total: 0, pageCount: 0 },
      },
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    // Возвращаем пустые данные в случае ошибки
    return {
      data: [],
      meta: { pagination: { page, pageSize, total: 0, pageCount: 0 } },
    }
  }
}

// Получение одной записи по ID с обработкой отсутствия данных
export async function fetchById(endpoint: string, id?: number | string) {
  try {
    if (!id) {
      console.warn(`No ID provided for ${endpoint}`)
      return null
    }

    const url = `${endpoint}/${id}`
    const response = await apiClient.get(url)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching ${endpoint}/${id}:`, error)
    // Возвращаем null в случае ошибки или отсутствия данных
    return null
  }
}

// Создание новой записи
export async function create(endpoint: string, data: any) {
  try {
    const response = await apiClient.post(endpoint, { data })
    return response.data.data
  } catch (error) {
    console.error(`Error creating ${endpoint}:`, error)
    throw error
  }
}

// Обновление записи
export async function update(endpoint: string, id: number | string, data: any) {
  try {
    const response = await apiClient.put(`${endpoint}/${id}`, { data })
    return response.data.data
  } catch (error) {
    console.error(`Error updating ${endpoint}/${id}:`, error)
    throw error
  }
}

// Удаление записи
export async function remove(endpoint: string, id: number | string) {
  try {
    const response = await apiClient.delete(`${endpoint}/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error deleting ${endpoint}/${id}:`, error)
    throw error
  }
}

export default apiClient
