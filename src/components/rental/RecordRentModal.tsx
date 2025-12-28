"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FlatWithRent, RentStatus, RENT_STATUS_CONFIG } from "@/types/rental"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Home } from "lucide-react"

interface RecordRentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flat: FlatWithRent
  onSubmit: (data: { 
    flatId: string
    amount: number
    status: RentStatus
    month: string
    notes?: string 
  }) => Promise<void>
}

export function RecordRentModal({ open, onOpenChange, flat, onSubmit }: RecordRentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  const [formData, setFormData] = useState({
    amount: flat.monthlyRent.toString(),
    status: 'paid' as RentStatus,
    month: currentMonth,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      await onSubmit({
        flatId: flat.id,
        amount: parseFloat(formData.amount) || 0,
        status: formData.status,
        month: formData.month,
        notes: formData.notes || undefined,
      })
      onOpenChange(false)
      // Reset form
      setFormData({
        amount: flat.monthlyRent.toString(),
        status: 'paid',
        month: currentMonth,
        notes: '',
      })
    } catch (error) {
      console.error("Error recording payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = (status: RentStatus) => {
    setFormData(prev => ({
      ...prev,
      status,
      amount: status === 'paid' ? flat.monthlyRent.toString() : 
              status === 'pending' || status === 'overdue' ? '0' : prev.amount
    }))
  }

  // Generate last 12 months for dropdown
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              {flat.flatNumber}
            </div>
            Record Rent Payment
          </DialogTitle>
          <DialogDescription className="text-sm">
            Record rent payment for Flat {flat.flatNumber}
            {flat.tenantName && ` (${flat.tenantName})`}
          </DialogDescription>
        </DialogHeader>

        {/* Flat Info */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Rent:</span>
            <span className="font-semibold">{formatCurrency(flat.monthlyRent)}</span>
          </div>
          {flat.totalDue > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-destructive">Total Due:</span>
              <span className="font-semibold text-destructive">{formatCurrency(flat.totalDue)}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Month */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Month *</Label>
            <Select
              value={formData.month}
              onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Status *</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(RENT_STATUS_CONFIG) as RentStatus[]).map((status) => {
                const config = RENT_STATUS_CONFIG[status]
                const isSelected = formData.status === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {config.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Amount Received (PKR) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                PKR
              </span>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="pl-12 h-10"
                placeholder="0"
              />
            </div>
            {formData.status === 'partial' && (
              <p className="text-xs text-muted-foreground">
                Remaining: {formatCurrency(flat.monthlyRent - (parseFloat(formData.amount) || 0))}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              placeholder="Add any notes about this payment..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="text-sm"
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

