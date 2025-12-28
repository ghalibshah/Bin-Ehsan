"use client"

import { useState, useCallback } from "react"
import { IntroAnimation } from "@/components/intro/IntroAnimation"
import { BuildingSelector, BuildingInfo } from "@/components/intro/BuildingSelector"
import { Header } from "@/components/layout/Header"
import { Sidebar, NavItem } from "@/components/layout/Sidebar"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { ExpenseTrendChart } from "@/components/dashboard/ExpenseTrendChart"
import { CategoryBreakdownChart } from "@/components/dashboard/CategoryBreakdownChart"
import { ExpenseList } from "@/components/expenses/ExpenseList"
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal"
import { RentalDashboard } from "@/components/rental/RentalDashboard"
import { SettingsPage } from "@/components/settings/SettingsPage"
import { Button } from "@/components/ui/button"
import { 
  getBuildingExpenses,
  addExpenseToBuilding,
  getExpenseSummary, 
  getExpenseTrendData, 
  getCategoryBreakdown,
  getFlatsWithRentStatus,
  getRentalSummary,
  getBuildingFlats,
  getBuildingRentPayments,
  addFlatToBuilding,
  removeFlatFromBuilding,
  updateFlatInBuilding,
  addRentPayment,
} from "@/data/mockData"
import { createExpense } from "@/lib/api"
import { Expense, ExpenseFormData } from "@/types/expense"
import { Flat, RentPayment, RentStatus } from "@/types/rental"
import { Plus, RefreshCw } from "lucide-react"

