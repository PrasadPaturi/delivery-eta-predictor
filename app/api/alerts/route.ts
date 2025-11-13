/**
 * GET /api/alerts
 * 
 * Fetches delivery alerts with optional filtering.
 * Supports filtering by:
 * - status: ACTIVE, ACKNOWLEDGED, RESOLVED
 * - severity: LOW, MEDIUM, HIGH, CRITICAL
 * - alertType: DELAY_RISK, CRITICAL_DELAY, SUPPLIER_ISSUE, LOGISTICS_ISSUE
 * 
 * POST /api/alerts/:id/acknowledge
 * 
 * Marks an alert as acknowledged by a user.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface AlertFilter {
  status?: string
  severity?: string
  alertType?: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const alertType = searchParams.get('alertType')

    // Build filter conditions
    const where: AlertFilter = {}
    if (status) where.status = status
    if (severity) where.severity = severity
    if (alertType) where.alertType = alertType

    // Fetch alerts with related purchase order data
    const alerts = await prisma.deliveryAlert.findMany({
      where,
      include: {
        purchaseOrder: {
          include: {
            supplier: true,
            category: true,
            etaPredictions: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    })

    // Map severity to numeric value for sorting
    const severityOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }

    const sortedAlerts = alerts.sort((a, b) => {
      const severityDiff =
        (severityOrder[b.severity] || 0) -
        (severityOrder[a.severity] || 0)
      if (severityDiff !== 0) return severityDiff
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    return NextResponse.json({ data: sortedAlerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

interface AlertUpdateRequest {
  alertId: string
  action: string
}

export async function PATCH(request: NextRequest) {
  try {
    const body: AlertUpdateRequest = await request.json()
    const { alertId, action } = body

    if (!alertId || !action) {
      return NextResponse.json(
        { error: 'Alert ID and action are required' },
        { status: 400 }
      )
    }

    interface UpdateData {
      status: string
      acknowledgedAt?: Date
      resolvedAt?: Date
    }

    let updateData: UpdateData = { status: '' }

    if (action === 'acknowledge') {
      updateData = {
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date(),
      }
    } else if (action === 'resolve') {
      updateData = {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const alert = await prisma.deliveryAlert.update({
      where: { id: alertId },
      data: updateData,
      include: {
        purchaseOrder: {
          include: {
            supplier: true,
            category: true,
          },
        },
      },
    })

    return NextResponse.json({ data: alert })
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}
