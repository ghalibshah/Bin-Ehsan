import { Expense, ExpenseCategory, PaymentMethod } from '@/types/expense'
import { Flat, RentPayment, FlatWithRent, RentStatus } from '@/types/rental'

// Generate realistic mock expenses for a specific building
function generateBuildingExpenses(buildingId: string, seed: number): Expense[] {
  const expenses: Expense[] = []
  
  const buildingMultipliers: Record<string, number> = {
    'bin-ehsan-1': 1,
    'bin-ehsan-2': 1.3,
    'bin-ehsan-3': 1.6,
  }
  
  const multiplier = buildingMultipliers[buildingId] || 1
  
  // Monthly recurring expenses (gas removed)
  const recurringExpenses = [
    { category: 'electricity' as ExpenseCategory, minAmount: 25000, maxAmount: 45000 },
    { category: 'water' as ExpenseCategory, minAmount: 8000, maxAmount: 15000 },
    { category: 'cleaning' as ExpenseCategory, minAmount: 15000, maxAmount: 20000 },
    { category: 'security' as ExpenseCategory, minAmount: 35000, maxAmount: 45000 },
    { category: 'lift' as ExpenseCategory, minAmount: 5000, maxAmount: 8000 },
  ]
  
  const now = new Date()
  const months = 6
  
  const seededRandom = (min: number, max: number, offset: number) => {
    const rand = Math.sin(seed + offset) * 10000
    const normalized = rand - Math.floor(rand)
    return Math.floor(normalized * (max - min) + min)
  }
  
  let offset = 0
  
  for (let m = 0; m < months; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1)
    
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
  
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function getRandomNote(category: ExpenseCategory, rand: number): string {
  const notes: Record<ExpenseCategory, string[]> = {
    electricity: ['Monthly K-Electric bill', 'Electricity bill - peak hours adjustment', 'Common areas electricity'],
    water: ['Monthly KWSB bill', 'Water tanker service', 'Water supply charges'],
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

// Generate flats for a building
function generateBuildingFlats(buildingId: string, flatCount: number, seed: number): Flat[] {
  const flats: Flat[] = []
  const types: Flat['type'][] = ['studio', '1bed', '2bed', '3bed', 'penthouse']
  const firstNames = ['Ahmed', 'Muhammad', 'Ali', 'Hassan', 'Usman', 'Bilal', 'Zain', 'Omar', 'Faisal', 'Imran']
  const lastNames = ['Khan', 'Ahmed', 'Ali', 'Hussain', 'Shah', 'Malik', 'Qureshi', 'Syed', 'Mirza', 'Iqbal']
  
  const seededRandom = (min: number, max: number, offset: number) => {
    const rand = Math.sin(seed + offset) * 10000
    const normalized = rand - Math.floor(rand)
    return Math.floor(normalized * (max - min) + min)
  }
  
  const floorsPerBuilding: Record<string, number> = {
    'bin-ehsan-1': 4,
    'bin-ehsan-2': 5,
    'bin-ehsan-3': 6,
  }
  
  const floors = floorsPerBuilding[buildingId] || 4
  let offset = 0
  let flatIndex = 0
  
  for (let floor = 1; floor <= floors; floor++) {
    const flatsOnFloor = floor === floors ? 1 : 2 // Penthouse on top floor
    
    for (let f = 0; f < flatsOnFloor && flatIndex < flatCount; f++) {
      const flatNumber = `${floor}0${f + 1}`
      const isOccupied = seededRandom(0, 10, offset++) > 2 // 70% occupied
      const type = floor === floors ? 'penthouse' : types[seededRandom(0, 4, offset++)]
      
      const rentByType: Record<Flat['type'], number> = {
        'studio': 25000,
        '1bed': 35000,
        '2bed': 50000,
        '3bed': 70000,
        'penthouse': 120000,
      }
      
      flats.push({
        id: `${buildingId}-flat-${flatNumber}`,
        flatNumber,
        floor,
        type,
        tenantName: isOccupied ? `${firstNames[seededRandom(0, 10, offset++)]} ${lastNames[seededRandom(0, 10, offset++)]}` : null,
        tenantPhone: isOccupied ? `03${seededRandom(0, 10, offset++)}${seededRandom(1000000, 9999999, offset++)}` : null,
        monthlyRent: rentByType[type],
        isOccupied,
      })
      
      flatIndex++
    }
  }
  
  return flats
}

// Generate rent payments for flats
function generateRentPayments(flats: Flat[], seed: number): RentPayment[] {
  const payments: RentPayment[] = []
  const now = new Date()
  
  const seededRandom = (min: number, max: number, offset: number) => {
    const rand = Math.sin(seed + offset) * 10000
    const normalized = rand - Math.floor(rand)
    return Math.floor(normalized * (max - min) + min)
  }
  
  let offset = 0
  
  // Generate 6 months of payment history
  for (let m = 0; m < 6; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1)
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    
    flats.forEach(flat => {
      if (!flat.isOccupied) return
      
      const statusRoll = seededRandom(0, 100, offset++)
      let status: RentStatus
      let paidAmount = flat.monthlyRent
      let paidDate: string | null = null
      
      if (m === 0) {
        // Current month - more variety
        if (statusRoll < 50) {
          status = 'paid'
          paidDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), seededRandom(1, 10, offset++)).toISOString().split('T')[0]
        } else if (statusRoll < 75) {
          status = 'pending'
        } else if (statusRoll < 90) {
          status = 'partial'
          paidAmount = Math.floor(flat.monthlyRent * (seededRandom(3, 7, offset++) / 10))
          paidDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), seededRandom(5, 15, offset++)).toISOString().split('T')[0]
        } else {
          status = 'overdue'
        }
      } else {
        // Past months - mostly paid
        if (statusRoll < 85) {
          status = 'paid'
          paidDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), seededRandom(1, 28, offset++)).toISOString().split('T')[0]
        } else if (statusRoll < 95) {
          status = 'partial'
          paidAmount = Math.floor(flat.monthlyRent * (seededRandom(5, 9, offset++) / 10))
          paidDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), seededRandom(1, 28, offset++)).toISOString().split('T')[0]
        } else {
          status = 'paid' // Even overdue eventually gets paid
          paidDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, seededRandom(1, 15, offset++)).toISOString().split('T')[0]
        }
      }
      
      payments.push({
        id: `${flat.id}-rent-${monthKey}`,
        flatId: flat.id,
        amount: status === 'pending' || status === 'overdue' ? 0 : paidAmount,
        month: monthKey,
        paidDate,
        status,
        notes: status === 'partial' ? 'Partial payment received' : undefined,
      })
    })
  }
  
  return payments
}

