"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

interface TrendDataPoint {
  date: string
  amount: number
  formattedDate: string
}

interface ExpenseTrendChartProps {
  data: TrendDataPoint[]
  accentColor?: string
}

export function ExpenseTrendChart({ data, accentColor = "hsl(199, 89%, 48%)" }: ExpenseTrendChartProps) {
  const maxAmount = Math.max(...data.map(d => d.amount), 1)
  
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-1 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          Expense Trend
          <span className="text-[10px] font-normal text-muted-foreground ml-auto">
            Last 30 days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(220, 13%, 91%)" 
                vertical={false}
              />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                domain={[0, maxAmount * 1.1]}
                width={45}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={accentColor}
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
