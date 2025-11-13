/**
 * Delay Trends Component
 * 
 * Displays historical delay trends and patterns:
 * - Monthly delay statistics
 * - Trend analysis
 * - Category-wise delay breakdown
 */

import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export async function DelayTrends() {
  // Fetch delay patterns
  const delayPatterns = await prisma.delayPattern.findMany({
    include: {
      supplier: true,
      category: true,
    },
    orderBy: { delayProbability: 'desc' },
    take: 10,
  })

  // Fetch category-wise delay statistics
  const categoryStats = await prisma.purchaseOrder.groupBy({
    by: ['categoryId'],
    _count: true,
    _avg: { delayDays: true },
    where: { isDelayed: true },
  })

  const categories = await prisma.productCategory.findMany({
    where: {
      id: {
        in: categoryStats.map((stat) => stat.categoryId),
      },
    },
  })

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]))

  const getRiskColor = (probability: number) => {
    if (probability > 0.7) return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
    if (probability > 0.5) return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
    return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Delay Patterns */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Top Delay Patterns
        </h3>
        <div className="space-y-3">
          {delayPatterns.map((pattern, index) => (
            <div
              key={pattern.id}
              className="flex items-start justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {pattern.supplier.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {pattern.category.name}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {pattern.triggerCondition}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Avg Delay: <span className="font-semibold">{pattern.averageDelayDays}d</span>
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Occurrences: <span className="font-semibold">{pattern.occurrenceCount}</span>
                  </span>
                </div>
              </div>
              <Badge className={getRiskColor(pattern.delayProbability)}>
                {Math.round(pattern.delayProbability * 100)}%
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Category-wise Delays */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Delays by Category
        </h3>
        <div className="space-y-3">
          {categoryStats.map((stat) => {
            const category = categoryMap.get(stat.categoryId)
            if (!category) return null

            const avgDelay = stat._avg.delayDays
              ? Math.round(stat._avg.delayDays * 10) / 10
              : 0

            return (
              <div
                key={stat.categoryId}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {category.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {stat._count} delayed orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {avgDelay}d
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    avg delay
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
