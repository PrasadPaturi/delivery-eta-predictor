/**
 * Prisma Database Client Singleton
 * 
 * This module provides a singleton instance of the Prisma Client
 * to prevent multiple instances from being created in development
 * and production environments.
 * 
 * Usage: import { prisma } from '@/lib/db'
 */

import { PrismaClient } from '@prisma/client'

// Declare global type for Prisma Client singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * Create or retrieve the Prisma Client instance
 * In development, reuse the same instance across hot reloads
 * In production, create a new instance
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

// Store the Prisma instance in global scope during development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
