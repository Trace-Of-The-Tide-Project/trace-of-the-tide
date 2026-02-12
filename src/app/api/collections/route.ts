import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        isActive: true,
      },
      include: {
        items: {
          include: {
            article: true
          }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedCollections = collections.map(collection => ({
      id: collection.id,
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      coverImage: collection.coverImage,
      articleCount: collection.items.length,
      totalDuration: collection.totalDuration,
      createdAt: collection.createdAt.toISOString(),
      publishedAt: collection.publishedAt?.toISOString(),
      author: collection.author ? {
        name: `${collection.author.firstName} ${collection.author.lastName}`.trim() || 'Anonymous'
      } : { name: 'Anonymous' }
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}
