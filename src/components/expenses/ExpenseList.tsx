"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Expense, getCategoryInfo } from "@/types/expense"
import { FileText, Calendar, CreditCard, StickyNote } from "lucide-react"

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card className="opacity-0 animate-slide-up animate-stagger-4">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No expenses yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Start tracking your building expenses by clicking the &quot;Add Building Expense&quot; button above.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const styles = {
      cash: 'bg-emerald-500/10 text-emerald-700',
      bank: 'bg-primary/10 text-primary',
      online: 'bg-violet-500/10 text-violet-700',
    }
    const labels = {
      cash: 'Cash',
      bank: 'Bank',
      online: 'Online',
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[method as keyof typeof styles]}`}>
        {labels[method as keyof typeof labels]}
      </span>
    )
  }

  return (
    <Card className="opacity-0 animate-slide-up animate-stagger-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-violet-500" />
          Recent Expenses
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            {expenses.length} transactions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.map((expense) => {
                const categoryInfo = getCategoryInfo(expense.category)
                return (
                  <tr 
                    key={expense.id} 
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(expense.date)}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span 
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
                          style={{ backgroundColor: categoryInfo.bgColor }}
                        >
                          {categoryInfo.icon}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {categoryInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getPaymentMethodBadge(expense.paymentMethod)}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {expense.notes || '—'}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {expenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category)
            return (
              <div
                key={expense.id}
                className="rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                      style={{ backgroundColor: categoryInfo.bgColor }}
                    >
                      {categoryInfo.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {categoryInfo.label}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-foreground">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                    {getPaymentMethodBadge(expense.paymentMethod)}
                  </div>
                  {expense.notes && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[150px]">
                      <StickyNote className="h-3 w-3 flex-shrink-0" />
                      {expense.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

