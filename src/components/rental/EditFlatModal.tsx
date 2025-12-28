"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Flat, FLAT_TYPES } from "@/types/rental"
import { Loader2 } from "lucide-react"

interface EditFlatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flat: Flat
  onSubmit: (flatId: string, data: Partial<Flat>) => Promise<void>
}

export function EditFlatModal({ open, onOpenChange, flat, onSubmit }: EditFlatModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    flatNumber: flat.flatNumber,
    floor: flat.floor,
    type: flat.type,
    monthlyRent: flat.monthlyRent,
    tenantName: flat.tenantName || '',
    tenantPhone: flat.tenantPhone || '',
    isOccupied: flat.isOccupied,
  })

  // Reset form when flat changes
  useEffect(() => {
    setFormData({
      flatNumber: flat.flatNumber,
      floor: flat.floor,
      type: flat.type,
      monthlyRent: flat.monthlyRent,
      tenantName: flat.tenantName || '',
      tenantPhone: flat.tenantPhone || '',
      isOccupied: flat.isOccupied,
    })
  }, [flat])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      await onSubmit(flat.id, {
        flatNumber: formData.flatNumber,
        floor: formData.floor,
        type: formData.type,
        monthlyRent: formData.monthlyRent,
        tenantName: formData.tenantName || null,
        tenantPhone: formData.tenantPhone || null,
        isOccupied: !!formData.tenantName,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating flat:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">
            Edit Flat {flat.flatNumber}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Update the details for this flat
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Flat Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Flat Number *</Label>
              <Input
                value={formData.flatNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, flatNumber: e.target.value }))}
                className="h-10"
                placeholder="e.g., 101"
              />
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Floor *</Label>
              <Input
                type="number"
                min={1}
                value={formData.floor}
                onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) || 1 }))}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Flat Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Flat['type']) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLAT_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Rent */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Monthly Rent (PKR) *</Label>
              <Input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: parseInt(e.target.value) || 0 }))}
                className="h-10"
              />
            </div>
          </div>

          {/* Tenant Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tenant Name</Label>
            <Input
              value={formData.tenantName}
              onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
              className="h-10"
              placeholder="Leave empty if vacant"
            />
          </div>

          {/* Tenant Phone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tenant Phone</Label>
            <Input
              value={formData.tenantPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, tenantPhone: e.target.value }))}
              className="h-10"
              placeholder="Contact number"
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
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

