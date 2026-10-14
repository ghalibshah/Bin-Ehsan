import { PaymentMethod } from './expense'

export type BuiltinIncomeTypeId =
  | 'rental'
  | 'furnished_rental'
  | 'maintenance'
  | 'commissions'
  | 'electricity_profit'
  | 'solar_profit'

export interface Income {
  id: string
  amount: number
  typeId: string
  typeLabel: string
  date: string
  paymentMethod: PaymentMethod
  notes?: string
  createdAt: string
}

export interface IncomeFormData {
  amount: string
  typeId: string
  typeLabel: string
  date: string
  paymentMethod: PaymentMethod
  notes: string
}

export interface CustomIncomeType {
  id: string
  label: string
}

export interface IncomeTypeInfo {
  id: string
  label: string
  icon: string
  color: string
  bgColor: string
  builtin: boolean
}

export const BUILTIN_INCOME_TYPES: IncomeTypeInfo[] = [
  { id: 'rental', label: 'Rental income', icon: '⌂', color: 'hsl(152, 16%, 28%)', bgColor: 'hsl(150, 14%, 94%)', builtin: true },
  { id: 'furnished_rental', label: 'Furnished rental income', icon: '▣', color: 'hsl(28, 28%, 36%)', bgColor: 'hsl(32, 28%, 94%)', builtin: true },
  { id: 'maintenance', label: 'Maintenance', icon: '▤', color: 'hsl(80, 14%, 32%)', bgColor: 'hsl(80, 16%, 94%)', builtin: true },
  { id: 'commissions', label: 'Commissions', icon: '◈', color: 'hsl(12, 32%, 38%)', bgColor: 'hsl(12, 28%, 95%)', builtin: true },
  { id: 'electricity_profit', label: 'Electricity profit', icon: '⌁', color: 'hsl(32, 36%, 38%)', bgColor: 'hsl(36, 40%, 94%)', builtin: true },
  { id: 'solar_profit', label: 'Solar profit', icon: '☼', color: 'hsl(42, 32%, 36%)', bgColor: 'hsl(42, 36%, 94%)', builtin: true },
]

const CUSTOM_PALETTE = [
  { color: 'hsl(30, 8%, 28%)', bgColor: 'hsl(36, 14%, 93%)' },
  { color: 'hsl(160, 10%, 32%)', bgColor: 'hsl(150, 12%, 94%)' },
  { color: 'hsl(20, 18%, 36%)', bgColor: 'hsl(24, 20%, 94%)' },
]

export function listIncomeTypes(customTypes: CustomIncomeType[]): IncomeTypeInfo[] {
  const custom = customTypes.map((type, index) => ({
    id: type.id,
    label: type.label,
    icon: '•',
    builtin: false,
    ...CUSTOM_PALETTE[index % CUSTOM_PALETTE.length],
  }))
  return [...BUILTIN_INCOME_TYPES, ...custom]
}

export function resolveIncomeType(
  typeId: string,
  customTypes: CustomIncomeType[],
  fallbackLabel?: string
): IncomeTypeInfo {
  const match = listIncomeTypes(customTypes).find((type) => type.id === typeId)
  if (match) return match
  return {
    id: typeId,
    label: fallbackLabel || 'Income',
    icon: '•',
    color: 'hsl(30, 6%, 42%)',
    bgColor: 'hsl(36, 12%, 93%)',
    builtin: false,
  }
}
