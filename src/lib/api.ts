/**
 * API Placeholder Functions
 * 
 * These functions are placeholders for future Supabase integration.
 * Currently, they simulate API calls with mock data.
 */

import { Expense, ExpenseFormData } from '@/types/expense'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch all expenses
 * TODO: Replace with Supabase query
 */
export async function fetchExpenses(): Promise<Expense[]> {
  await delay(500)
  // In the future, this will be:
  // const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false })
  throw new Error('Not implemented - using mock data')
}

/**
 * Create a new expense
 * TODO: Replace with Supabase insert
 */
export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  await delay(800)
  
  // In the future, this will be:
  // const { data: expense, error } = await supabase.from('expenses').insert({
  //   amount: parseFloat(data.amount),
  //   category: data.category,
  //   date: data.date,
  //   payment_method: data.paymentMethod,
  //   notes: data.notes,
  // }).single()
  
  // For now, simulate successful creation
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
export async function updateExpense(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
  await delay(500)
  
  // In the future, this will be:
  // const { data: expense, error } = await supabase.from('expenses').update({
  //   ...data,
  // }).eq('id', id).single()
  
  throw new Error('Not implemented')
}

/**
 * Delete an expense
 * TODO: Replace with Supabase delete
 */
export async function deleteExpense(id: string): Promise<void> {
  await delay(500)
  
  // In the future, this will be:
  // const { error } = await supabase.from('expenses').delete().eq('id', id)
  
  console.log('Deleted expense:', id)
}

/**
 * Fetch expense summary statistics
 * TODO: Replace with Supabase RPC or computed query
 */
export async function fetchExpenseSummary(): Promise<{
  totalCurrentMonth: number
  totalTransactions: number
  highestCategory: string
  averageMonthly: number
}> {
  await delay(300)
  
  // In the future, this will be a Supabase function or computed query
  throw new Error('Not implemented - using mock data')
}


