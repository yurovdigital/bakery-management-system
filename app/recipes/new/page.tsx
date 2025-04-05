"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { PlusIcon, XIcon } from "lucide-react"

// Типы продукции
type ProductType = "cake" | "bento-cake" | "cupcake" | "mochi"

// Интерфейс для ингредиента в рецепте
interface RecipeIngredient {
  id: number
  name: string
  amount: string
  unit: string
  cost: number
}

export default function NewRecipePage() {
  const { toast } = useToast()
  const router = useRouter()

  // Пример данных ингредиентов для выбора
  const availableIngredients = [
    { id: 1, name: "Творожный сыр", unit: "г", pricePerUnit: 0.45 },
    { id: 2, name: "Арахис", unit: "г", pricePerUnit: 0.6 },
    { id: 3, name: "Мука пшеничная", unit: "г", pricePerUnit: 0.06 },
    { id: 4, name: "Сахар", unit: "г", pricePerUnit: 0.08 },
    { id: 5, name: "Масло сливочное", unit: "г", pricePerUnit: 0.9 },
  ]

  const [recipe, setRecipe] = useState({
    name: "",
    type: "cake",
    description: "",
    ingredients: [] as RecipeIngredient[],
    cost: 0,
    price: 0,
  })

  const [selectedIngredient, setSelectedIngredient] = useState("")
  const [ingredientAmount, setIngredientAmount] = useState("")

  // Добавление ингредиента в рецепт
  const addIngredient = () => {
    if (!selectedIngredient || !ingredientAmount) return

    const ingredient = availableIngredients.find((i) => i.id.toString() === selectedIngredient)
    if (!ingredient) return

    const amount = Number.parseFloat(ingredientAmount)
    const cost = amount * ingredient.pricePerUnit

    const newIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      amount: ingredientAmount,
      unit: ingredient.unit,
      cost,
    }

    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
      cost: prev.cost + cost,
    }))

    // Сброс полей
    setSelectedIngredient("")
    setIngredientAmount("")
  }

  // Удаление ингредиента из рецепта
  const removeIngredient = (id: number) => {
    const ingredient = recipe.ingredients.find((i) => i.id === id)
    if (!ingredient) return

    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.id !== id),
      cost: prev.cost - ingredient.cost,
    }))
  }

  // Обновление цены при изменении себестоимости
  const updatePrice = (cost: number) => {
    // Наценка 100%
    return cost * 2
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRecipe((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setRecipe((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Здесь будет логика сохранения рецепта
    toast({
      title: "Рецепт создан",
      description: `${recipe.name} успешно добавлен в систему`,
    })

    router.push("/recipes")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Создание рецепта</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Новый рецепт</CardTitle>
            <CardDescription>Заполните информацию о новом рецепте и добавьте ингредиенты</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название рецепта</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Например: Торт Наполеон"
                  value={recipe.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Тип продукта</Label>
                <Select value={recipe.type} onValueChange={handleTypeChange}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cake">Торт (за кг)</SelectItem>
                    <SelectItem value="bento-cake">Бенто-торт (400-500г)</SelectItem>
                    <SelectItem value="cupcake">Капкейки (6, 9, 12 шт)</SelectItem>
                    <SelectItem value="mochi">Моти (4, 6, 9, 12 шт)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Опишите рецепт..."
                value={recipe.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Ингредиенты</Label>
              <div className="grid grid-cols-3 gap-4">
                <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ингредиент" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIngredients.map((ingredient) => (
                      <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                        {ingredient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex">
                  <Input
                    type="number"
                    placeholder="Количество"
                    value={ingredientAmount}
                    onChange={(e) => setIngredientAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <Button type="button" onClick={addIngredient} disabled={!selectedIngredient || !ingredientAmount}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </div>

              {recipe.ingredients.length > 0 && (
                <div className="mt-4 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ингредиент</TableHead>
                        <TableHead>Количество</TableHead>
                        <TableHead>Стоимость</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipe.ingredients.map((ingredient) => (
                        <TableRow key={`${ingredient.id}-${ingredient.amount}`}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>
                            {ingredient.amount} {ingredient.unit}
                          </TableCell>
                          <TableCell>₽{ingredient.cost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeIngredient(ingredient.id)}>
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Себестоимость</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={recipe.cost.toFixed(2)}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена продажи</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Укажите цену продажи"
                  value={recipe.price || updatePrice(recipe.cost).toFixed(2)}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {recipe.cost > 0 && recipe.price > 0 && (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">
                  Прибыль: ₽{(recipe.price - recipe.cost).toFixed(2)}
                  <span className="text-muted-foreground text-xs ml-2">
                    ({Math.round(((recipe.price - recipe.cost) / recipe.price) * 100)}%)
                  </span>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/recipes")}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

