"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Wallet, Receipt, TrendingUp, BarChart3 } from "lucide-react"

interface IncomeSummaryCardsProps {
  totalCurrentMonth: number
  totalTransactions: number
  highestTypeLabel: string
  highestTypeAmount: number
  averageMonthly: number
}

export function IncomeSummaryCards({
  totalCurrentMonth,
  totalTransactions,
  highestTypeLabel,
  highestTypeAmount,
  averageMonthly,
}: IncomeSummaryCardsProps) {
  const cards = [
    {
      title: "Total income",
      subtitle: "Current month",
      value: formatCurrency(totalCurrentMonth),
      icon: Wallet,
    },
    {
      title: "Entries",
      subtitle: "This month",
      value: totalTransactions.toString(),
      icon: Receipt,
    },
    {
      title: "Highest type",
      subtitle: highestTypeLabel,
      value: formatCurrency(highestTypeAmount),
      icon: TrendingUp,
    },
    {
      title: "Monthly average",
      subtitle: "Last 6 months",
      value: formatCurrency(averageMonthly),
      icon: BarChart3,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {card.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <card.icon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
