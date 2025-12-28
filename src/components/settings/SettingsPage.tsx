"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { EXPENSE_CATEGORIES, ExpenseCategory } from "@/types/expense"
import { Flat, FLAT_TYPES } from "@/types/rental"
import { Plus, Trash2, Receipt, Home, AlertCircle, Edit2, Check, X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface SettingsPageProps {
  buildingId: string
  buildingName: string
  flats: Flat[]
  onAddFlat: (flat: Omit<Flat, 'id'>) => void
  onRemoveFlat: (flatId: string) => void
  onEditFlat: (flatId: string, updates: Partial<Flat>) => void
  onAddExpenseType?: (type: ExpenseCategory) => void
}

export function SettingsPage({ 
  buildingId, 
  buildingName, 
  flats, 
  onAddFlat, 
  onRemoveFlat,
  onEditFlat 
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'expenses' | 'flats'>('flats')
  
  return (
    <div className="space-y-5">
      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'flats' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('flats')}
          className="h-8 text-xs"
        >
          <Home className="h-3.5 w-3.5 mr-1.5" />
          Flats Management
        </Button>
        <Button
          variant={activeTab === 'expenses' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('expenses')}
          className="h-8 text-xs"
        >
          <Receipt className="h-3.5 w-3.5 mr-1.5" />
          Expense Types
        </Button>
      </div>

      {activeTab === 'flats' ? (
        <FlatsManagement 
          buildingId={buildingId}
          flats={flats} 
          onAddFlat={onAddFlat} 
          onRemoveFlat={onRemoveFlat}
          onEditFlat={onEditFlat}
        />
      ) : (
        <ExpenseTypesManagement />
      )}
    </div>
  )
}

interface FlatsManagementProps {
  buildingId: string
  flats: Flat[]
  onAddFlat: (flat: Omit<Flat, 'id'>) => void
  onRemoveFlat: (flatId: string) => void
  onEditFlat: (flatId: string, updates: Partial<Flat>) => void
}

function FlatsManagement({ buildingId, flats, onAddFlat, onRemoveFlat, onEditFlat }: FlatsManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFlatId, setEditingFlatId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Flat>>({})
  const [newFlat, setNewFlat] = useState({
    flatNumber: '',
    floor: 1,
    type: '2bed' as Flat['type'],
    monthlyRent: 50000,
    tenantName: '',
    tenantPhone: '',
  })

  const handleAddFlat = () => {
    if (!newFlat.flatNumber) return
    
    onAddFlat({
      flatNumber: newFlat.flatNumber,
      floor: newFlat.floor,
      type: newFlat.type,
      monthlyRent: newFlat.monthlyRent,
      tenantName: newFlat.tenantName || null,
      tenantPhone: newFlat.tenantPhone || null,
      isOccupied: !!newFlat.tenantName,
    })
    
    setNewFlat({
      flatNumber: '',
      floor: 1,
      type: '2bed',
      monthlyRent: 50000,
      tenantName: '',
      tenantPhone: '',
    })
    setShowAddForm(false)
  }

  const startEditing = (flat: Flat) => {
    setEditingFlatId(flat.id)
    setEditData({
      flatNumber: flat.flatNumber,
      floor: flat.floor,
      type: flat.type,
      monthlyRent: flat.monthlyRent,
      tenantName: flat.tenantName || '',
      tenantPhone: flat.tenantPhone || '',
    })
  }

  const cancelEditing = () => {
    setEditingFlatId(null)
    setEditData({})
  }

  const saveEditing = (flatId: string) => {
    onEditFlat(flatId, {
      ...editData,
      tenantName: editData.tenantName || null,
      tenantPhone: editData.tenantPhone || null,
      isOccupied: !!editData.tenantName,
    })
    setEditingFlatId(null)
    setEditData({})
  }

  return (
    <div className="space-y-4">
      {/* Add Flat Button */}
      <div className="flex justify-end">
        <Button 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-8 text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Flat
        </Button>
      </div>

      {/* Add Flat Form */}
      {showAddForm && (
        <Card>
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm">Add New Flat</CardTitle>
            <CardDescription className="text-xs">Enter flat details</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Flat Number *</Label>
                <Input
                  placeholder="e.g., 101"
                  value={newFlat.flatNumber}
                  onChange={(e) => setNewFlat({ ...newFlat, flatNumber: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Floor</Label>
                <Input
                  type="number"
                  min={1}
                  value={newFlat.floor}
                  onChange={(e) => setNewFlat({ ...newFlat, floor: parseInt(e.target.value) || 1 })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select
                  value={newFlat.type}
                  onValueChange={(value: Flat['type']) => setNewFlat({ ...newFlat, type: value })}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FLAT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id} className="text-sm">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Monthly Rent (PKR)</Label>
                <Input
                  type="number"
                  value={newFlat.monthlyRent}
                  onChange={(e) => setNewFlat({ ...newFlat, monthlyRent: parseInt(e.target.value) || 0 })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tenant Name</Label>
                <Input
                  placeholder="Optional"
                  value={newFlat.tenantName}
                  onChange={(e) => setNewFlat({ ...newFlat, tenantName: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tenant Phone</Label>
                <Input
                  placeholder="Optional"
                  value={newFlat.tenantPhone}
                  onChange={(e) => setNewFlat({ ...newFlat, tenantPhone: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)} className="h-8 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddFlat} className="h-8 text-xs">
                Add Flat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Flats */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Existing Flats
            <span className="text-[10px] font-normal text-muted-foreground ml-auto">
              {flats.length} flats
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {flats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Home className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No flats added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {flats.map((flat) => (
                <div key={flat.id}>
                  {editingFlatId === flat.id ? (
                    // Edit Mode
                    <div className="p-3 rounded-lg border border-primary bg-primary/5">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Flat #</Label>
                          <Input
                            value={editData.flatNumber || ''}
                            onChange={(e) => setEditData({ ...editData, flatNumber: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Floor</Label>
                          <Input
                            type="number"
                            min={1}
                            value={editData.floor || 1}
                            onChange={(e) => setEditData({ ...editData, floor: parseInt(e.target.value) || 1 })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Type</Label>
                          <Select
                            value={editData.type || '2bed'}
                            onValueChange={(value: Flat['type']) => setEditData({ ...editData, type: value })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FLAT_TYPES.map((type) => (
                                <SelectItem key={type.id} value={type.id} className="text-xs">
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Rent (PKR)</Label>
                          <Input
                            type="number"
                            value={editData.monthlyRent || 0}
                            onChange={(e) => setEditData({ ...editData, monthlyRent: parseInt(e.target.value) || 0 })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Tenant</Label>
                          <Input
                            value={editData.tenantName || ''}
                            onChange={(e) => setEditData({ ...editData, tenantName: e.target.value })}
                            placeholder="Optional"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Phone</Label>
                          <Input
                            value={editData.tenantPhone || ''}
                            onChange={(e) => setEditData({ ...editData, tenantPhone: e.target.value })}
                            placeholder="Optional"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={cancelEditing} className="h-7 text-xs">
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveEditing(flat.id)} className="h-7 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          {flat.flatNumber}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Flat {flat.flatNumber}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Floor {flat.floor} • {FLAT_TYPES.find(t => t.id === flat.type)?.label} • {formatCurrency(flat.monthlyRent)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {flat.tenantName && (
                          <span className="text-[10px] text-muted-foreground hidden sm:block">
                            {flat.tenantName}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${flat.isOccupied ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                          {flat.isOccupied ? 'Occupied' : 'Vacant'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(flat)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFlat(flat.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ExpenseTypesManagement() {
  const [customTypes, setCustomTypes] = useState<string[]>([])
  const [newType, setNewType] = useState('')

  const handleAddType = () => {
    if (newType.trim() && !customTypes.includes(newType.trim())) {
      setCustomTypes([...customTypes, newType.trim()])
      setNewType('')
    }
  }

  const handleRemoveType = (type: string) => {
    setCustomTypes(customTypes.filter(t => t !== type))
  }

  return (
    <div className="space-y-4">
      {/* Default Expense Types */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Default Expense Types
          </CardTitle>
          <CardDescription className="text-xs">
            These are the default expense categories
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <span 
                key={cat.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: cat.bgColor, color: cat.color }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Expense Types */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-violet-500" />
            Custom Expense Types
          </CardTitle>
          <CardDescription className="text-xs">
            Add custom expense categories for this building
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter new expense type..."
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
              className="h-9 text-sm flex-1"
            />
            <Button size="sm" onClick={handleAddType} className="h-9">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {customTypes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No custom types added</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {customTypes.map((type) => (
                <span 
                  key={type}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-600"
                >
                  📋 {type}
                  <button
                    onClick={() => handleRemoveType(type)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
