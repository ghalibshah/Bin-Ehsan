"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfitDistributionCard() {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
          Profit distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Waiting on Mazz’s formula.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-sm text-muted-foreground">
          Partner shares will be shown here once the distribution formula is provided. Nothing is split or calculated yet.
        </p>
      </CardContent>
    </Card>
  )
}
