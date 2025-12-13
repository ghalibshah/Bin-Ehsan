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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ExpenseFormData, 
  ExpenseCategory, 
  PaymentMethod,
  EXPENSE_CATEGORIES, 
  PAYMENT_METHODS 
} from "@/types/expense"
import { Loader2 } from "lucide-react"

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExpenseFormData) => Promise<void>
}

interface FormErrors {
  amount?: string
  category?: string
  date?: string
  paymentMethod?: string
}

export function AddExpenseModal({ open, onOpenChange, onSubmit }: AddExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: "",
    category: "maintenance" as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: "cash" as PaymentMethod,
    notes: "",
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.date) {
      newErrors.date = "Please select a date"
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form on success
      setFormData({
        amount: "",
        category: "maintenance",
        date: new Date().toISOString().split('T')[0],
        paymentMethod: "cash",
        notes: "",
      })
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting expense:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setFormData(prev => ({ ...prev, amount: value }))
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Add Building Expense</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Record a new expense for the building. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" error={!!errors.amount} className="text-sm font-medium">
              Amount (PKR) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                PKR
              </span>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleAmountChange}
                className="pl-14 h-11 text-base"
                error={!!errors.amount}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label error={!!errors.category} className="text-sm font-medium">
              Expense Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value: ExpenseCategory) => {
                setFormData(prev => ({ ...prev, category: value }))
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: undefined }))
                }
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" error={!!errors.date} className="text-sm font-medium">
              Expense Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, date: e.target.value }))
                if (errors.date) {
                  setErrors(prev => ({ ...prev, date: undefined }))
                }
              }}
              error={!!errors.date}
              className="h-11"
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label error={!!errors.paymentMethod} className="text-sm font-medium">
              Payment Method *
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value: PaymentMethod) => {
                setFormData(prev => ({ ...prev, paymentMethod: value }))
                if (errors.paymentMethod) {
                  setErrors(prev => ({ ...prev, paymentMethod: undefined }))
                }
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-xs text-destructive">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes / Description
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details about this expense..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          <DialogFooter className="gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-10">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


