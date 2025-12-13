"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Expense, getCategoryInfo, EXPENSE_CATEGORIES, ExpenseCategory } from "@/types/expense"
import { 
  FileText, 
  Calendar, 
  CreditCard, 
  StickyNote, 
  Search, 
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react"

interface ExpenseListProps {
  expenses: Expense[]
}

type SortField = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

export function ExpenseList({ expenses }: ExpenseListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(expense => {
        const categoryInfo = getCategoryInfo(expense.category)
        return (
          categoryInfo.label.toLowerCase().includes(query) ||
          expense.notes?.toLowerCase().includes(query) ||
          expense.amount.toString().includes(query) ||
          formatDate(expense.date).toLowerCase().includes(query)
        )
      })
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(expense => expense.category === categoryFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [expenses, searchQuery, categoryFilter, sortField, sortOrder])

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-violet-500" />
              Recent Expenses
              <span className="text-xs font-normal text-muted-foreground ml-2">
                {filteredExpenses.length} of {expenses.length} transactions
              </span>
            </CardTitle>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 flex items-center gap-1">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as ExpenseCategory | "all")}
              >
                <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs">
                  <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Categories</SelectItem>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{category.icon}</span>
                        <span>{category.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoryFilter !== "all" && (
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear category filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-1">
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split('-') as [SortField, SortOrder]
                  setSortField(field)
                  setSortOrder(order)
                }}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc" className="text-xs">
                    <span className="flex items-center gap-1.5">
                      <ArrowDown className="h-3 w-3" />
                      Date (Newest)
                    </span>
                  </SelectItem>
                  <SelectItem value="date-asc" className="text-xs">
                    <span className="flex items-center gap-1.5">
                      <ArrowUp className="h-3 w-3" />
                      Date (Oldest)
                    </span>
                  </SelectItem>
                  <SelectItem value="amount-desc" className="text-xs">
                    <span className="flex items-center gap-1.5">
                      <ArrowDown className="h-3 w-3" />
                      Amount (High)
                    </span>
                  </SelectItem>
                  <SelectItem value="amount-asc" className="text-xs">
                    <span className="flex items-center gap-1.5">
                      <ArrowUp className="h-3 w-3" />
                      Amount (Low)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {(sortField !== "date" || sortOrder !== "desc") && (
                <button
                  onClick={() => { setSortField("date"); setSortOrder("desc"); }}
                  className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Reset sort"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {expenses.length === 0 ? (
          <div className="py-16">
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
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                No matching expenses
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Scrollable */}
            <div className="hidden md:block">
              <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border">
                <table className="w-full">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
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
                  <tbody className="divide-y divide-border bg-background">
                    {filteredExpenses.map((expense) => {
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
            </div>

            {/* Mobile Card View - Scrollable */}
            <div className="md:hidden max-h-[500px] overflow-y-auto space-y-3 pr-1">
              {filteredExpenses.map((expense) => {
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
