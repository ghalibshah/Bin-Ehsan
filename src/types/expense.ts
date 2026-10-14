export type ExpenseCategory = 
  | 'electricity'
  | 'water'
  | 'maintenance'
  | 'cleaning'
  | 'security'
  | 'repairs'
  | 'lift'
  | 'other'

export type PaymentMethod = 'cash' | 'bank' | 'online'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  date: string
  paymentMethod: PaymentMethod
  notes?: string
  createdAt: string
}

export interface ExpenseFormData {
  amount: string
  category: ExpenseCategory
  date: string
  paymentMethod: PaymentMethod
  notes: string
}

export interface CategoryInfo {
  id: ExpenseCategory
  label: string
  icon: string
  color: string
  bgColor: string
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { id: 'electricity', label: 'Electricity', icon: '⚡', color: 'hsl(32, 36%, 38%)', bgColor: 'hsl(36, 32%, 94%)' },
  { id: 'water', label: 'Water', icon: '💧', color: 'hsl(200, 12%, 38%)', bgColor: 'hsl(200, 14%, 94%)' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'hsl(80, 14%, 32%)', bgColor: 'hsl(80, 16%, 94%)' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'hsl(152, 14%, 32%)', bgColor: 'hsl(150, 14%, 94%)' },
  { id: 'security', label: 'Security', icon: '🛡️', color: 'hsl(30, 8%, 28%)', bgColor: 'hsl(36, 12%, 93%)' },
  { id: 'repairs', label: 'Repairs', icon: '🛠️', color: 'hsl(12, 32%, 38%)', bgColor: 'hsl(12, 28%, 95%)' },
  { id: 'lift', label: 'Lift / Elevator', icon: '🛗', color: 'hsl(28, 24%, 36%)', bgColor: 'hsl(32, 22%, 94%)' },
  { id: 'other', label: 'Other', icon: '📦', color: 'hsl(30, 6%, 42%)', bgColor: 'hsl(36, 12%, 94%)' },
]

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'Cash' },
  { id: 'bank', label: 'Bank Transfer' },
  { id: 'online', label: 'Online Payment' },
]

export function getCategoryInfo(category: ExpenseCategory): CategoryInfo {
  return EXPENSE_CATEGORIES.find(c => c.id === category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}


