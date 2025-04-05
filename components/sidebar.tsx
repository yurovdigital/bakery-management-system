"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CakeIcon, HomeIcon, ShoppingCartIcon, UsersIcon, ClipboardListIcon, BarChartIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Дашборд",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Ингредиенты",
    href: "/ingredients",
    icon: ShoppingCartIcon,
  },
  {
    title: "Рецепты",
    href: "/recipes",
    icon: CakeIcon,
  },
  {
    title: "Клиенты",
    href: "/clients",
    icon: UsersIcon,
  },
  {
    title: "Заказы",
    href: "/orders",
    icon: ClipboardListIcon,
  },
  {
    title: "Финансы",
    href: "/finances",
    icon: BarChartIcon,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 font-semibold">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CakeIcon className="h-6 w-6" />
            <span>Домашняя кондитерская</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => (
              <Button
                key={index}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", pathname === item.href ? "bg-secondary" : "")}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

