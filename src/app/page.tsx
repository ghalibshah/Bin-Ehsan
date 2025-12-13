"use client"

import { useState, useCallback } from "react"
import { IntroAnimation } from "@/components/intro/IntroAnimation"
import { BuildingSelector, BuildingInfo } from "@/components/intro/BuildingSelector"
import { Header } from "@/components/layout/Header"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { ExpenseTrendChart } from "@/components/dashboard/ExpenseTrendChart"
import { CategoryBreakdownChart } from "@/components/dashboard/CategoryBreakdownChart"
import { ExpenseList } from "@/components/expenses/ExpenseList"
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal"
import { Button } from "@/components/ui/button"
import { 
  getBuildingExpenses,
  addExpenseToBuilding,
  getExpenseSummary, 
  getExpenseTrendData, 
  getCategoryBreakdown 
} from "@/data/mockData"
import { createExpense } from "@/lib/api"
import { Expense, ExpenseFormData } from "@/types/expense"
import { Plus, RefreshCw } from "lucide-react"

type AppState = 'intro' | 'select' | 'dashboard'

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleIntroComplete = useCallback(() => {
    setAppState('select')
  }, [])

  const handleBuildingSelect = useCallback((building: BuildingInfo) => {
    setSelectedBuilding(building)
    setExpenses(getBuildingExpenses(building.id))
    setAppState('dashboard')
  }, [])

  const handleSwitchBuilding = useCallback(() => {
    setAppState('select')
  }, [])

  const handleAddExpense = async (data: ExpenseFormData) => {
    if (!selectedBuilding) return
    
    const newExpense = await createExpense(data)
    addExpenseToBuilding(selectedBuilding.id, newExpense)
    setExpenses(prev => [newExpense, ...prev])
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (selectedBuilding) {
      setExpenses(getBuildingExpenses(selectedBuilding.id))
    }
    setIsRefreshing(false)
  }

  // Show intro animation
  if (appState === 'intro') {
    return <IntroAnimation onComplete={handleIntroComplete} />
  }

  // Show building selector
  if (appState === 'select') {
    return <BuildingSelector onSelect={handleBuildingSelect} />
  }

  // Show dashboard
  if (!selectedBuilding) {
    return <BuildingSelector onSelect={handleBuildingSelect} />
  }

  // Calculate summary data
  const summary = getExpenseSummary(expenses)
  const trendData = getExpenseTrendData(expenses)
  const categoryData = getCategoryBreakdown(expenses)

  // Get recent expenses (last 20)
  const recentExpenses = expenses.slice(0, 20)

  // Get theme colors based on building
  const getAccentColor = () => {
    switch (selectedBuilding.color) {
      case 'emerald': return 'hsl(142, 71%, 45%)'
      case 'violet': return 'hsl(262, 83%, 58%)'
      default: return 'hsl(199, 89%, 48%)'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        building={selectedBuilding} 
        onSwitchBuilding={handleSwitchBuilding} 
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of {selectedBuilding.displayName} expenses and transactions
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
            <Button 
              size="lg" 
              onClick={() => setIsAddModalOpen(true)}
              className={`bg-gradient-to-r ${selectedBuilding.gradient} hover:opacity-90 border-0`}
            >
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
          <ExpenseTrendChart data={trendData} accentColor={getAccentColor()} />
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
              © {new Date().getFullYear()} {selectedBuilding.displayName}. All rights reserved.
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
