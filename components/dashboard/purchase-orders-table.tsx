/**
 * Purchase Orders Table Component
 * 
 * Displays a table of recent purchase orders with:
 * - PO number and status
 * - Supplier and category information
 * - Promised vs actual delivery dates
 * - Delay indicators
 * - Risk assessment
 */

import { prisma } from '@/lib/db'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface PurchaseOrderWithRelations {
  id: string
  poNumber: string
  status: string
  isDelayed: boolean
  promisedDeliveryDate: Date
  supplier: { name: string }
  category: { name: string }
  alerts: unknown[]
  etaPredictions: Array<{ delayProbability: number }>
}

export async function PurchaseOrdersTable() {
  // Fetch recent purchase orders
  const purchaseOrders = await prisma.purchaseOrder.findMany({
    include: {
      supplier: true,
      category: true,
      etaPredictions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      alerts: {
        where: { status: 'ACTIVE' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'OPEN':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'DELAYED':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-slate-600" />
    }
  }

  const getStatusBadge = (status: string, isDelayed: boolean) => {
    if (isDelayed) {
      return <Badge variant="destructive">Delayed</Badge>
    }
    switch (status) {
      case 'DELIVERED':
        return <Badge variant="default" className="bg-green-600">On Time</Badge>
      case 'OPEN':
        return <Badge variant="secondary">Open</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getRiskLevel = (po: PurchaseOrderWithRelations) => {
    if (po.alerts.length > 0) return 'HIGH'
    if (po.etaPredictions.length > 0) {
      const prediction = po.etaPredictions[0]
      if (prediction.delayProbability > 0.7) return 'HIGH'
      if (prediction.delayProbability > 0.4) return 'MEDIUM'
    }
    return 'LOW'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-600 dark:text-red-400'
      case 'MEDIUM':
        return 'text-orange-600 dark:text-orange-400'
      default:
        return 'text-green-600 dark:text-green-400'
    }
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900">
            <TableHead>PO Number</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Promised Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.map((po) => {
            const riskLevel = getRiskLevel(po)
            return (
              <TableRow key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <TableCell className="font-medium text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(po.status)}
                    {po.poNumber}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {po.supplier.name}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  <Badge variant="outline" className="text-xs">
                    {po.category.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {formatDate(po.promisedDeliveryDate)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(po.status, po.isDelayed)}
                </TableCell>
                <TableCell>
                  <span className={`font-medium text-sm ${getRiskColor(riskLevel)}`}>
                    {riskLevel}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}
