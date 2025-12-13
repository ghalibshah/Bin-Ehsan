"use client"

import { Building2, User, ChevronDown, ArrowLeft } from "lucide-react"
import { BuildingInfo } from "@/components/intro/BuildingSelector"

interface HeaderProps {
  building?: BuildingInfo
  onSwitchBuilding?: () => void
}

export function Header({ building, onSwitchBuilding }: HeaderProps) {
  const gradientClass = building?.gradient || "from-cyan-500 to-blue-600"
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            {onSwitchBuilding && (
              <button
                onClick={onSwitchBuilding}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mr-1"
                title="Switch Building"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} text-white shadow-lg`}>
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight text-foreground tracking-tight">
                {building?.displayName || "Bin Ehsan Building"}
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Residential Expense Management
              </p>
            </div>
          </div>

          {/* Building Switcher & User */}
          <div className="flex items-center gap-4">
            {building && onSwitchBuilding && (
              <button
                onClick={onSwitchBuilding}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
              >
                <span className="text-muted-foreground">Switch Building</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">Committee Admin</p>
              <p className="text-xs text-muted-foreground">Building Manager</p>
            </div>
            <button 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
