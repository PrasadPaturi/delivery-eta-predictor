/**
 * Metrics Grid Component
 * 
 * Displays key performance indicators:
 * - Total Purchase Orders
 * - On-Time Delivery Rate
 * - Average Delay Days
 * - At-Risk Orders
 */

import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

interface MetricItem {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend: string
  trendUp: boolean
}

export async function MetricsGrid() {
  // Fetch metrics from database
  const [totalOrders, delayedOrders, activeAlerts] = await Promise.all([
    prisma.purchaseOrder.count(),
    prisma.purchaseOrder.count({ where: { isDelayed: true } }),
    prisma.deliveryAlert.count({ where: { status: 'ACTIVE' } }),
  ])

  // Calculate on-time delivery rate
  const onTimeOrders = totalOrders - delayedOrders
  const onTimeRate = totalOrders > 0 ? Math.round((onTimeOrders / totalOrders) * 100) : 0

  // Fetch average delay days
  const delayStats = await prisma.purchaseOrder.aggregate({
    _avg: { delayDays: true },
    where: { isDelayed: true },
  })
  const avgDelayDays = delayStats._avg.delayDays
    ? Math.round(delayStats._avg.delayDays * 10) / 10
    : 0

  const metrics: MetricItem[] = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: CheckCircle,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'On-Time Rate',
      value: `${onTimeRate}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Avg Delay',
      value: `${avgDelayDays} days`,
      icon: TrendingDown,
      color: 'bg-orange-500',
      trend: '-2 days',
      trendUp: false,
    },
    {
      title: 'At-Risk Orders',
      value: activeAlerts,
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: '-3',
      trendUp: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {metric.value}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    metric.trendUp
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.trend} from last month
                </p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
