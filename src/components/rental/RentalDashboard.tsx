"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FlatWithRent, RentPayment, RENT_STATUS_CONFIG, RentStatus } from "@/types/rental"
import { formatCurrency } from "@/lib/utils"
import { RecordRentModal } from "./RecordRentModal"
import { FlatDetailsModal } from "./FlatDetailsModal"
import { EditFlatModal } from "./EditFlatModal"
import { Flat } from "@/types/rental"
import { 
  Home, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Clock,
  Plus,
  CreditCard
} from "lucide-react"

interface RentalSummary {
  totalFlats: number
  occupiedFlats: number
  vacantFlats: number
  paidCount: number
  pendingCount: number
  overdueCount: number
  partialCount: number
  expectedRent: number
  collectedRent: number
  totalDue: number
  collectionRate: number
}

interface RentalDashboardProps {
  summary: RentalSummary
  flats: FlatWithRent[]
  rentPayments: RentPayment[]
  onRecordPayment: (data: { 
    flatId: string
    amount: number
    status: RentStatus
    month: string
    notes?: string 
  }) => Promise<void>
  onEditFlat: (flatId: string, data: Partial<Flat>) => Promise<void>
}

export function RentalDashboard({ 
  summary, 
  flats, 
  rentPayments,
  onRecordPayment,
  onEditFlat
}: RentalDashboardProps) {
  const [selectedFlat, setSelectedFlat] = useState<FlatWithRent | null>(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const summaryCards = [
    {
      title: "Total Flats",
      value: summary.totalFlats.toString(),
      subtitle: `${summary.occupiedFlats} occupied, ${summary.vacantFlats} vacant`,
      icon: Home,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Collection Rate",
      value: `${summary.collectionRate}%`,
      subtitle: "This month",
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Collected",
      value: formatCurrency(summary.collectedRent),
      subtitle: `of ${formatCurrency(summary.expectedRent)} expected`,
      icon: CheckCircle,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending Amount",
      value: formatCurrency(summary.totalDue),
      subtitle: `${summary.pendingCount + summary.overdueCount} flats pending`,
      icon: AlertCircle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
  ]

  const handleFlatClick = (flat: FlatWithRent) => {
    setSelectedFlat(flat)
    setShowDetailsModal(true)
  }

  const handleRecordPaymentClick = (flat: FlatWithRent, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFlat(flat)
    setShowRecordModal(true)
  }

  const handleEditFromDetails = () => {
    setShowDetailsModal(false)
    setShowEditModal(true)
  }

  const handleRecordFromDetails = () => {
    setShowDetailsModal(false)
    setShowRecordModal(true)
  }

  const getFlatRentHistory = (flatId: string) => {
    return rentPayments.filter(p => p.flatId === flatId)
  }

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-lg font-bold tracking-tight text-foreground">
                    {card.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Flats List */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Flats Overview
            <span className="text-[10px] font-normal text-muted-foreground ml-auto">
              Click on a flat to view details
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {flats.map((flat) => (
              <FlatCard 
                key={flat.id} 
                flat={flat} 
                onClick={() => handleFlatClick(flat)}
                onRecordPayment={(e) => handleRecordPaymentClick(flat, e)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Record Rent Modal */}
      {selectedFlat && (
        <RecordRentModal
          open={showRecordModal}
          onOpenChange={setShowRecordModal}
          flat={selectedFlat}
          onSubmit={onRecordPayment}
        />
      )}

      {/* Flat Details Modal */}
      {selectedFlat && (
        <FlatDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          flat={selectedFlat}
          rentHistory={getFlatRentHistory(selectedFlat.id)}
          onRecordPayment={handleRecordFromDetails}
          onEditFlat={handleEditFromDetails}
        />
      )}

      {/* Edit Flat Modal */}
      {selectedFlat && (
        <EditFlatModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          flat={selectedFlat}
          onSubmit={onEditFlat}
        />
      )}
    </div>
  )
}

interface FlatCardProps {
  flat: FlatWithRent
  onClick: () => void
  onRecordPayment: (e: React.MouseEvent) => void
}

function FlatCard({ flat, onClick, onRecordPayment }: FlatCardProps) {
  const statusConfig = RENT_STATUS_CONFIG[flat.currentMonthStatus]
  
  return (
    <div 
      onClick={onClick}
      className="p-3 rounded-lg border border-border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
            {flat.flatNumber}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Flat {flat.flatNumber}</p>
            <p className="text-[10px] text-muted-foreground">Floor {flat.floor} • {flat.type}</p>
          </div>
        </div>
        {flat.isOccupied && (
          <span 
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ 
              backgroundColor: statusConfig.bgColor, 
              color: statusConfig.color 
            }}
          >
            {statusConfig.label}
          </span>
        )}
      </div>
      
      {flat.isOccupied ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="truncate">{flat.tenantName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Rent:</span>
            <span className="font-semibold text-foreground">{formatCurrency(flat.monthlyRent)}</span>
          </div>
          {flat.totalDue > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-destructive">Due:</span>
              <span className="font-semibold text-destructive">{formatCurrency(flat.totalDue)}</span>
            </div>
          )}
          
          {/* Record Payment Button */}
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full h-7 text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRecordPayment}
          >
            <CreditCard className="h-3 w-3 mr-1" />
            Record Payment
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Vacant</span>
        </div>
      )}
    </div>
  )
}
