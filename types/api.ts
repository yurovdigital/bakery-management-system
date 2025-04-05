// Базовый интерфейс для данных Strapi с полем attributes
export interface StrapiData<T> {
  id: number
  attributes: T
}

// Интерфейс для пагинации
export interface StrapiPagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

// Интерфейс для метаданных
export interface StrapiMeta {
  pagination: StrapiPagination
}

// Интерфейс для ответа API с пагинацией
export interface StrapiResponse<T> {
  data: T[]
  meta: StrapiMeta
}

// Интерфейс для ответа API с одним объектом
export interface StrapiSingleResponse<T> {
  data: T
  meta: Record<string, any>
}

// Интерфейс для ингредиента
export interface Ingredient {
  id?: number
  documentId: string
  name: string
  packageSize?: number
  packageUnit?: string
  packagePrice?: number
  pricePerUnit?: number | null
  inStock?: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

// Интерфейс для рецепта
export interface Recipe {
  id?: number
  name: string
  type: string
  description?: string
  cost?: number
  price?: number
  ingredients?: RecipeIngredient[]
}

// Интерфейс для ингредиента в рецепте
export interface RecipeIngredient {
  id?: number
  ingredientId: number
  name: string
  amount: number
  unit: string
  cost: number
}

// Интерфейс для клиента
export interface Client {
  id?: number
  name: string
  phone: string
  email?: string
  address?: string
  notes?: string
  orders?: number
  totalSpent?: number
}

// Интерфейс для заказа
export interface Order {
  id?: number
  clientId: number
  client: string
  products: OrderProduct[]
  total: number
  date: string
  deliveryDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  address?: string
  notes?: string
}

// Интерфейс для продукта в заказе
export interface OrderProduct {
  id?: number
  recipeId: number
  name: string
  option: string
  price: number
  quantity: number
  total: number
}
