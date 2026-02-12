import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch all published articles (media content)
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch all published open calls (business content)
    const openCalls = await prisma.openCall.findMany({
      where: {
        status: 'published',
        isActive: true
      },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch all published trips (business content)
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
      },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch all published collections
    const collections = await prisma.collection.findMany({
      where: {
        isActive: true,
        publishedAt: {
          not: null
        }
      },
      include: {
        items: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Combine all content
    const allContent = [
      ...articles.map((content) => ({
        id: content.id,
        title: content.title,
        slug: content.slug,
        type: content.type,
        heroImage: content.heroImage,
        createdAt: content.createdAt.toISOString(),
        author: {
          name: content.author ? `${content.author.firstName} ${content.author.lastName}`.trim() || 'Anonymous' : 'Anonymous',
        },
      })),
      ...openCalls.map((content) => ({
        id: content.id,
        title: content.title,
        slug: content.slug,
        type: 'open_call',
        heroImage: content.heroImage,
        createdAt: content.createdAt.toISOString(),
        author: {
          name: 'Anonymous',
        },
      })),
      ...trips.map((content) => ({
        id: content.id,
        title: content.title,
        slug: content.slug,
        type: 'trip',
        heroImage: content.heroImage || content.coverImage,
        createdAt: content.createdAt.toISOString(),
        author: {
          name: content.author ? `${content.author.firstName} ${content.author.lastName}`.trim() || 'Anonymous' : 'Anonymous',
        },
      })),
      ...collections.map((content) => ({
        id: content.id,
        title: content.title,
        slug: content.slug,
        type: 'collection',
        heroImage: content.coverImage,
        createdAt: content.createdAt.toISOString(),
        articleCount: content.items.length,
        author: {
          name: content.author ? `${content.author.firstName} ${content.author.lastName}`.trim() || 'Anonymous' : 'Anonymous',
        },
      })),
    ]

    // Sort by creation date (most recent first)
    allContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      contents: allContent,
    })
  } catch (error) {
    console.error('Error fetching published contents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
