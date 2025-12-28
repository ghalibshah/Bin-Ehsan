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
  { id: 'electricity', label: 'Electricity', icon: '⚡', color: 'hsl(38, 92%, 50%)', bgColor: 'hsl(38, 92%, 95%)' },
  { id: 'water', label: 'Water', icon: '💧', color: 'hsl(199, 89%, 48%)', bgColor: 'hsl(199, 89%, 95%)' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'hsl(262, 83%, 58%)', bgColor: 'hsl(262, 83%, 95%)' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'hsl(142, 71%, 45%)', bgColor: 'hsl(142, 71%, 95%)' },
  { id: 'security', label: 'Security', icon: '🛡️', color: 'hsl(220, 70%, 50%)', bgColor: 'hsl(220, 70%, 95%)' },
  { id: 'repairs', label: 'Repairs', icon: '🛠️', color: 'hsl(340, 82%, 52%)', bgColor: 'hsl(340, 82%, 95%)' },
  { id: 'lift', label: 'Lift / Elevator', icon: '🛗', color: 'hsl(173, 80%, 40%)', bgColor: 'hsl(173, 80%, 95%)' },
  { id: 'other', label: 'Other', icon: '📦', color: 'hsl(220, 9%, 46%)', bgColor: 'hsl(220, 14%, 96%)' },
]

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'Cash' },
  { id: 'bank', label: 'Bank Transfer' },
  { id: 'online', label: 'Online Payment' },
]

export function getCategoryInfo(category: ExpenseCategory): CategoryInfo {
  return EXPENSE_CATEGORIES.find(c => c.id === category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}


