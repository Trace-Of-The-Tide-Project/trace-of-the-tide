import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Count users
    const userCount = await prisma.user.count()
    
    return Response.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return Response.json(
      {
        success: false,
        error: error?.message || 'Unknown error',
        code: error?.code,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
