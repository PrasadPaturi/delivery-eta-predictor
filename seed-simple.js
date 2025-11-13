const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.auditLog.deleteMany({})
  await prisma.delayAnalysis.deleteMany({})
  await prisma.deliveryAlert.deleteMany({})
  await prisma.eTAPrediction.deleteMany({})
  await prisma.delayPattern.deleteMany({})
  await prisma.purchaseOrder.deleteMany({})
  await prisma.supplierPerformance.deleteMany({})
  await prisma.productCategory.deleteMany({})
  await prisma.supplier.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('✓ Cleared existing data')

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'TechSupply Global',
        code: 'SUP001',
        country: 'China',
        region: 'Asia',
        performanceScore: 85,
        averageDeliveryDays: 12,
        onTimeDeliveryRate: 88,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'European Components Ltd',
        code: 'SUP002',
        country: 'Germany',
        region: 'Europe',
        performanceScore: 92,
        averageDeliveryDays: 8,
        onTimeDeliveryRate: 95,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'India Manufacturing Co',
        code: 'SUP003',
        country: 'India',
        region: 'Asia',
        performanceScore: 72,
        averageDeliveryDays: 18,
        onTimeDeliveryRate: 68,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'US Industrial Supply',
        code: 'SUP004',
        country: 'USA',
        region: 'North America',
        performanceScore: 88,
        averageDeliveryDays: 6,
        onTimeDeliveryRate: 92,
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Southeast Asia Trading',
        code: 'SUP005',
        country: 'Vietnam',
        region: 'Asia',
        performanceScore: 65,
        averageDeliveryDays: 22,
        onTimeDeliveryRate: 55,
      },
    }),
  ])

  console.log(`✓ Created ${suppliers.length} suppliers`)

  // Create Product Categories
  const categories = await Promise.all([
    prisma.productCategory.create({
      data: {
        name: 'IT Hardware',
        code: 'CAT001',
        complexity: 'HIGH',
        averageLeadDays: 14,
        riskLevel: 'HIGH',
      },
    }),
    prisma.productCategory.create({
      data: {
        name: 'Raw Materials',
        code: 'CAT002',
        complexity: 'LOW',
        averageLeadDays: 7,
        riskLevel: 'LOW',
      },
    }),
    prisma.productCategory.create({
      data: {
        name: 'Electronic Components',
        code: 'CAT003',
        complexity: 'MEDIUM',
        averageLeadDays: 10,
        riskLevel: 'MEDIUM',
      },
    }),
    prisma.productCategory.create({
      data: {
        name: 'Machinery & Equipment',
        code: 'CAT004',
        complexity: 'HIGH',
        averageLeadDays: 21,
        riskLevel: 'HIGH',
      },
    }),
    prisma.productCategory.create({
      data: {
        name: 'Packaging Materials',
        code: 'CAT005',
        complexity: 'LOW',
        averageLeadDays: 5,
        riskLevel: 'LOW',
      },
    }),
  ])

  console.log(`✓ Created ${categories.length} product categories`)

  // Create historical Purchase Orders
  const purchaseOrders = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const supplier = suppliers[i % suppliers.length]
    const category = categories[i % categories.length]
    const orderDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    const promisedDeliveryDate = new Date(orderDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    const shouldDelay = Math.random() < 0.35
    const delayDays = shouldDelay ? Math.floor(Math.random() * 15) + 2 : Math.floor(Math.random() * 3)
    const actualDeliveryDate = new Date(promisedDeliveryDate.getTime() + delayDays * 24 * 60 * 60 * 1000)
    
    const quantity = Math.floor(Math.random() * 200) + 10
    const orderValue = Math.floor(Math.random() * 50000) + 5000

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-2025-${String(i + 1).padStart(5, '0')}`,
        supplierId: supplier.id,
        categoryId: category.id,
        orderDate,
        promisedDeliveryDate,
        actualDeliveryDate,
        quantity,
        orderValue: orderValue.toString(),
        shipmentDistance: Math.floor(Math.random() * 8000) + 500,
        shipmentMode: ['AIR', 'SEA', 'ROAD', 'RAIL'][Math.floor(Math.random() * 4)],
        originCountry: supplier.country,
        destinationCountry: 'India',
        status: 'DELIVERED',
        delayDays,
        isDelayed: delayDays > 2,
        orderVolume: quantity,
        seasonality: ['PEAK', 'NORMAL', 'LOW'][Math.floor(Math.random() * 3)],
        marketCondition: ['STABLE', 'VOLATILE', 'DISRUPTED'][Math.floor(Math.random() * 3)],
      },
    })
    purchaseOrders.push(po)
  }

  console.log(`✓ Created ${purchaseOrders.length} historical purchase orders`)

  // Create Supplier Performance metrics
  for (const supplier of suppliers) {
    for (let month = 1; month <= 3; month++) {
      const year = 2025
      const supplierOrders = purchaseOrders.filter(po => po.supplierId === supplier.id)
      const monthOrders = supplierOrders.filter(po => po.orderDate.getMonth() + 1 === month)
      
      if (monthOrders.length > 0) {
        const onTimeOrders = monthOrders.filter(po => !po.isDelayed).length
        
        await prisma.supplierPerformance.create({
          data: {
            supplierId: supplier.id,
            month,
            year,
            totalOrders: monthOrders.length,
            onTimeOrders,
            delayedOrders: monthOrders.length - onTimeOrders,
            averageDelayDays: monthOrders.reduce((sum, po) => sum + po.delayDays, 0) / monthOrders.length,
            onTimePercentage: (onTimeOrders / monthOrders.length) * 100,
          },
        })
      }
    }
  }

  console.log('✓ Created supplier performance metrics')

  // Create Delay Patterns
  await Promise.all([
    prisma.delayPattern.create({
      data: {
        supplierId: suppliers[0].id,
        categoryId: categories[0].id,
        triggerCondition: 'ORDER_VOLUME > 50',
        minOrderVolume: 50,
        averageDelayDays: 7,
        delayProbability: 0.65,
        confidence: 0.82,
        occurrenceCount: 12,
      },
    }),
    prisma.delayPattern.create({
      data: {
        supplierId: suppliers[2].id,
        categoryId: categories[3].id,
        triggerCondition: 'SHIPMENT_MODE = SEA',
        shipmentMode: 'SEA',
        averageDelayDays: 12,
        delayProbability: 0.78,
        confidence: 0.88,
        occurrenceCount: 18,
      },
    }),
    prisma.delayPattern.create({
      data: {
        supplierId: suppliers[4].id,
        categoryId: categories[0].id,
        triggerCondition: 'SEASONALITY = PEAK',
        seasonality: 'PEAK',
        averageDelayDays: 15,
        delayProbability: 0.85,
        confidence: 0.91,
        occurrenceCount: 22,
      },
    }),
  ])

  console.log('✓ Created delay patterns')

  // Create open Purchase Orders
  const openPOs = await Promise.all([
    prisma.purchaseOrder.create({
      data: {
        poNumber: 'PO-2025-OPEN-001',
        supplierId: suppliers[0].id,
        categoryId: categories[0].id,
        orderDate: new Date(),
        promisedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        quantity: 75,
        orderValue: '45000',
        shipmentDistance: 5000,
        shipmentMode: 'AIR',
        originCountry: 'China',
        destinationCountry: 'India',
        status: 'OPEN',
        orderVolume: 75,
        seasonality: 'PEAK',
        marketCondition: 'STABLE',
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber: 'PO-2025-OPEN-002',
        supplierId: suppliers[2].id,
        categoryId: categories[3].id,
        orderDate: new Date(),
        promisedDeliveryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        quantity: 30,
        orderValue: '120000',
        shipmentDistance: 3500,
        shipmentMode: 'SEA',
        originCountry: 'India',
        destinationCountry: 'India',
        status: 'OPEN',
        orderVolume: 30,
        seasonality: 'NORMAL',
        marketCondition: 'VOLATILE',
      },
    }),
  ])

  console.log(`✓ Created ${openPOs.length} open purchase orders`)

  // Create ETA Predictions
  for (const po of openPOs) {
    await prisma.eTAPrediction.create({
      data: {
        poId: po.id,
        predictedDeliveryDate: new Date(po.promisedDeliveryDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        confidenceScore: 0.78,
        delayProbability: 0.65,
        estimatedDelayDays: 5,
        riskFactors: ['High order volume', 'Peak season', 'Complex product category'],
        mitigationActions: ['Contact supplier for expedited processing', 'Arrange backup logistics'],
        modelVersion: '1.0.0',
      },
    })
  }

  console.log('✓ Created ETA predictions')

  // Create alerts
  for (const po of openPOs) {
    await prisma.deliveryAlert.create({
      data: {
        poId: po.id,
        alertType: 'DELAY_RISK',
        severity: 'HIGH',
        message: `High risk of delivery delay detected for PO ${po.poNumber}. Supplier has historical pattern of delays with similar order parameters.`,
        recommendedActions: [
          'Contact supplier immediately for status update',
          'Prepare contingency plan with alternate supplier',
          'Expedite logistics arrangements',
        ],
        status: 'ACTIVE',
      },
    })
  }

  console.log('✓ Created delivery alerts')

  // Create users
  await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@company.com',
        name: 'Admin User',
        role: 'ADMIN',
        department: 'PROCUREMENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@company.com',
        name: 'Procurement Manager',
        role: 'MANAGER',
        department: 'PROCUREMENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'logistics@company.com',
        name: 'Logistics Coordinator',
        role: 'MANAGER',
        department: 'LOGISTICS',
      },
    }),
  ])

  console.log('✓ Created sample users')
  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
