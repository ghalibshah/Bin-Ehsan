import { Expense, ExpenseCategory, PaymentMethod } from '@/types/expense'

// Generate realistic mock expenses for a specific building
function generateBuildingExpenses(buildingId: string, seed: number): Expense[] {
  const expenses: Expense[] = []
  
  // Different expense patterns for different buildings
  const buildingMultipliers: Record<string, number> = {
    'bin-ehsan-1': 1,
    'bin-ehsan-2': 1.3,
    'bin-ehsan-3': 1.6,
  }
  
  const multiplier = buildingMultipliers[buildingId] || 1
  
  // Monthly recurring expenses
  const recurringExpenses = [
    { category: 'electricity' as ExpenseCategory, minAmount: 25000, maxAmount: 45000 },
    { category: 'water' as ExpenseCategory, minAmount: 8000, maxAmount: 15000 },
    { category: 'gas' as ExpenseCategory, minAmount: 12000, maxAmount: 22000 },
    { category: 'cleaning' as ExpenseCategory, minAmount: 15000, maxAmount: 20000 },
    { category: 'security' as ExpenseCategory, minAmount: 35000, maxAmount: 45000 },
    { category: 'lift' as ExpenseCategory, minAmount: 5000, maxAmount: 8000 },
  ]
  
  // Generate 6 months of data
  const now = new Date()
  const months = 6
  
  // Use seed to create consistent but different data per building
  const seededRandom = (min: number, max: number, offset: number) => {
    const rand = Math.sin(seed + offset) * 10000
    const normalized = rand - Math.floor(rand)
    return Math.floor(normalized * (max - min) + min)
  }
  
  let offset = 0
  
  for (let m = 0; m < months; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1)
    
    // Add recurring monthly expenses
    recurringExpenses.forEach((expense, index) => {
      const randomDay = seededRandom(1, 25, offset++)
      const expenseDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), randomDay)
      
      if (expenseDate <= now) {
        const amount = seededRandom(expense.minAmount, expense.maxAmount, offset++) * multiplier
        expenses.push({
          id: `${buildingId}-exp-${m}-${index}`,
          amount: Math.floor(amount),
          category: expense.category,
          date: expenseDate.toISOString().split('T')[0],
          paymentMethod: ['cash', 'bank', 'online'][seededRandom(0, 3, offset++)] as PaymentMethod,
          notes: getRandomNote(expense.category, seededRandom(0, 100, offset++)),
          createdAt: expenseDate.toISOString(),
        })
      }
    })
    
    // Add random maintenance/repair expenses
    const randomExpenses = seededRandom(1, 4, offset++)
    for (let r = 0; r < randomExpenses; r++) {
      const isRepair = seededRandom(0, 2, offset++) === 1
      const randomDay = seededRandom(1, 28, offset++)
      const expenseDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), randomDay)
      
      if (expenseDate <= now) {
        const amount = isRepair 
          ? seededRandom(5000, 25000, offset++) * multiplier
          : seededRandom(3000, 18000, offset++) * multiplier
        expenses.push({
          id: `${buildingId}-exp-${m}-extra-${r}`,
          amount: Math.floor(amount),
          category: isRepair ? 'repairs' : 'maintenance',
          date: expenseDate.toISOString().split('T')[0],
          paymentMethod: ['cash', 'bank', 'online'][seededRandom(0, 3, offset++)] as PaymentMethod,
          notes: isRepair ? getRepairNote(seededRandom(0, 100, offset++)) : getMaintenanceNote(seededRandom(0, 100, offset++)),
          createdAt: expenseDate.toISOString(),
        })
      }
    }
  }
  
  // Sort by date descending
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function getRandomNote(category: ExpenseCategory, rand: number): string {
  const notes: Record<ExpenseCategory, string[]> = {
    electricity: ['Monthly K-Electric bill', 'Electricity bill - peak hours adjustment', 'Common areas electricity'],
    water: ['Monthly KWSB bill', 'Water tanker service', 'Water supply charges'],
    gas: ['SSGC monthly bill', 'Gas bill - winter adjustment', 'Common kitchen gas charges'],
    maintenance: ['General maintenance', 'Building upkeep', 'Monthly maintenance work'],
    cleaning: ['Monthly cleaning service', 'Deep cleaning service', 'Cleaning supplies'],
    security: ['Security guard salaries', 'Security service charges', 'Security equipment'],
    repairs: ['Repair work', 'Emergency repairs', 'Scheduled repairs'],
    lift: ['Elevator maintenance', 'Lift service charges', 'Elevator inspection'],
    other: ['Miscellaneous expenses', 'Administrative costs', 'Other building expenses'],
  }
  
  const categoryNotes = notes[category]
  return categoryNotes[rand % categoryNotes.length]
}

