/**
 * GET /api/suppliers
 * 
 * Fetches all suppliers with their performance metrics and statistics.
 * Returns supplier data including:
 * - Basic supplier information
 * - Performance scores and metrics
 * - Recent purchase order statistics
 * - Delay patterns
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface SupplierStats {
  totalOrders: number
  delayedOrders: number
  averageDelayDays: number
  delayRate: number
}

interface EnrichedSupplier {
  id: string
  name: string
  code: string
  country: string
  region: string
  performanceScore: number
  averageDeliveryDays: number
  onTimeDeliveryRate: number
  createdAt: Date
  updatedAt: Date
  performanceHistory: unknown[]
  delayPatterns: unknown[]
  purchaseOrders: Array<{ delayDays: number; isDelayed: boolean }>
  recentStats: SupplierStats
}

export async function GET() {
  try {
    // Fetch all suppliers with related data
    const suppliers = await prisma.supplier.findMany({
      include: {
        performanceHistory: {
          orderBy: { year: 'desc', month: 'desc' },
          take: 3,
        },
        delayPatterns: true,
        purchaseOrders: {
          where: { status: 'DELIVERED' },
          select: { delayDays: true, isDelayed: true },
        },
      },
      orderBy: { performanceScore: 'desc' },
    })

    // Enrich supplier data with calculated metrics
    const enrichedSuppliers: EnrichedSupplier[] = suppliers.map((supplier) => {
      const recentOrders = supplier.purchaseOrders
      const delayedCount = recentOrders.filter((po) => po.isDelayed).length
      const avgDelay =
        recentOrders.length > 0
          ? recentOrders.reduce((sum, po) => sum + po.delayDays, 0) /
            recentOrders.length
          : 0

      return {
        ...supplier,
        recentStats: {
          totalOrders: recentOrders.length,
          delayedOrders: delayedCount,
          averageDelayDays: Math.round(avgDelay * 10) / 10,
          delayRate:
            recentOrders.length > 0
              ? Math.round((delayedCount / recentOrders.length) * 100)
              : 0,
        },
      }
    })

    return NextResponse.json({ data: enrichedSuppliers })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}
