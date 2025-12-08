"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { ExpenseTrendChart } from "@/components/dashboard/ExpenseTrendChart"
import { CategoryBreakdownChart } from "@/components/dashboard/CategoryBreakdownChart"
import { ExpenseList } from "@/components/expenses/ExpenseList"
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal"
import { Button } from "@/components/ui/button"
import { 
  mockExpenses, 
  getExpenseSummary, 
  getExpenseTrendData, 
  getCategoryBreakdown 
} from "@/data/mockData"
import { createExpense } from "@/lib/api"
import { Expense, ExpenseFormData } from "@/types/expense"
import { Plus, RefreshCw } from "lucide-react"

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate summary data
  const summary = getExpenseSummary(expenses)
  const trendData = getExpenseTrendData(expenses)
  const categoryData = getCategoryBreakdown(expenses)

  // Get recent expenses (last 20)
  const recentExpenses = expenses.slice(0, 20)

  const handleAddExpense = async (data: ExpenseFormData) => {
    const newExpense = await createExpense(data)
    setExpenses(prev => [newExpense, ...prev])
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your building expenses and transactions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hidden sm:flex"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="lg" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Building Expense
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="mb-6 lg:mb-8">
          <SummaryCards
            totalCurrentMonth={summary.totalCurrentMonth}
            totalTransactions={summary.totalTransactions}
            highestCategory={summary.highestCategory}
            highestCategoryAmount={summary.highestCategoryAmount}
            averageMonthly={summary.averageMonthly}
          />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <ExpenseTrendChart data={trendData} />
          <CategoryBreakdownChart data={categoryData} />
        </section>

        {/* Expense List */}
        <section>
          <ExpenseList expenses={recentExpenses} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Bin Ehsan Building. All rights reserved.
            </p>
            <p className="text-xs">
              Building Expense Management System v1.0
            </p>
          </div>
        </div>
      </footer>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}

