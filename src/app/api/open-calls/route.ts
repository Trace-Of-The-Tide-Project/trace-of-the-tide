import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const openCalls = await prisma.openCall.findMany({
      where: {
        status: 'published',
        isActive: true
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      openCalls: openCalls.map((openCall) => ({
        ...openCall,
        createdAt: openCall.createdAt.toISOString(),
        updatedAt: openCall.updatedAt.toISOString(),
        publishedAt: openCall.publishedAt?.toISOString(),
        deadline: openCall.deadline?.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching open calls:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
