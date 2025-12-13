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
  color: string
  gradient: string
}

export const BUILDINGS: BuildingInfo[] = [
  {
    id: "bin-ehsan-1",
    name: "Bin Ehsan 1",
    displayName: "Bin Ehsan 1",
    address: "Block A, Gulshan-e-Iqbal",
    units: 12,
    established: "2018",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "bin-ehsan-2",
    name: "Bin Ehsan 2",
    displayName: "Bin Ehsan 2",
    address: "Block B, Gulshan-e-Iqbal",
    units: 16,
    established: "2020",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "bin-ehsan-3",
    name: "Bin Ehsan 3",
    displayName: "Bin Ehsan 3",
    address: "Block C, Gulshan-e-Iqbal",
    units: 20,
    established: "2023",
    color: "violet",
    gradient: "from-violet-500 to-purple-600",
  },
]

interface BuildingSelectorProps {
  onSelect: (building: BuildingInfo) => void
}

export function BuildingSelector({ onSelect }: BuildingSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 mb-4">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight mb-2">
            Select Your Building
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
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
                  className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-7 lg:p-9 transition-all duration-500 ${
                    isHovered 
                      ? 'shadow-2xl shadow-slate-300/60 scale-[1.03] border-transparent' 
                      : 'shadow-xl shadow-slate-200/50'
                  }`}
                >
                  {/* Top gradient bar */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${building.gradient} transition-all duration-500 ${
                      isHovered ? 'h-2' : 'h-1.5'
                    }`}
                  />

                  {/* Building icon */}
                  <div 
                    className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${building.gradient} shadow-lg transition-transform duration-500 ${
                      isHovered ? 'scale-110 rotate-3' : ''
                    }`}
                  >
                    <Building2 className="h-8 w-8 text-white" />
                  </div>

                  {/* Building name */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {building.displayName}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2.5 mb-7">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {building.address}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-slate-400" />
                        {building.units} Units
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Est. {building.established}
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div 
                    className={`flex items-center justify-between pt-5 border-t border-slate-100 transition-colors duration-300`}
                  >
                    <span className={`text-sm font-medium bg-gradient-to-r ${building.gradient} bg-clip-text text-transparent`}>
                      Open Dashboard
                    </span>
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${building.gradient} text-white transition-all duration-500 ${
                        isHovered ? 'translate-x-1' : ''
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div 
                    className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${building.gradient} opacity-0 blur-xl transition-opacity duration-500 -z-10 ${
                      isHovered ? 'opacity-20' : ''
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-slate-400 mt-12">
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

