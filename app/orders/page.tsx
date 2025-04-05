import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { OrdersList } from "./orders-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
        <Button asChild>
          <Link href="/orders/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Новый заказ
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Управление заказами</CardTitle>
          <CardDescription>Просматривайте и управляйте заказами клиентов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Поиск заказов..." className="w-full pl-8" />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Все заказы</TabsTrigger>
              <TabsTrigger value="pending">В ожидании</TabsTrigger>
              <TabsTrigger value="in-progress">В работе</TabsTrigger>
              <TabsTrigger value="completed">Выполненные</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <OrdersList />
            </TabsContent>
            <TabsContent value="pending">
              <OrdersList status="pending" />
            </TabsContent>
            <TabsContent value="in-progress">
              <OrdersList status="in-progress" />
            </TabsContent>
            <TabsContent value="completed">
              <OrdersList status="completed" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