// Building data cache
const buildingSeeds: Record<string, number> = {
  'bin-ehsan-1': 12345,
  'bin-ehsan-2': 67890,
  'bin-ehsan-3': 11223,
}

const buildingFlatCounts: Record<string, number> = {
  'bin-ehsan-1': 8,
  'bin-ehsan-2': 10,
  'bin-ehsan-3': 12,
}

const buildingExpensesCache: Record<string, Expense[]> = {}
const buildingFlatsCache: Record<string, Flat[]> = {}
const buildingRentPaymentsCache: Record<string, RentPayment[]> = {}

// Expense functions
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

// Flat functions
export function getBuildingFlats(buildingId: string): Flat[] {
  if (!buildingFlatsCache[buildingId]) {
    const seed = buildingSeeds[buildingId] || Math.random() * 100000
    const flatCount = buildingFlatCounts[buildingId] || 8
    buildingFlatsCache[buildingId] = generateBuildingFlats(buildingId, flatCount, seed)
  }
  return buildingFlatsCache[buildingId]
}

export function getBuildingRentPayments(buildingId: string): RentPayment[] {
  if (!buildingRentPaymentsCache[buildingId]) {
    const flats = getBuildingFlats(buildingId)
    const seed = buildingSeeds[buildingId] || Math.random() * 100000
    buildingRentPaymentsCache[buildingId] = generateRentPayments(flats, seed + 1000)
  }
  return buildingRentPaymentsCache[buildingId]
}

