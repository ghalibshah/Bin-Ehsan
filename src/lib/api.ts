/**
 * API Placeholder Functions
 * 
 * These functions are placeholders for future Supabase integration.
 * Currently, they simulate API calls with mock data.
 * 
 * Structure for each building's data:
 * - bin-ehsan-1: /buildings/bin-ehsan-1/
 * - bin-ehsan-2: /buildings/bin-ehsan-2/
 * - bin-ehsan-3: /buildings/bin-ehsan-3/
 * 
 * Each building has:
 * - expenses: Expense records
 * - flats: Flat/unit information
 * - rent_payments: Rent payment history
 * - settings: Building-specific settings
 */

import { Expense, ExpenseFormData, ExpenseCategory } from '@/types/expense'
import { Flat, RentPayment, RentStatus } from '@/types/rental'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ============================================
// EXPENSE API FUNCTIONS
// ============================================

/**
 * Fetch all expenses for a building
 * TODO: Replace with Supabase query
 * 
 * Future implementation:
 * const { data, error } = await supabase
 *   .from('expenses')
 *   .select('*')
 *   .eq('building_id', buildingId)
 *   .order('date', { ascending: false })
 */
export async function fetchBuildingExpenses(buildingId: string): Promise<Expense[]> {
  await delay(500)
  throw new Error('Not implemented - using mock data')
}

/**
 * Create a new expense
 * TODO: Replace with Supabase insert
 */
export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  await delay(800)
  
  const newExpense: Expense = {
    id: `exp-${Date.now()}`,
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.date,
    paymentMethod: data.paymentMethod,
    notes: data.notes || undefined,
    createdAt: new Date().toISOString(),
  }
  
  console.log('Created expense:', newExpense)
  return newExpense
}

/**
 * Update an existing expense
 * TODO: Replace with Supabase update
 */
export async function updateExpense(buildingId: string, expenseId: string, data: Partial<ExpenseFormData>): Promise<Expense> {
  await delay(500)
  throw new Error('Not implemented')
}

/**
 * Delete an expense
 * TODO: Replace with Supabase delete
 */
export async function deleteExpense(buildingId: string, expenseId: string): Promise<void> {
  await delay(500)
  console.log('Deleted expense:', expenseId)
}

// ============================================
// FLAT / RENTAL API FUNCTIONS
// ============================================

/**
 * Fetch all flats for a building
 * TODO: Replace with Supabase query
 * 
 * Future implementation:
 * const { data, error } = await supabase
 *   .from('flats')
 *   .select('*')
 *   .eq('building_id', buildingId)
 *   .order('flat_number')
 */
export async function fetchBuildingFlats(buildingId: string): Promise<Flat[]> {
  await delay(500)
  throw new Error('Not implemented - using mock data')
}

/**
 * Create a new flat
 * TODO: Replace with Supabase insert
 */
export async function createFlat(buildingId: string, data: Omit<Flat, 'id'>): Promise<Flat> {
  await delay(500)
  
  const newFlat: Flat = {
    ...data,
    id: `${buildingId}-flat-${Date.now()}`,
  }
  
  console.log('Created flat:', newFlat)
  return newFlat
}

/**
 * Update a flat
 * TODO: Replace with Supabase update
 */
export async function updateFlat(buildingId: string, flatId: string, data: Partial<Flat>): Promise<Flat> {
  await delay(500)
  throw new Error('Not implemented')
}

/**
 * Delete a flat
 * TODO: Replace with Supabase delete
 */
export async function deleteFlat(buildingId: string, flatId: string): Promise<void> {
  await delay(500)
  console.log('Deleted flat:', flatId)
}

// ============================================
// RENT PAYMENT API FUNCTIONS
// ============================================

/**
 * Fetch rent payments for a building
 * TODO: Replace with Supabase query
 */
export async function fetchRentPayments(buildingId: string): Promise<RentPayment[]> {
  await delay(500)
  throw new Error('Not implemented - using mock data')
}

/**
 * Record a rent payment
 * TODO: Replace with Supabase insert/update
 */
export async function recordRentPayment(
  buildingId: string, 
  flatId: string, 
  data: { amount: number; month: string; status: RentStatus; notes?: string }
): Promise<RentPayment> {
  await delay(500)
  
  const payment: RentPayment = {
    id: `${flatId}-rent-${data.month}`,
    flatId,
    amount: data.amount,
    month: data.month,
    paidDate: data.status === 'paid' ? new Date().toISOString().split('T')[0] : null,
    status: data.status,
    notes: data.notes,
  }
  
  console.log('Recorded rent payment:', payment)
  return payment
}

// ============================================
// SETTINGS API FUNCTIONS
// ============================================

/**
 * Fetch building settings
 * TODO: Replace with Supabase query
 */
export async function fetchBuildingSettings(buildingId: string): Promise<{
  expenseCategories: ExpenseCategory[]
  customExpenseTypes: string[]
}> {
  await delay(300)
  throw new Error('Not implemented - using mock data')
}

/**
 * Update building settings
 * TODO: Replace with Supabase update
 */
export async function updateBuildingSettings(
  buildingId: string, 
  data: { customExpenseTypes?: string[] }
): Promise<void> {
  await delay(500)
  console.log('Updated settings for building:', buildingId, data)
}

// ============================================
// SUPABASE INITIALIZATION (Future)
// ============================================

/**
 * Future Supabase client initialization
 * 
 * import { createClient } from '@supabase/supabase-js'
 * 
 * const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
 * const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 * 
 * export const supabase = createClient(supabaseUrl, supabaseAnonKey)
 * 
 * Database Tables Structure:
 * 
 * buildings:
 *   - id (uuid, primary key)
 *   - name (text)
 *   - address (text)
 *   - created_at (timestamp)
 * 
 * expenses:
 *   - id (uuid, primary key)
 *   - building_id (uuid, foreign key)
 *   - amount (numeric)
 *   - category (text)
 *   - date (date)
 *   - payment_method (text)
 *   - notes (text, nullable)
 *   - created_at (timestamp)
 * 
 * flats:
 *   - id (uuid, primary key)
 *   - building_id (uuid, foreign key)
 *   - flat_number (text)
 *   - floor (integer)
 *   - type (text)
 *   - monthly_rent (numeric)
 *   - tenant_name (text, nullable)
 *   - tenant_phone (text, nullable)
 *   - is_occupied (boolean)
 *   - created_at (timestamp)
 * 
 * rent_payments:
 *   - id (uuid, primary key)
 *   - flat_id (uuid, foreign key)
 *   - amount (numeric)
 *   - month (text)
 *   - paid_date (date, nullable)
 *   - status (text)
 *   - notes (text, nullable)
 *   - created_at (timestamp)
 * 
 * building_settings:
 *   - building_id (uuid, primary key, foreign key)
 *   - custom_expense_types (jsonb)
 *   - updated_at (timestamp)
 */
