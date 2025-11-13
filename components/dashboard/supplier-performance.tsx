/**
 * Supplier Performance Component
 * 
 * Displays top suppliers ranked by performance score with:
 * - Performance score visualization
 * - On-time delivery rate
 * - Average delivery days
 * - Recent order statistics
 */

import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

export async function SupplierPerformance() {
  // Fetch top suppliers by performance score
  const suppliers = await prisma.supplier.findMany({
    include: {
      purchaseOrders: {
        where: { status: 'DELIVERED' },
        select: { delayDays: true, isDelayed: true },
      },
    },
    orderBy: { performanceScore: 'desc' },
    take: 5,
  })

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    if (score >= 75) return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
    return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }

  return (
    <div className="space-y-3">
      {suppliers.map((supplier) => {
        const recentOrders = supplier.purchaseOrders
        const delayedCount = recentOrders.filter((po) => po.isDelayed).length
        const delayRate =
          recentOrders.length > 0
            ? Math.round((delayedCount / recentOrders.length) * 100)
            : 0

        return (
          <Card key={supplier.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {supplier.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {supplier.region} • {supplier.country}
                  </p>
                </div>
                <Badge className={getPerformanceColor(supplier.performanceScore)}>
                  {supplier.performanceScore}
                </Badge>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">On-Time Rate</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {supplier.onTimeDeliveryRate}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Avg Delivery</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {supplier.averageDeliveryDays}d
                  </p>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center gap-2 text-xs">
                {delayRate < 30 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 dark:text-green-400">
                      {delayRate}% delay rate
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 dark:text-red-400">
                      {delayRate}% delay rate
                    </span>
                  </>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
