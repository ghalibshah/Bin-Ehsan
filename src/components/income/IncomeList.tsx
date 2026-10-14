"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CustomIncomeType, Income, listIncomeTypes, resolveIncomeType } from "@/types/income"
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, Filter, Search, X } from "lucide-react"

interface IncomeListProps {
  incomes: Income[]
  customTypes: CustomIncomeType[]
}

type SortField = "date" | "amount"
type SortOrder = "asc" | "desc"

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  bank: "Bank",
  online: "Online",
}

export function IncomeList({ incomes, customTypes }: IncomeListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const typeOptions = listIncomeTypes(customTypes)

  const filteredIncomes = useMemo(() => {
    let result = [...incomes]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((entry) => {
        return (
          entry.typeLabel.toLowerCase().includes(query) ||
          entry.notes?.toLowerCase().includes(query) ||
          entry.amount.toString().includes(query) ||
          formatDate(entry.date).toLowerCase().includes(query)
        )
      })
    }

    if (typeFilter !== "all") {
      result = result.filter((entry) => entry.typeId === typeFilter)
    }

    result.sort((a, b) => {
      const comparison = sortField === "date"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : a.amount - b.amount
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [incomes, searchQuery, typeFilter, sortField, sortOrder])

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Recent income
            <span className="text-xs font-normal text-muted-foreground">
              {filteredIncomes.length} of {incomes.length}
            </span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search income..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-8 h-8 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[190px] h-8 text-xs">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All types</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="text-xs">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={`${sortField}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-") as [SortField, SortOrder]
                setSortField(field)
                setSortOrder(order)
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc" className="text-xs">
                  <span className="flex items-center gap-1.5"><ArrowDown className="h-3 w-3" />Newest</span>
                </SelectItem>
                <SelectItem value="date-asc" className="text-xs">
                  <span className="flex items-center gap-1.5"><ArrowUp className="h-3 w-3" />Oldest</span>
                </SelectItem>
                <SelectItem value="amount-desc" className="text-xs">
                  <span className="flex items-center gap-1.5"><ArrowDown className="h-3 w-3" />Highest</span>
                </SelectItem>
                <SelectItem value="amount-asc" className="text-xs">
                  <span className="flex items-center gap-1.5"><ArrowUp className="h-3 w-3" />Lowest</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredIncomes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">No income entries</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add an entry, or clear the current search.
            </p>
          </div>
        ) : (
          <div className="hidden md:block max-h-[420px] overflow-auto rounded-lg border border-border">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted z-10">
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Payment</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredIncomes.map((entry) => {
                  const info = resolveIncomeType(entry.typeId, customTypes, entry.typeLabel)
                  return (
                    <tr key={entry.id} className="hover:bg-muted/60">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatDate(entry.date)}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                          style={{ backgroundColor: info.bgColor, color: info.color }}
                        >
                          {entry.typeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-semibold">
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-xs text-muted-foreground">
                        {PAYMENT_LABELS[entry.paymentMethod] || entry.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground truncate max-w-[220px]">
                        {entry.notes || "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {filteredIncomes.length > 0 && (
          <div className="md:hidden max-h-[500px] overflow-y-auto space-y-3">
            {filteredIncomes.map((entry) => {
              const info = resolveIncomeType(entry.typeId, customTypes, entry.typeLabel)
              return (
                <div key={entry.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{ backgroundColor: info.bgColor, color: info.color }}
                      >
                        {entry.typeLabel}
                      </span>
                      <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(entry.date)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(entry.amount)}</p>
                  </div>
                  {entry.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">{entry.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
