import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { RecipesList } from "./recipes-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Рецепты</h1>
        <Button asChild>
          <Link href="/recipes/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Создать рецепт
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Управление рецептами</CardTitle>
          <CardDescription>
            Здесь вы можете просматривать, создавать и редактировать рецепты для вашей продукции
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Поиск рецептов..." className="w-full pl-8" />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Все рецепты</TabsTrigger>
              <TabsTrigger value="cakes">Торты</TabsTrigger>
              <TabsTrigger value="cupcakes">Капкейки</TabsTrigger>
              <TabsTrigger value="mochi">Моти</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <RecipesList />
            </TabsContent>
            <TabsContent value="cakes">
              <RecipesList type="cake" />
            </TabsContent>
            <TabsContent value="cupcakes">
              <RecipesList type="cupcake" />
            </TabsContent>
            <TabsContent value="mochi">
              <RecipesList type="mochi" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

