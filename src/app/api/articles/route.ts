import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/utils/api-response'
import { generateSlug, generateUniqueSlug } from '@/lib/utils/slug'

// GET /api/articles - List all articles with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'published'
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')
    const isFeatured = searchParams.get('isFeatured') === 'true'
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {
      status,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(isFeatured && { isFeatured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          contributors: {
            include: {
              contributor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  slug: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ])

    return successResponse({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return serverErrorResponse()
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      excerpt,
      type = 'standard',
      content,
      heroImage,
      heroVideo,
      heroAudio,
      galleryImages,
      audioTitle,
      audioDuration,
      label,
      readingTime,
      status = 'draft',
      isFeatured = false,
      metaTitle,
      metaDescription,
      authorId,
      categoryId,
      threadId,
      contributors = [],
      tags = [],
    } = body

    // Validate required fields
    if (!title) {
      return errorResponse('Title is required')
    }

    // Generate unique slug
    const baseSlug = generateSlug(title)
    const slug = await generateUniqueSlug(
      baseSlug,
      async (s) => !!(await prisma.article.findUnique({ where: { slug: s } }))
    )

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        type,
        content,
        heroImage,
        heroVideo,
        heroAudio,
        galleryImages,
        audioTitle,
        audioDuration,
        label,
        readingTime,
        status,
        isFeatured,
        metaTitle,
        metaDescription,
        publishedAt: status === 'published' ? new Date() : null,
        ...(authorId && { authorId }),
        ...(categoryId && { categoryId }),
        ...(threadId && { threadId }),
      },
      include: {
        author: true,
        category: true,
        contributors: {
          include: {
            contributor: true,
          },
        },
      },
    })

    // Add contributors if provided
    if (contributors.length > 0) {
      await Promise.all(
        contributors.map((c: any, index: number) =>
          prisma.articleContributor.create({
            data: {
              articleId: article.id,
              contributorId: c.contributorId,
              role: c.role || 'Contributor',
              order: index,
            },
          })
        )
      )
    }

    // Add tags if provided
    if (tags.length > 0) {
      await Promise.all(
        tags.map((tagId: string) =>
          prisma.articleTag.create({
            data: {
              articleId: article.id,
              tagId,
            },
          })
        )
      )
    }

    return successResponse(article, 201)
  } catch (error) {
    console.error('Error creating article:', error)
    return serverErrorResponse()
  }
}
