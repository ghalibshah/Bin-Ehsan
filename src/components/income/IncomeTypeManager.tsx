"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomIncomeType, listIncomeTypes } from "@/types/income"
import { Plus, X } from "lucide-react"

interface IncomeTypeManagerProps {
  customTypes: CustomIncomeType[]
  onAdd: (label: string) => void
  onRemove: (typeId: string) => void
}

export function IncomeTypeManager({ customTypes, onAdd, onRemove }: IncomeTypeManagerProps) {
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")
  const types = listIncomeTypes(customTypes)

  const handleAdd = () => {
    const label = draft.trim()
    if (!label) {
      setError("Enter a type name")
      return
    }
    const exists = types.some((type) => type.label.toLowerCase() === label.toLowerCase())
    if (exists) {
      setError("That type already exists")
      return
    }
    onAdd(label)
    setDraft("")
    setError("")
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">Income types</CardTitle>
        <CardDescription className="text-xs">
          Built-in types stay in place. Add a type when you need one that is not listed.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <span
              key={type.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
              style={{ backgroundColor: type.bgColor, color: type.color }}
            >
              {type.label}
              {!type.builtin && (
                <button
                  type="button"
                  onClick={() => onRemove(type.id)}
                  className="rounded-sm hover:text-destructive"
                  aria-label={`Remove ${type.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              if (error) setError("")
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                handleAdd()
              }
            }}
            placeholder="New income type"
            className="h-9 text-sm"
          />
          <Button type="button" size="sm" onClick={handleAdd} className="h-9">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add type
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
