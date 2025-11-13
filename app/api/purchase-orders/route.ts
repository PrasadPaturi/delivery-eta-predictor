/**
 * GET /api/purchase-orders
 * 
 * Fetches purchase orders with optional filtering and pagination.
 * Supports filtering by:
 * - status: OPEN, IN_TRANSIT, DELIVERED, DELAYED, CANCELLED
 * - isDelayed: true/false
 * - supplierId: specific supplier
 * 
 * Query parameters:
 * - page: page number (default: 1)
 * - limit: items per page (default: 20)
 * - status: filter by status
 * - isDelayed: filter by delay status
 * - supplierId: filter by supplier
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface PurchaseOrderFilter {
  status?: string
  isDelayed?: boolean
  supplierId?: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const isDelayed = searchParams.get('isDelayed')
    const supplierId = searchParams.get('supplierId')

    // Build filter conditions
    const where: PurchaseOrderFilter = {}
    if (status) where.status = status
    if (isDelayed !== null) where.isDelayed = isDelayed === 'true'
    if (supplierId) where.supplierId = supplierId

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch purchase orders with related data
    const [purchaseOrders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.purchaseOrder.count({ where }),
    ])

    return NextResponse.json({
      data: purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    )
  }
}
