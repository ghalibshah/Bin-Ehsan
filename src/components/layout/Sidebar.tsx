"use client"

import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet,
  Home, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState } from "react"

export type NavItem = 'income' | 'expenses' | 'rental' | 'settings'

interface SidebarProps {
  activeItem: NavItem
  onNavigate: (item: NavItem) => void
  buildingName?: string
}

const navItems = [
  { id: 'income' as NavItem, label: 'Income', icon: Wallet, description: 'Record money received' },
  { id: 'expenses' as NavItem, label: 'General Expenses', icon: Receipt, description: 'Track building expenses' },
  { id: 'rental' as NavItem, label: 'Rental Management', icon: Home, description: 'Manage flats & rent' },
  { id: 'settings' as NavItem, label: 'Settings', icon: Settings, description: 'Configure building' },
]

export function Sidebar({ activeItem, onNavigate, buildingName }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "flex flex-col bg-[hsl(30,8%,11%)] text-stone-100 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-stone-300" />
            <span className="text-sm font-semibold truncate">{buildingName || 'Dashboard'}</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/10 transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-stone-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-stone-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-white/10 text-stone-50" 
                  : "text-stone-400 hover:bg-white/5 hover:text-stone-100",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-stone-50")} />
              {!isCollapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className={cn(
                    "text-[10px]",
                    isActive ? "text-stone-300" : "text-stone-500"
                  )}>{item.description}</span>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <p className="text-[10px] text-stone-500 text-center">
            Bin Ehsan Management v1.0
          </p>
        </div>
      )}
    </aside>
  )
}

