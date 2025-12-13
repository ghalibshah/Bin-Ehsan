"use client"

import { Building2, User, ChevronDown } from "lucide-react"
import { BuildingInfo } from "@/components/intro/BuildingSelector"

interface HeaderProps {
  building?: BuildingInfo
  onSwitchBuilding?: () => void
}

export function Header({ building, onSwitchBuilding }: HeaderProps) {
  const gradientClass = building?.gradient || "from-cyan-500 to-blue-600"
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-12 items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradientClass} text-white shadow-md cursor-pointer`} onClick={onSwitchBuilding}>
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold leading-tight text-foreground tracking-tight">
                {building?.displayName || "Bin Ehsan Building"}
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Expense Management
              </p>
            </div>
          </div>

          {/* Building Switcher & User */}
          <div className="flex items-center gap-3">
            {building && onSwitchBuilding && (
              <button
                onClick={onSwitchBuilding}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border hover:bg-secondary transition-colors text-xs"
              >
                <span className="text-muted-foreground">Switch</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-foreground">Admin</p>
              <p className="text-[10px] text-muted-foreground">Manager</p>
            </div>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="User menu"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
