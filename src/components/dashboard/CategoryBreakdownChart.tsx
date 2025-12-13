"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { getCategoryInfo, ExpenseCategory } from "@/types/expense"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface CategoryData {
  category: ExpenseCategory
  amount: number
}

interface CategoryBreakdownChartProps {
  data: CategoryData[]
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  const chartData = data.map(item => {
    const info = getCategoryInfo(item.category)
    return {
      ...item,
      name: info.label,
      icon: info.icon,
      color: info.color,
    }
  })

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="pb-1 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Category Breakdown
          <span className="text-[10px] font-normal text-muted-foreground ml-auto">
            This month
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(220, 13%, 91%)" 
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(220, 13%, 91%)' }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                cursor={{ fill: 'hsl(220, 14%, 96%)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <span>{data.icon}</span>
                          {data.name}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(data.amount)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="amount" 
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {chartData.slice(0, 4).map((item) => (
            <div
              key={item.category}
              className="flex items-center gap-1 text-[10px] text-muted-foreground"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


