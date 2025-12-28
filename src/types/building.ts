import { Expense, ExpenseCategory } from './expense'
import { Flat, RentPayment } from './rental'

export interface BuildingData {
  id: string
  name: string
  expenses: Expense[]
  flats: Flat[]
  rentPayments: RentPayment[]
  customExpenseTypes: ExpenseCategory[]
}

export interface BuildingSettings {
  buildingId: string
  expenseCategories: ExpenseCategory[]
  flatCount: number
}

