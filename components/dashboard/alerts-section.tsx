/**
 * Alerts Section Component
 * 
 * Displays active delivery alerts with:
 * - Alert severity indicators
 * - Purchase order details
 * - Recommended actions
 * - Alert acknowledgment functionality
 */

import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react'

export async function AlertsSection() {
  // Fetch active alerts
  const alerts = await prisma.deliveryAlert.findMany({
    where: { status: 'ACTIVE' },
    include: {
      purchaseOrder: {
        include: {
          supplier: true,
          category: true,
        },
      },
    },
    orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    take: 5,
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertOctagon className="w-5 h-5 text-red-600" />
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
      case 'HIGH':
        return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
    }
  }

  if (alerts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          No active alerts. All deliveries are on track!
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {alert.purchaseOrder.poNumber}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {alert.severity}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {alert.purchaseOrder.supplier.name}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {alert.message}
                </p>
                {alert.recommendedActions && alert.recommendedActions.length > 0 && (
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    <p className="font-medium mb-1">Recommended Actions:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {alert.recommendedActions.slice(0, 2).map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              Acknowledge
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
