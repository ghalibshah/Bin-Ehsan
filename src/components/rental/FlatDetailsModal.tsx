"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FlatWithRent, RentPayment, RENT_STATUS_CONFIG, FLAT_TYPES } from "@/types/rental"
import { formatCurrency, formatDate } from "@/lib/utils"
import { 
  User, 
  Phone, 
  Home, 
  Calendar, 
  CreditCard,
  Plus,
  Edit2,
  Building
} from "lucide-react"

interface FlatDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flat: FlatWithRent
  rentHistory: RentPayment[]
  onRecordPayment: () => void
  onEditFlat: () => void
}

export function FlatDetailsModal({ 
  open, 
  onOpenChange, 
  flat, 
  rentHistory,
  onRecordPayment,
  onEditFlat
}: FlatDetailsModalProps) {
  const flatTypeLabel = FLAT_TYPES.find(t => t.id === flat.type)?.label || flat.type
  
  // Sort rent history by month (newest first)
  const sortedHistory = [...rentHistory].sort((a, b) => b.month.localeCompare(a.month))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                {flat.flatNumber}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Flat {flat.flatNumber}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Floor {flat.floor} • {flatTypeLabel}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onEditFlat} className="h-8">
              <Edit2 className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Flat Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tenant Information
              </h4>
              {flat.isOccupied ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{flat.tenantName}</span>
                  </div>
                  {flat.tenantPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{flat.tenantPhone}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">Vacant</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rent Details
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Monthly: {formatCurrency(flat.monthlyRent)}</span>
              </div>
              {flat.totalDue > 0 && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <CreditCard className="h-4 w-4" />
                  <span>Due: {formatCurrency(flat.totalDue)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Month Status</p>
                <span 
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: RENT_STATUS_CONFIG[flat.currentMonthStatus].bgColor, 
                    color: RENT_STATUS_CONFIG[flat.currentMonthStatus].color 
                  }}
                >
                  {RENT_STATUS_CONFIG[flat.currentMonthStatus].label}
                </span>
              </div>
              <Button size="sm" onClick={onRecordPayment} className="h-9">
                <Plus className="h-4 w-4 mr-1.5" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Rent History */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Payment History
            </h4>
            
            {sortedHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No payment records yet</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-xs text-muted-foreground">
                      <th className="text-left py-2 px-3 font-medium">Month</th>
                      <th className="text-left py-2 px-3 font-medium">Status</th>
                      <th className="text-right py-2 px-3 font-medium">Amount</th>
                      <th className="text-left py-2 px-3 font-medium">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedHistory.map((payment) => {
                      const statusConfig = RENT_STATUS_CONFIG[payment.status]
                      const monthDate = new Date(payment.month + '-01')
                      const monthLabel = monthDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })
                      
                      return (
                        <tr key={payment.id} className="text-sm hover:bg-muted/30">
                          <td className="py-2.5 px-3 font-medium">{monthLabel}</td>
                          <td className="py-2.5 px-3">
                            <span 
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: statusConfig.bgColor, 
                                color: statusConfig.color 
                              }}
                            >
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium">
                            {payment.amount > 0 ? formatCurrency(payment.amount) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {payment.paidDate ? formatDate(payment.paidDate) : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

