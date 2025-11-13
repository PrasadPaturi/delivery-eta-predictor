-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "performanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageDeliveryDays" INTEGER NOT NULL DEFAULT 0,
    "onTimeDeliveryRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "averageLeadDays" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "promisedDeliveryDate" TIMESTAMP(3) NOT NULL,
    "actualDeliveryDate" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL,
    "orderValue" DECIMAL(12,2) NOT NULL,
    "shipmentDistance" INTEGER NOT NULL,
    "shipmentMode" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "isDelayed" BOOLEAN NOT NULL DEFAULT false,
    "orderVolume" INTEGER NOT NULL,
    "seasonality" TEXT NOT NULL DEFAULT 'NORMAL',
    "marketCondition" TEXT NOT NULL DEFAULT 'STABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPerformance" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "onTimeOrders" INTEGER NOT NULL,
    "delayedOrders" INTEGER NOT NULL,
    "averageDelayDays" DOUBLE PRECISION NOT NULL,
    "onTimePercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelayPattern" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "triggerCondition" TEXT NOT NULL,
    "minOrderVolume" INTEGER,
    "maxOrderVolume" INTEGER,
    "minOrderValue" DECIMAL(12,2),
    "maxOrderValue" DECIMAL(12,2),
    "shipmentMode" TEXT,
    "seasonality" TEXT,
    "averageDelayDays" INTEGER NOT NULL,
    "delayProbability" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "occurrenceCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DelayPattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ETAPrediction" (
    "id" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "predictedDeliveryDate" TIMESTAMP(3) NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "delayProbability" DOUBLE PRECISION NOT NULL,
    "estimatedDelayDays" INTEGER NOT NULL DEFAULT 0,
    "riskFactors" TEXT[],
    "mitigationActions" TEXT[],
    "modelVersion" TEXT NOT NULL,
    "predictionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ETAPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryAlert" (
    "id" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recommendedActions" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelayAnalysis" (
    "id" TEXT NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalOrdersAnalyzed" INTEGER NOT NULL,
    "delayedOrdersCount" INTEGER NOT NULL,
    "averageDelayDays" DOUBLE PRECISION NOT NULL,
    "maxDelayDays" INTEGER NOT NULL,
    "topDelayFactors" TEXT[],
    "topDelayedSuppliers" TEXT[],
    "topDelayedCategories" TEXT[],
    "insights" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DelayAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE INDEX "Supplier_country_region_idx" ON "Supplier"("country", "region");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_code_key" ON "ProductCategory"("code");

-- CreateIndex
CREATE INDEX "ProductCategory_complexity_riskLevel_idx" ON "ProductCategory"("complexity", "riskLevel");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_poNumber_key" ON "PurchaseOrder"("poNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_categoryId_idx" ON "PurchaseOrder"("supplierId", "categoryId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_isDelayed_idx" ON "PurchaseOrder"("status", "isDelayed");

-- CreateIndex
CREATE INDEX "PurchaseOrder_orderDate_promisedDeliveryDate_idx" ON "PurchaseOrder"("orderDate", "promisedDeliveryDate");

-- CreateIndex
CREATE INDEX "SupplierPerformance_supplierId_year_month_idx" ON "SupplierPerformance"("supplierId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPerformance_supplierId_month_year_key" ON "SupplierPerformance"("supplierId", "month", "year");

-- CreateIndex
CREATE INDEX "DelayPattern_supplierId_categoryId_idx" ON "DelayPattern"("supplierId", "categoryId");

-- CreateIndex
CREATE INDEX "ETAPrediction_poId_idx" ON "ETAPrediction"("poId");

-- CreateIndex
CREATE INDEX "ETAPrediction_delayProbability_idx" ON "ETAPrediction"("delayProbability");

-- CreateIndex
CREATE INDEX "DeliveryAlert_poId_status_idx" ON "DeliveryAlert"("poId", "status");

-- CreateIndex
CREATE INDEX "DeliveryAlert_severity_alertType_idx" ON "DeliveryAlert"("severity", "alertType");

-- CreateIndex
CREATE INDEX "DelayAnalysis_analysisDate_idx" ON "DelayAnalysis"("analysisDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_department_idx" ON "User"("role", "department");

-- CreateIndex
CREATE INDEX "AuditLog_userId_action_idx" ON "AuditLog"("userId", "action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPerformance" ADD CONSTRAINT "SupplierPerformance_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelayPattern" ADD CONSTRAINT "DelayPattern_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelayPattern" ADD CONSTRAINT "DelayPattern_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ETAPrediction" ADD CONSTRAINT "ETAPrediction_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAlert" ADD CONSTRAINT "DeliveryAlert_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
