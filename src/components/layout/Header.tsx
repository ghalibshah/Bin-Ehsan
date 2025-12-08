"use client"

import { Building2, User } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight text-foreground tracking-tight">
                Bin Ehsan Building
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Residential Expense Management
              </p>
            </div>
          </div>

          {/* User Avatar Placeholder */}
          <div className="flex items-center gap-4">
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

