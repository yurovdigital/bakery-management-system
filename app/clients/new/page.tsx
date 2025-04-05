"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function NewClientPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Здесь будет логика сохранения клиента
    toast({
      title: "Клиент добавлен",
      description: `${client.name} успешно добавлен в базу`,
    })

    router.push("/clients")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Добавление клиента</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Новый клиент</CardTitle>
            <CardDescription>Заполните информацию о новом клиенте</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО клиента</Label>
              <Input
                id="name"
                name="name"
                placeholder="Например: Иванова Анна Сергеевна"
                value={client.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+7 (999) 123-45-67"
                  value={client.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={client.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                name="address"
                placeholder="Адрес доставки"
                value={client.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Дополнительная информация о клиенте..."
                value={client.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/clients")}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

