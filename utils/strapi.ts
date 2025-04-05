// utils/strapi.ts
import { StrapiData, StrapiRelation, StrapiRelationArray } from '@/types/api'

// Преобразование данных из формата Strapi в обычный объект
export function normalizeData<T>(data: StrapiData<T>): T & { id: number } {
  if (!data) {
    console.error('Invalid data for normalization:', data)
    return { id: 0 } as T & { id: number }
  }

  // Проверяем, имеет ли объект структуру с attributes или это уже плоский объект
  if ('attributes' in data) {
    return {
      id: data.id,
      ...data.attributes,
    }
  } else {
    // Данные уже в плоском формате
    return data as T & { id: number }
  }
}

// Преобразование массива данных из формата Strapi
export function normalizeDataArray<T>(
  data: StrapiData<T>[]
): (T & { id: number })[] {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data array for normalization:', data)
    return []
  }

  return data.map(item => normalizeData(item))
}

// Получение связанного объекта
export function getRelation<T>(
  relation: StrapiRelation<T> | undefined
): (T & { id: number }) | null {
  if (!relation || !relation.data) return null
  return normalizeData(relation.data)
}

// Получение массива связанных объектов
export function getRelationArray<T>(
  relation: StrapiRelationArray<T> | undefined
): (T & { id: number })[] {
  if (!relation || !relation.data) return []
  return normalizeDataArray(relation.data)
}