type AppState = 'intro' | 'select' | 'dashboard'

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null)
  const [activeNav, setActiveNav] = useState<NavItem>('expenses')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [flats, setFlats] = useState<Flat[]>([])
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleIntroComplete = useCallback(() => {
    setAppState('select')
  }, [])

  const handleBuildingSelect = useCallback((building: BuildingInfo) => {
    setSelectedBuilding(building)
    setExpenses(getBuildingExpenses(building.id))
    setFlats(getBuildingFlats(building.id))
    setRentPayments(getBuildingRentPayments(building.id))
    setActiveNav('expenses')
    setAppState('dashboard')
  }, [])

  const handleSwitchBuilding = useCallback(() => {
    setAppState('select')
  }, [])

  const handleNavigation = useCallback((item: NavItem) => {
    setActiveNav(item)
  }, [])

  const handleAddExpense = async (data: ExpenseFormData) => {
    if (!selectedBuilding) return
    
    const newExpense = await createExpense(data)
    addExpenseToBuilding(selectedBuilding.id, newExpense)
    setExpenses(prev => [newExpense, ...prev])
  }

  const handleAddFlat = (flatData: Omit<Flat, 'id'>) => {
    if (!selectedBuilding) return
    
    const newFlat: Flat = {
      ...flatData,
      id: `${selectedBuilding.id}-flat-${Date.now()}`,
    }
    addFlatToBuilding(selectedBuilding.id, newFlat)
    setFlats(prev => [...prev, newFlat])
  }

  const handleRemoveFlat = (flatId: string) => {
    if (!selectedBuilding) return
    
    removeFlatFromBuilding(selectedBuilding.id, flatId)
    setFlats(prev => prev.filter(f => f.id !== flatId))
  }

  const handleEditFlat = async (flatId: string, updates: Partial<Flat>) => {
    if (!selectedBuilding) return
    
    const updatedFlat = updateFlatInBuilding(selectedBuilding.id, flatId, updates)
    if (updatedFlat) {
      setFlats(prev => prev.map(f => f.id === flatId ? updatedFlat : f))
      setRefreshKey(prev => prev + 1) // Force refresh of flatsWithRent
    }
  }

  const handleRecordPayment = async (data: { 
    flatId: string
    amount: number
    status: RentStatus
    month: string
    notes?: string 
  }) => {
    if (!selectedBuilding) return
    
    const payment: RentPayment = {
      id: `${data.flatId}-rent-${data.month}-${Date.now()}`,
      flatId: data.flatId,
      amount: data.amount,
      month: data.month,
      paidDate: data.status === 'paid' || data.status === 'partial' 
        ? new Date().toISOString().split('T')[0] 
        : null,
      status: data.status,
      notes: data.notes,
    }
    
    addRentPayment(selectedBuilding.id, payment)
    setRentPayments(getBuildingRentPayments(selectedBuilding.id))
    setRefreshKey(prev => prev + 1) // Force refresh
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (selectedBuilding) {
      setExpenses(getBuildingExpenses(selectedBuilding.id))
      setFlats(getBuildingFlats(selectedBuilding.id))
      setRentPayments(getBuildingRentPayments(selectedBuilding.id))
      setRefreshKey(prev => prev + 1)
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

  // Calculate data
  const summary = getExpenseSummary(expenses)
  const trendData = getExpenseTrendData(expenses)
  const categoryData = getCategoryBreakdown(expenses)
  const recentExpenses = expenses.slice(0, 20)
  const flatsWithRent = getFlatsWithRentStatus(selectedBuilding.id)
  const rentalSummary = getRentalSummary(selectedBuilding.id)

  const getAccentColor = () => {
    switch (selectedBuilding.color) {
      case 'emerald': return 'hsl(142, 71%, 45%)'
      case 'violet': return 'hsl(262, 83%, 58%)'
      default: return 'hsl(199, 89%, 48%)'
    }
  }

  const getPageTitle = () => {
    switch (activeNav) {
      case 'expenses': return 'General Expenses'
      case 'rental': return 'Rental Management'
      case 'settings': return 'Settings'
    }
  }

  const getPageDescription = () => {
    switch (activeNav) {
      case 'expenses': return `Track and manage ${selectedBuilding.displayName} expenses`
      case 'rental': return `Manage flats and rent collection for ${selectedBuilding.displayName}`
      case 'settings': return `Configure ${selectedBuilding.displayName} settings`
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        building={selectedBuilding} 
        onSwitchBuilding={handleSwitchBuilding} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeItem={activeNav}
          onNavigate={handleNavigation}
          buildingName={selectedBuilding.displayName}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-8 lg:px-10 py-5">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                  {getPageTitle()}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getPageDescription()}
                </p>
              </div>
              
              {activeNav === 'expenses' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-8 text-xs"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setIsAddModalOpen(true)}
                    className={`bg-gradient-to-r ${selectedBuilding.gradient} hover:opacity-90 border-0 h-8 text-xs`}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Add Expense
                  </Button>
                </div>
              )}
            </div>

            {/* Content based on active nav */}
            {activeNav === 'expenses' && (
              <div className="space-y-5">
                <SummaryCards
                  totalCurrentMonth={summary.totalCurrentMonth}
                  totalTransactions={summary.totalTransactions}
                  highestCategory={summary.highestCategory}
                  highestCategoryAmount={summary.highestCategoryAmount}
                  averageMonthly={summary.averageMonthly}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <ExpenseTrendChart data={trendData} accentColor={getAccentColor()} />
                  <CategoryBreakdownChart data={categoryData} />
                </div>

                <ExpenseList expenses={recentExpenses} />
              </div>
            )}

            {activeNav === 'rental' && (
              <RentalDashboard 
                key={refreshKey}
                summary={rentalSummary}
                flats={flatsWithRent}
                rentPayments={rentPayments}
                onRecordPayment={handleRecordPayment}
                onEditFlat={handleEditFlat}
              />
            )}

            {activeNav === 'settings' && (
              <SettingsPage
                buildingId={selectedBuilding.id}
                buildingName={selectedBuilding.displayName}
                flats={flats}
                onAddFlat={handleAddFlat}
                onRemoveFlat={handleRemoveFlat}
                onEditFlat={handleEditFlat}
              />
            )}
          </div>
        </main>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}