export function getFlatsWithRentStatus(buildingId: string): FlatWithRent[] {
  const flats = getBuildingFlats(buildingId)
  const payments = getBuildingRentPayments(buildingId)
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  return flats.map(flat => {
    const flatPayments = payments.filter(p => p.flatId === flat.id)
    const currentPayment = flatPayments.find(p => p.month === currentMonth)
    const lastPaidPayment = flatPayments.filter(p => p.paidDate).sort((a, b) => 
      new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime()
    )[0]
    
    const unpaidPayments = flatPayments.filter(p => p.status === 'pending' || p.status === 'overdue' || p.status === 'partial')
    const totalDue = unpaidPayments.reduce((sum, p) => sum + (flat.monthlyRent - p.amount), 0)
    
    return {
      ...flat,
      currentMonthStatus: flat.isOccupied ? (currentPayment?.status || 'pending') : 'paid',
      lastPaymentDate: lastPaidPayment?.paidDate || null,
      totalDue: flat.isOccupied ? totalDue : 0,
    }
  })
}

export function addFlatToBuilding(buildingId: string, flat: Flat): void {
  if (!buildingFlatsCache[buildingId]) {
    getBuildingFlats(buildingId)
  }
  buildingFlatsCache[buildingId] = [...buildingFlatsCache[buildingId], flat]
}

export function removeFlatFromBuilding(buildingId: string, flatId: string): void {
  if (!buildingFlatsCache[buildingId]) {
    getBuildingFlats(buildingId)
  }
  buildingFlatsCache[buildingId] = buildingFlatsCache[buildingId].filter(f => f.id !== flatId)
}

export function updateFlatInBuilding(buildingId: string, flatId: string, updates: Partial<Flat>): Flat | null {
  if (!buildingFlatsCache[buildingId]) {
    getBuildingFlats(buildingId)
  }
  
  const index = buildingFlatsCache[buildingId].findIndex(f => f.id === flatId)
  if (index === -1) return null
  
  const updatedFlat = { ...buildingFlatsCache[buildingId][index], ...updates }
  buildingFlatsCache[buildingId][index] = updatedFlat
  return updatedFlat
}

export function addRentPayment(buildingId: string, payment: RentPayment): void {
  if (!buildingRentPaymentsCache[buildingId]) {
    getBuildingRentPayments(buildingId)
  }
  
  // Check if payment for this flat/month already exists and update it
  const existingIndex = buildingRentPaymentsCache[buildingId].findIndex(
    p => p.flatId === payment.flatId && p.month === payment.month
  )
  
  if (existingIndex !== -1) {
    buildingRentPaymentsCache[buildingId][existingIndex] = payment
  } else {
    buildingRentPaymentsCache[buildingId] = [payment, ...buildingRentPaymentsCache[buildingId]]
  }
}

// Legacy export
export const mockExpenses = getBuildingExpenses('bin-ehsan-1')

// Statistics functions
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
  
  const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<ExpenseCategory, number>)
  
  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [category, total]) => total > max.total ? { category, total } : max,
    { category: 'other', total: 0 }
  )
  
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

export function getExpenseTrendData(expenses: Expense[]) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
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

// Rental statistics
export function getRentalSummary(buildingId: string) {
  const flatsWithRent = getFlatsWithRentStatus(buildingId)
  
  const totalFlats = flatsWithRent.length
  const occupiedFlats = flatsWithRent.filter(f => f.isOccupied).length
  const vacantFlats = totalFlats - occupiedFlats
  
  const paidCount = flatsWithRent.filter(f => f.currentMonthStatus === 'paid').length
  const pendingCount = flatsWithRent.filter(f => f.currentMonthStatus === 'pending').length
  const overdueCount = flatsWithRent.filter(f => f.currentMonthStatus === 'overdue').length
  const partialCount = flatsWithRent.filter(f => f.currentMonthStatus === 'partial').length
  
  const expectedRent = flatsWithRent.filter(f => f.isOccupied).reduce((sum, f) => sum + f.monthlyRent, 0)
  const collectedRent = flatsWithRent.filter(f => f.currentMonthStatus === 'paid').reduce((sum, f) => sum + f.monthlyRent, 0)
  const totalDue = flatsWithRent.reduce((sum, f) => sum + f.totalDue, 0)
  
  return {
    totalFlats,
    occupiedFlats,
    vacantFlats,
    paidCount,
    pendingCount,
    overdueCount,
    partialCount,
    expectedRent,
    collectedRent,
    totalDue,
    collectionRate: expectedRent > 0 ? Math.round((collectedRent / expectedRent) * 100) : 0,
  }
}
