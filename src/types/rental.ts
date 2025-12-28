export type RentStatus = 'paid' | 'pending' | 'overdue' | 'partial'

export interface Flat {
  id: string
  flatNumber: string
  floor: number
  type: 'studio' | '1bed' | '2bed' | '3bed' | 'penthouse'
  tenantName: string | null
  tenantPhone: string | null
  monthlyRent: number
  isOccupied: boolean
}

export interface RentPayment {
  id: string
  flatId: string
  amount: number
  month: string // Format: "2024-01"
  paidDate: string | null
  status: RentStatus
  notes?: string
}

export interface FlatWithRent extends Flat {
  currentMonthStatus: RentStatus
  lastPaymentDate: string | null
  totalDue: number
}

export const FLAT_TYPES: { id: Flat['type']; label: string }[] = [
  { id: 'studio', label: 'Studio' },
  { id: '1bed', label: '1 Bedroom' },
  { id: '2bed', label: '2 Bedroom' },
  { id: '3bed', label: '3 Bedroom' },
  { id: 'penthouse', label: 'Penthouse' },
]

export const RENT_STATUS_CONFIG: Record<RentStatus, { label: string; color: string; bgColor: string }> = {
  paid: { label: 'Paid', color: 'hsl(142, 71%, 35%)', bgColor: 'hsl(142, 71%, 95%)' },
  pending: { label: 'Pending', color: 'hsl(38, 92%, 45%)', bgColor: 'hsl(38, 92%, 95%)' },
  overdue: { label: 'Overdue', color: 'hsl(0, 84%, 50%)', bgColor: 'hsl(0, 84%, 95%)' },
  partial: { label: 'Partial', color: 'hsl(262, 83%, 50%)', bgColor: 'hsl(262, 83%, 95%)' },
}

