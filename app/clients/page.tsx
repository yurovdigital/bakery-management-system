import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ClientsList } from "./clients-list"

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
        <Button asChild>
          <Link href="/clients/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Добавить клиента
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>База клиентов</CardTitle>
          <CardDescription>Управляйте вашей клиентской базой и отслеживайте историю заказов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Поиск клиентов..." className="w-full pl-8" />
            </div>
          </div>

          <ClientsList />
        </CardContent>
      </Card>
    </div>
  )
}

