import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialSummary } from "./financial-summary"
import { FinancialChart } from "./financial-chart"
import { FinancialTransactions } from "./financial-transactions"

export default function FinancesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Финансы</h1>

      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Сводка</TabsTrigger>
          <TabsTrigger value="income">Доходы</TabsTrigger>
          <TabsTrigger value="expenses">Расходы</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FinancialSummary />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Финансовая статистика</CardTitle>
              <CardDescription>Доходы и расходы за последние 6 месяцев</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Доходы</CardTitle>
              <CardDescription>История доходов от продаж</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialTransactions type="income" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Расходы</CardTitle>
              <CardDescription>История расходов на ингредиенты и другие нужды</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialTransactions type="expense" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

