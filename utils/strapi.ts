import type { StrapiData } from '@/types/api'

/**
 * Проверяет, является ли объект данными в формате Strapi с полем attributes
 * @param data Данные для проверки
 * @returns true, если данные в формате Strapi с полем attributes
 */
function isStrapiAttributesFormat(data: any): data is StrapiData<any> {
  return (
    data && typeof data === 'object' && 'id' in data && 'attributes' in data
  )
}

/**
 * Нормализует данные из формата Strapi в обычный объект
 * @param data Данные в формате Strapi или уже нормализованные данные
 * @returns Нормализованный объект
 */
export function normalizeData<T>(data: any): T & { id: number } {
  if (!data) {
    // Создаем пустой объект с id = 0
    return { id: 0 } as T & { id: number }
  }

  // Проверяем, в формате ли Strapi с attributes данные
  if (isStrapiAttributesFormat(data)) {
    return {
      id: data.id,
      ...data.attributes,
    } as T & { id: number }
  }

  // Если данные уже в плоском формате, возвращаем их как есть
  return data as T & { id: number }
}

/**
 * Нормализует массив данных из формата Strapi в массив обычных объектов
 * @param dataArray Массив данных в формате Strapi или уже нормализованные данные
 * @returns Массив нормализованных объектов
 */
export function normalizeDataArray<T>(
  dataArray: any[] | null
): (T & { id: number })[] {
  if (!dataArray || !Array.isArray(dataArray)) {
    return []
  }

  // Проверяем первый элемент, чтобы определить формат данных
  if (dataArray.length > 0 && isStrapiAttributesFormat(dataArray[0])) {
    // Данные в формате Strapi с attributes
    return dataArray.map(item => normalizeData<T>(item))
  }

  // Данные уже в плоском формате
  return dataArray as (T & { id: number })[]
}

/**
 * Подготавливает данные для отправки в Strapi (удаляет id и другие служебные поля)
 * @param data Данные для отправки
 * @returns Подготовленные данные
 */
export function prepareDataForStrapi<T extends { id?: number }>(
  data: T
): Omit<T, 'id'> {
  const { id, ...rest } = data
  return rest
}
