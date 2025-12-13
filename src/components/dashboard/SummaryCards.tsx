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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="relative overflow-hidden opacity-0 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {card.badge && <span>{card.badge}</span>}
                  {card.subtitle}
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </Card>
      ))}
    </div>
  )
}


