"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { getCategoryInfo, ExpenseCategory } from "@/types/expense"
import { 
  Wallet, 
  Receipt, 
  TrendingUp, 
  BarChart3
} from "lucide-react"

interface SummaryCardsProps {
  totalCurrentMonth: number
  totalTransactions: number
  highestCategory: ExpenseCategory
  highestCategoryAmount: number
  averageMonthly: number
}

export function SummaryCards({
  totalCurrentMonth,
  totalTransactions,
  highestCategory,
  highestCategoryAmount,
  averageMonthly,
}: SummaryCardsProps) {
  const categoryInfo = getCategoryInfo(highestCategory)

  const cards = [
    {
      title: "Total Expenses",
      subtitle: "Current Month",
      value: formatCurrency(totalCurrentMonth),
      icon: Wallet,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Transactions",
      subtitle: "This Month",
      value: totalTransactions.toString(),
      icon: Receipt,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Highest Category",
      subtitle: categoryInfo.label,
      value: formatCurrency(highestCategoryAmount),
      icon: TrendingUp,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      badge: categoryInfo.icon,
    },
    {
      title: "Monthly Average",
      subtitle: "Last 6 Months",
      value: formatCurrency(averageMonthly),
      icon: BarChart3,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="relative overflow-hidden"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-lg font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {card.badge && <span>{card.badge}</span>}
                  {card.subtitle}
                </p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


