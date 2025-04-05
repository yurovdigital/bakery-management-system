// app/orders/new/page.tsx
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
import { useState } from 'react'
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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useClients } from '@/hooks/use-clients'
import { useRecipes } from '@/hooks/use-recipes'
import { useCreateOrder } from '@/hooks/use-orders'
import { normalizeData } from '@/utils/strapi'
import { Order, OrderItem } from '@/types/api'

// Интерфейс для продукта в заказе
interface OrderProduct {
  id: number
  name: string
  option: string
  price: number
  quantity: number
  total: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const createOrder = useCreateOrder()

  // Получаем данные клиентов и рецептов
  const { data: clientsData } = useClients(1, 100)
  const { data: recipesData } = useRecipes(1, 100)

  const clients = clientsData
    ? clientsData.data.map(client => normalizeData(client))
    : []
  const recipes = recipesData
    ? recipesData.data.map(recipe => normalizeData(recipe))
    : []

  const [order, setOrder] = useState<{
    client: string
    products: OrderProduct[]
    deliveryDate: Date
    address: string
    notes: string
    total: number
  }>({
    client: '',
    products: [],
    deliveryDate: new Date(),
    address: '',
    notes: '',
    total: 0,
  })

  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [quantity, setQuantity] = useState('1')

  // Добавление продукта в заказ
  const addProduct = () => {
    if (!selectedProduct || !selectedOption || !quantity) return

    const recipe = recipes.find(r => r.id.toString() === selectedProduct)
    if (!recipe) return

    const amount = parseInt(quantity)
    const total = recipe.price * amount

    const newProduct = {
      id: recipe.id,
      name: recipe.name,
      option: selectedOption,
      price: recipe.price,
      quantity: amount,
      total,
    }

    setOrder(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
      total: prev.total + total,
    }))

    // Сброс полей
    setSelectedProduct('')
    setSelectedOption('')
    setQuantity('1')
  }

  // Удаление продукта из заказа
  const removeProduct = (index: number) => {
    const product = order.products[index]
    if (!product) return

    setOrder(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
      total: prev.total - product.total,
    }))
  }

  const handleClientChange = (value: string) => {
    setOrder(prev => ({ ...prev, client: value }))
  }

  const handleDeliveryDateChange = (date: Date | undefined) => {
    if (date) {
      setOrder(prev => ({ ...prev, deliveryDate: date }))
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setOrder(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Подготавливаем данные для API
      const orderData: Partial<Order> = {
        orderDate: new Date().toISOString(),
        deliveryDate: order.deliveryDate.toISOString(),
        status: 'pending',
        total: order.total,
        address: order.address,
        notes: order.notes,
        client: parseInt(order.client),
      }

      // Подготавливаем позиции заказа
      const orderItems: Partial<OrderItem>[] = order.products.map(product => ({
        option: product.option,
        quantity: product.quantity,
        price: product.price,
        total: product.total,
        recipe: product.id,
      }))

      await createOrder.mutateAsync({
        order: orderData,
        items: orderItems,
      })

      router.push('/orders')
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Новый заказ</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Создание заказа</CardTitle>
            <CardDescription>
              Заполните информацию о новом заказе
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='client'>Клиент</Label>
              <Select value={order.client} onValueChange={handleClientChange}>
                <SelectTrigger id='client'>
                  <SelectValue placeholder='Выберите клиента' />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Продукты</Label>
              <div className='grid grid-cols-4 gap-4'>
                <Select
                  value={selectedProduct}
                  onValueChange={value => {
                    setSelectedProduct(value)
                    setSelectedOption('')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите продукт' />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map(recipe => (
                      <SelectItem key={recipe.id} value={recipe.id.toString()}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                  disabled={!selectedProduct}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите опцию' />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct &&
                      getOptionsForRecipe(
                        recipes.find(r => r.id.toString() === selectedProduct)
                          ?.type
                      ).map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Input
                  type='number'
                  placeholder='Количество'
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  min='1'
                  disabled={!selectedProduct}
                />

                <Button
                  type='button'
                  onClick={addProduct}
                  disabled={!selectedProduct || !selectedOption}
                >
                  <PlusIcon className='h-4 w-4 mr-2' />
                  Добавить
                </Button>
              </div>

              {order.products.length > 0 && (
                <div className='mt-4 rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Продукт</TableHead>
                        <TableHead>Опция</TableHead>
                        <TableHead>Цена</TableHead>
                        <TableHead>Кол-во</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead className='w-[50px]'></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.option}</TableCell>
                          <TableCell>₽{product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>₽{product.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => removeProduct(index)}
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
                <Label htmlFor='deliveryDate'>Дата доставки</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !order.deliveryDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {order.deliveryDate ? (
                        format(order.deliveryDate, 'PPP', { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={order.deliveryDate}
                      onSelect={handleDeliveryDateChange}
                      initialFocus
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address'>Адрес доставки</Label>
                <Input
                  id='address'
                  name='address'
                  placeholder='Укажите адрес доставки'
                  value={order.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Примечания к заказу</Label>
              <Textarea
                id='notes'
                name='notes'
                placeholder='Дополнительная информация о заказе...'
                value={order.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {order.total > 0 && (
              <div className='rounded-md bg-muted p-4'>
                <p className='text-lg font-medium'>
                  Итого: ₽{order.total.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.push('/orders')}
              disabled={createOrder.isPending}
            >
              Отмена
            </Button>
            <Button
              type='submit'
              disabled={
                order.products.length === 0 ||
                !order.client ||
                createOrder.isPending
              }
            >
              {createOrder.isPending ? 'Создание...' : 'Создать заказ'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

// Вспомогательная функция для получения опций в зависимости от типа продукта
function getOptionsForRecipe(type?: string) {
  switch (type) {
    case 'cake':
      return ['1 кг', '1.5 кг', '2 кг']
    case 'bento-cake':
      return ['400г', '500г']
    case 'cupcake':
      return ['6 шт', '9 шт', '12 шт']
    case 'mochi':
      return ['4 шт', '6 шт', '9 шт', '12 шт']
    default:
      return []
  }
}
