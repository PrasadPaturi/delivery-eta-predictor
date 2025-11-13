/**
 * Dashboard Page
 * 
 * Main landing page that displays:
 * - Key metrics and KPIs
 * - Active alerts
 * - Recent purchase orders
 * - Supplier performance overview
 * - Delay trends and patterns
 */

import { Suspense } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { AlertsSection } from '@/components/dashboard/alerts-section'
import { PurchaseOrdersTable } from '@/components/dashboard/purchase-orders-table'
import { SupplierPerformance } from '@/components/dashboard/supplier-performance'
import { DelayTrends } from '@/components/dashboard/delay-trends'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Key Metrics
          </h2>
          <Suspense fallback={<MetricsGridSkeleton />}>
            <MetricsGrid />
          </Suspense>
        </section>

        {/* Active Alerts */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Active Alerts
          </h2>
          <Suspense fallback={<AlertsSectionSkeleton />}>
            <AlertsSection />
          </Suspense>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Purchase Orders */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Recent Purchase Orders
            </h2>
            <Suspense fallback={<PurchaseOrdersTableSkeleton />}>
              <PurchaseOrdersTable />
            </Suspense>
          </div>

          {/* Supplier Performance */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Top Suppliers
            </h2>
            <Suspense fallback={<SupplierPerformanceSkeleton />}>
              <SupplierPerformance />
            </Suspense>
          </div>
        </div>

        {/* Delay Trends */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Delay Trends
          </h2>
          <Suspense fallback={<DelayTrendsSkeleton />}>
            <DelayTrends />
          </Suspense>
        </section>
      </main>
    </div>
  )
}

// Skeleton loaders for loading states
function MetricsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  )
}

function AlertsSectionSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  )
}

function PurchaseOrdersTableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  )
}

function SupplierPerformanceSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  )
}

function DelayTrendsSkeleton() {
  return <Skeleton className="h-96 rounded-lg" />
}
