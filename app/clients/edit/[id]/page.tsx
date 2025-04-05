// app/clients/edit/[id]/page.tsx
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
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClient, useUpdateClient } from '@/hooks/use-clients'
import { Client } from '@/types/api'
import { normalizeData } from '@/utils/strapi'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: clientData, isLoading } = useClient(params.id)
  const updateClient = useUpdateClient()

  const [client, setClient] = useState<Partial<Client>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  // Загружаем данные клиента при загрузке страницы
  useEffect(() => {
    if (clientData) {
      const normalizedClient = normalizeData(clientData)
      setClient({
        name: normalizedClient.name,
        phone: normalizedClient.phone,
        email: normalizedClient.email,
        address: normalizedClient.address,
        notes: normalizedClient.notes,
      })
    }
  }, [clientData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setClient(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateClient.mutateAsync({
        id: params.id,
        data: client,
      })
      router.push('/clients')
    } catch (error) {
      console.error('Failed to update client:', error)
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-10 w-1/3' />
        <Card>
          <CardHeader>
            <Skeleton className='h-7 w-1/4 mb-2' />
            <Skeleton className='h-5 w-2/3' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-5 w-1/5' />
                <Skeleton className='h-10 w-full' />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <div className='flex justify-between w-full'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-24' />
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>
        Редактирование клиента
      </h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Редактирование клиента</CardTitle>
            <CardDescription>Измените информацию о клиенте</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>ФИО клиента</Label>
              <Input
                id='name'
                name='name'
                placeholder='Например: Иванова Анна Сергеевна'
                value={client.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Телефон</Label>
                <Input
                  id='phone'
                  name='phone'
                  placeholder='+7 (999) 123-45-67'
                  value={client.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='example@mail.com'
                  value={client.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='address'>Адрес</Label>
              <Input
                id='address'
                name='address'
                placeholder='Адрес доставки'
                value={client.address}
                onChange={handleChange}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Примечания</Label>
              <Textarea
                id='notes'
                name='notes'
                placeholder='Дополнительная информация о клиенте...'
                value={client.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.push('/clients')}
              disabled={updateClient.isPending}
            >
              Отмена
            </Button>
            <Button type='submit' disabled={updateClient.isPending}>
              {updateClient.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
