/**
 * GET /api/predictions
 * 
 * Fetches ETA predictions for purchase orders.
 * Returns predictions with:
 * - Predicted delivery dates
 * - Delay probabilities
 * - Confidence scores
 * - Risk factors and mitigation actions
 * 
 * POST /api/predictions
 * 
 * Generates a new ETA prediction for a given purchase order.
 * Uses historical data and delay patterns to predict delivery dates.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const poId = searchParams.get('poId')

    const where = poId ? { poId } : {}

    // Fetch predictions with related purchase order data
    const predictions = await prisma.eTAPrediction.findMany({
      where,
      include: {
        purchaseOrder: {
          include: {
            supplier: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ data: predictions })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
}

interface PredictionRequest {
  poId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json()
    const { poId } = body

    if (!poId) {
      return NextResponse.json(
        { error: 'Purchase order ID is required' },
        { status: 400 }
      )
    }

    // Fetch the purchase order
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: {
        supplier: true,
        category: true,
      },
    })

    if (!po) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      )
    }

    // Fetch relevant delay patterns for this supplier and category
    const delayPatterns = await prisma.delayPattern.findMany({
      where: {
        supplierId: po.supplierId,
        categoryId: po.categoryId,
      },
    })

    // Calculate prediction based on historical patterns
    let estimatedDelayDays = 0
    let delayProbability = 0
    let confidenceScore = 0.5
    const riskFactors: string[] = []
    const mitigationActions: string[] = []

    // Analyze delay patterns
    for (const pattern of delayPatterns) {
      let patternMatches = true

      // Check if order volume matches pattern
      if (
        pattern.minOrderVolume &&
        po.orderVolume < pattern.minOrderVolume
      ) {
        patternMatches = false
      }
      if (
        pattern.maxOrderVolume &&
        po.orderVolume > pattern.maxOrderVolume
      ) {
        patternMatches = false
      }

      // Check if shipment mode matches
      if (pattern.shipmentMode && po.shipmentMode !== pattern.shipmentMode) {
        patternMatches = false
      }

      // Check if seasonality matches
      if (pattern.seasonality && po.seasonality !== pattern.seasonality) {
        patternMatches = false
      }

      if (patternMatches) {
        estimatedDelayDays = Math.max(
          estimatedDelayDays,
          pattern.averageDelayDays
        )
        delayProbability = Math.max(delayProbability, pattern.delayProbability)
        confidenceScore = Math.max(confidenceScore, pattern.confidence)
        riskFactors.push(pattern.triggerCondition)
      }
    }

    // Add additional risk factors based on supplier performance
    if (po.supplier.onTimeDeliveryRate < 70) {
      riskFactors.push('Low supplier on-time delivery rate')
      delayProbability = Math.min(1, delayProbability + 0.15)
    }

    if (po.category.complexity === 'HIGH') {
      riskFactors.push('High product complexity')
      delayProbability = Math.min(1, delayProbability + 0.1)
    }

    if (po.orderVolume > 100) {
      riskFactors.push('Large order volume')
      delayProbability = Math.min(1, delayProbability + 0.1)
    }

    if (po.shipmentDistance > 5000) {
      riskFactors.push('Long shipment distance')
      delayProbability = Math.min(1, delayProbability + 0.05)
    }

    // Generate mitigation actions
    if (delayProbability > 0.6) {
      mitigationActions.push('Contact supplier immediately for status update')
      mitigationActions.push('Prepare contingency plan with alternate supplier')
    }

    if (po.shipmentMode === 'SEA') {
      mitigationActions.push('Monitor port schedules and shipping delays')
    }

    if (po.category.complexity === 'HIGH') {
      mitigationActions.push('Increase communication frequency with supplier')
    }

    // Calculate predicted delivery date
    const predictedDeliveryDate = new Date(
      po.promisedDeliveryDate.getTime() +
        estimatedDelayDays * 24 * 60 * 60 * 1000
    )

    // Check if prediction already exists
    const existingPrediction = await prisma.eTAPrediction.findFirst({
      where: { poId },
    })

    let prediction
    if (existingPrediction) {
      prediction = await prisma.eTAPrediction.update({
        where: { id: existingPrediction.id },
        data: {
          predictedDeliveryDate,
          confidenceScore,
          delayProbability,
          estimatedDelayDays,
          riskFactors,
          mitigationActions,
        },
      })
    } else {
      prediction = await prisma.eTAPrediction.create({
        data: {
          poId,
          predictedDeliveryDate,
          confidenceScore,
          delayProbability,
          estimatedDelayDays,
          riskFactors,
          mitigationActions,
          modelVersion: '1.0.0',
        },
      })
    }

    return NextResponse.json({ data: prediction })
  } catch (error) {
    console.error('Error creating prediction:', error)
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    )
  }
}
