import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Check if it's a UUID (ID) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    const openCall = await prisma.openCall.findUnique({
      where: isUUID ? { id: slug } : { slug },
    })

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...openCall,
      createdAt: openCall.createdAt.toISOString(),
      updatedAt: openCall.updatedAt.toISOString(),
      publishedAt: openCall.publishedAt?.toISOString(),
      deadline: openCall.deadline?.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching open call:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
