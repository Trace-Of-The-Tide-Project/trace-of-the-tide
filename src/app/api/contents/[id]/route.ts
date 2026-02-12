import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content ID' },
        { status: 400 }
      )
    }

    const content = await prisma.article.findUnique({
      where: {
        id: id,
        status: 'published'
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            bio: true,
          },
        },
      },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      content: {
        id: content.id,
        title: content.title,
        slug: content.slug,
        type: content.type,
        heroImage: content.heroImage,
        content: content.content,
        createdAt: content.createdAt.toISOString(),
        updatedAt: content.updatedAt.toISOString(),
        author: content.author ? {
          id: content.author.id,
          name: `${content.author.firstName} ${content.author.lastName}`.trim() || 'Anonymous',
          firstName: content.author.firstName,
          lastName: content.author.lastName,
          email: content.author.email,
          avatar: content.author.avatar,
          bio: content.author.bio,
        } : {
          id: '',
          name: 'Anonymous',
          firstName: '',
          lastName: '',
          email: '',
          avatar: null,
          bio: null,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
