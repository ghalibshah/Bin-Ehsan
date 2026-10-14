import { Expense, ExpenseCategory } from './expense'
import { CustomIncomeType, Income } from './income'
import { Flat, RentPayment } from './rental'

export interface BuildingData {
  id: string
  name: string
  expenses: Expense[]
  incomes: Income[]
  customIncomeTypes: CustomIncomeType[]
  flats: Flat[]
  rentPayments: RentPayment[]
  customExpenseTypes: ExpenseCategory[]
}

export interface BuildingSettings {
  buildingId: string
  expenseCategories: ExpenseCategory[]
  flatCount: number
}