function getRepairNote(rand: number): string {
  const notes = [
    'Water pump motor repair',
    'Electrical panel repair',
    'Plumbing fixes - 3rd floor',
    'Gate motor replacement',
    'Intercom system repair',
    'Water tank cleaning and repair',
    'Roof waterproofing',
    'Boundary wall repair',
    'Parking area repairs',
    'Staircase railing repair',
  ]
  return notes[rand % notes.length]
}

function getMaintenanceNote(rand: number): string {
  const notes = [
    'Garden maintenance',
    'Pest control service',
    'Fire extinguisher refill',
    'Common area painting',
    'Water tank cleaning',
    'Drainage cleaning',
    'Generator maintenance',
    'CCTV maintenance',
    'Building inspection',
    'Emergency light batteries',
  ]
  return notes[rand % notes.length]
}

// Pre-generate expenses for all buildings
const buildingSeeds: Record<string, number> = {
  'bin-ehsan-1': 12345,
  'bin-ehsan-2': 67890,
  'bin-ehsan-3': 11223,
}

const buildingExpensesCache: Record<string, Expense[]> = {}

export function getBuildingExpenses(buildingId: string): Expense[] {
  if (!buildingExpensesCache[buildingId]) {
    const seed = buildingSeeds[buildingId] || Math.random() * 100000
    buildingExpensesCache[buildingId] = generateBuildingExpenses(buildingId, seed)
  }
  return buildingExpensesCache[buildingId]
}

export function addExpenseToBuilding(buildingId: string, expense: Expense): void {
  if (!buildingExpensesCache[buildingId]) {
    getBuildingExpenses(buildingId)
  }
  buildingExpensesCache[buildingId] = [expense, ...buildingExpensesCache[buildingId]]
}

// Legacy export for backwards compatibility
export const mockExpenses = getBuildingExpenses('bin-ehsan-1')

// Calculate summary statistics
export function getExpenseSummary(expenses: Expense[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
  })
  
  const totalCurrentMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalTransactions = currentMonthExpenses.length
  
  // Calculate category totals
  const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<ExpenseCategory, number>)
  
  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [category, total]) => total > max.total ? { category, total } : max,
    { category: 'other', total: 0 }
  )
  
  // Calculate average monthly expense
  const monthlyTotals = expenses.reduce((acc, exp) => {
    const expDate = new Date(exp.date)
    const key = `${expDate.getFullYear()}-${expDate.getMonth()}`
    acc[key] = (acc[key] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)
  
  const monthlyValues = Object.values(monthlyTotals)
  const averageMonthly = monthlyValues.length > 0 
    ? monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length 
    : 0
  
  return {
    totalCurrentMonth,
    totalTransactions,
    highestCategory: highestCategory.category as ExpenseCategory,
    highestCategoryAmount: highestCategory.total,
    averageMonthly,
  }
}

// Get expense trend data for charts
export function getExpenseTrendData(expenses: Expense[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Get daily totals for last 30 days
  const dailyTotals: Record<string, number> = {}
  
  for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    dailyTotals[dateStr] = 0
  }
  
  expenses.forEach(exp => {
    if (dailyTotals.hasOwnProperty(exp.date)) {
      dailyTotals[exp.date] += exp.amount
    }
  })
  
  return Object.entries(dailyTotals).map(([date, amount]) => ({
    date,
    amount,
    formattedDate: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
  }))
}

// Get category breakdown data for charts
export function getCategoryBreakdown(expenses: Expense[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
  })
  
  const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<ExpenseCategory, number>)
  
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
}
