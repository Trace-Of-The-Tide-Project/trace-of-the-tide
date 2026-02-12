import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        items: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
                type: true,
                heroImage: true,
                createdAt: true,
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...collection,
      articleCount: collection.items.length,
      articles: collection.items.map(item => item.article),
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
      publishedAt: collection.publishedAt?.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
