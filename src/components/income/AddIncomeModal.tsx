"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { PAYMENT_METHODS, PaymentMethod } from "@/types/expense"
import { CustomIncomeType, IncomeFormData, listIncomeTypes } from "@/types/income"
import { Loader2 } from "lucide-react"

interface AddIncomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customTypes: CustomIncomeType[]
  onSubmit: (data: IncomeFormData) => Promise<void>
}

interface FormErrors {
  amount?: string
  typeId?: string
  date?: string
  paymentMethod?: string
}

export function AddIncomeModal({ open, onOpenChange, customTypes, onSubmit }: AddIncomeModalProps) {
  const types = listIncomeTypes(customTypes)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<IncomeFormData>({
    amount: "",
    typeId: types[0]?.id || "rental",
    typeLabel: types[0]?.label || "Rental income",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    notes: "",
  })

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {}
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      nextErrors.amount = "Enter a valid amount"
    }
    if (!formData.typeId) {
      nextErrors.typeId = "Select an income type"
    }
    if (!formData.date) {
      nextErrors.date = "Select a date"
    }
    if (!formData.paymentMethod) {
      nextErrors.paymentMethod = "Select a payment method"
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      const resetType = types[0]
      setFormData({
        amount: "",
        typeId: resetType?.id || "rental",
        typeLabel: resetType?.label || "Rental income",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
        notes: "",
      })
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting income:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Add income</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Record money received for this building. Amounts are entered as-is.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="income-amount" error={!!errors.amount}>Amount (PKR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                PKR
              </span>
              <Input
                id="income-amount"
                inputMode="decimal"
                placeholder="0"
                value={formData.amount}
                onChange={(event) => {
                  setFormData((prev) => ({ ...prev, amount: event.target.value.replace(/[^0-9.]/g, "") }))
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }))
                }}
                className="pl-14 h-11"
                error={!!errors.amount}
              />
            </div>
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label error={!!errors.typeId}>Income type</Label>
            <Select
              value={formData.typeId}
              onValueChange={(value) => {
                const selected = types.find((type) => type.id === value)
                setFormData((prev) => ({
                  ...prev,
                  typeId: value,
                  typeLabel: selected?.label || prev.typeLabel,
                }))
                if (errors.typeId) setErrors((prev) => ({ ...prev, typeId: undefined }))
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.typeId && <p className="text-xs text-destructive">{errors.typeId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-date" error={!!errors.date}>Date</Label>
            <Input
              id="income-date"
              type="date"
              value={formData.date}
              onChange={(event) => {
                setFormData((prev) => ({ ...prev, date: event.target.value }))
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
              }}
              className="h-11"
              error={!!errors.date}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label error={!!errors.paymentMethod}>Payment method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value: PaymentMethod) => {
                setFormData((prev) => ({ ...prev, paymentMethod: value }))
                if (errors.paymentMethod) setErrors((prev) => ({ ...prev, paymentMethod: undefined }))
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-notes">Notes</Label>
            <Textarea
              id="income-notes"
              placeholder="Optional details"
              value={formData.notes}
              onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save income"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
