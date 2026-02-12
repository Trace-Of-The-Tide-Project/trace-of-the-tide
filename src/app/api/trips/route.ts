import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        status: 'published',
        isActive: true
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      trips: trips.map((trip) => ({
        ...trip,
        createdAt: trip.createdAt.toISOString(),
        updatedAt: trip.updatedAt.toISOString(),
        publishedAt: trip.publishedAt?.toISOString(),
        startDate: trip.startDate?.toISOString(),
        endDate: trip.endDate?.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
