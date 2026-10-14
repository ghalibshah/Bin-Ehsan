"use client"

import { useState } from "react"
import { Building2, ChevronRight, MapPin, Users, Calendar } from "lucide-react"

export interface BuildingInfo {
  id: string
  name: string
  displayName: string
  address: string
  units: number
  established: string
  mark: string
}

export const BUILDINGS: BuildingInfo[] = [
  {
    id: "bin-ehsan-1",
    name: "Bin Ehsan 1",
    displayName: "Bin Ehsan 1",
    address: "Block A, Gulshan-e-Iqbal",
    units: 12,
    established: "2018",
    mark: "hsl(30, 8%, 22%)",
  },
  {
    id: "bin-ehsan-2",
    name: "Bin Ehsan 2",
    displayName: "Bin Ehsan 2",
    address: "Block B, Gulshan-e-Iqbal",
    units: 16,
    established: "2020",
    mark: "hsl(80, 14%, 30%)",
  },
  {
    id: "bin-ehsan-3",
    name: "Bin Ehsan 3",
    displayName: "Bin Ehsan 3",
    address: "Block C, Gulshan-e-Iqbal",
    units: 20,
    established: "2023",
    mark: "hsl(28, 28%, 36%)",
  },
]

interface BuildingSelectorProps {
  onSelect: (building: BuildingInfo) => void
}

export function BuildingSelector({ onSelect }: BuildingSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-6 lg:py-10">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-primary mb-4">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-2">
            Select Your Building
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Choose which building you want to manage
          </p>
        </div>

        {/* Building Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {BUILDINGS.map((building, index) => {
            const isHovered = hoveredId === building.id
            
            return (
              <button
                key={building.id}
                onClick={() => onSelect(building)}
                onMouseEnter={() => setHoveredId(building.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative text-left"
                style={{
                  animation: `slideUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                }}
              >
                {/* Card */}
                <div 
                  className={`relative overflow-hidden rounded-xl bg-card border p-7 lg:p-9 transition-all duration-300 ${
                    isHovered 
                      ? 'shadow-soft-lg border-foreground/20' 
                      : 'shadow-soft border-border'
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: building.mark }}
                  />

                  <div
                    className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-md text-primary-foreground"
                    style={{ backgroundColor: building.mark }}
                  >
                    <Building2 className="h-7 w-7" />
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {building.displayName}
                  </h3>

                  <div className="space-y-2.5 mb-7">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {building.address}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {building.units} Units
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Est. {building.established}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-border">
                    <span className="text-sm font-medium text-foreground">
                      Open dashboard
                    </span>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-primary-foreground transition-transform duration-300 ${
                        isHovered ? 'translate-x-1' : ''
                      }`}
                      style={{ backgroundColor: building.mark }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          Bin Ehsan Building Management System v1.0
        </p>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

