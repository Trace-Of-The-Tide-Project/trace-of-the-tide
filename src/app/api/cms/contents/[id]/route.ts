import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    || 'untitled'
}

// GET - Fetch single content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to find in Article table first
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        type: true,
        excerpt: true,
        heroImage: true,
        heroVideo: true,
        heroAudio: true,
        content: true,
        status: true,
        metaTitle: true,
        metaDescription: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              }
            }
          }
        }
      },
    })

    // Use a flexible content object
    let content: {
      id: string
      title: string
      type: string
      heroImage: string | null
      content: string | null
      status: string
      createdAt: Date
      updatedAt: Date
      excerpt?: string | null
      heroVideo?: string | null
      heroAudio?: string | null
      metaTitle?: string | null
      metaDescription?: string | null
      categoryId?: string | null
      tags?: { tag: { name: string } }[]
    } | null = article

    // If not found, try OpenCall table
    if (!content) {
      const openCall = await prisma.openCall.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          heroImage: true,
          content: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      if (openCall) {
        content = { ...openCall, type: 'open_call' }
      }
    }

    // If still not found, try Trip table
    if (!content) {
      const trip = await prisma.trip.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          heroImage: true,
          content: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      if (trip) {
        content = { ...trip, type: 'trip' }
      }
    }

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Parse blocks from content JSON
    let blocks = []
    try {
      if (content.content) {
        const parsedContent = JSON.parse(content.content)
        blocks = parsedContent.blocks || []
      }
    } catch (e) {
      // If content is not JSON, ignore
    }

    // Extract tag names if article has tags
    const tagNames = 'tags' in content && Array.isArray(content.tags)
      ? content.tags.map((t: { tag: { name: string } }) => t.tag.name)
      : []

    return NextResponse.json({
      ...content,
      blocks,
      tags: tagNames,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new content
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params // We don't need id for POST, but await params anyway
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { 
      type, 
      title, 
      heroImage,
      heroVideo,
      heroAudio,
      blocks, 
      status,
      categoryId,
      category, // Category name (will be converted to ID)
      tags,
      metaTitle,
      metaDescription,
      excerpt
    } = body

    // Create content JSON from blocks
    const contentJSON = JSON.stringify({ blocks })

    // Resolve category ID from name or ID
    let resolvedCategoryId: string | null = null
    if (categoryId) {
      // If categoryId is provided, use it directly
      resolvedCategoryId = categoryId
    } else if (category && typeof category === 'string' && category.trim()) {
      // Try to find category by name or create it
      const existingCategory = await prisma.category.findFirst({
        where: { 
          OR: [
            { name: { equals: category, mode: 'insensitive' } },
            { slug: generateSlug(category) }
          ]
        }
      })
      if (existingCategory) {
        resolvedCategoryId = existingCategory.id
      } else {
        // Create new category
        const newCategory = await prisma.category.create({
          data: {
            name: category,
            slug: generateSlug(category),
          }
        })
        resolvedCategoryId = newCategory.id
      }
    }

    // Generate slug from title
    const baseSlug = generateSlug(title || 'Untitled')
    let slug = baseSlug
    let counter = 1

    // Handle business content (OpenCall or Trip)
    if (type === 'open_call') {
      // Ensure slug is unique for OpenCall
      while (await prisma.openCall.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      const openCall = await prisma.openCall.create({
        data: {
          title: title || 'Untitled',
          slug,
          description: excerpt || title || 'Untitled',
          content: contentJSON,
          heroImage,
          status: status || 'draft',
        },
      })

      return NextResponse.json({
        id: openCall.id,
        message: 'Open call created successfully',
      })
    }

    if (type === 'trip') {
      // Ensure slug is unique for Trip
      while (await prisma.trip.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      const trip = await prisma.trip.create({
        data: {
          title: title || 'Untitled',
          slug,
          description: excerpt || title || 'Untitled',
          content: contentJSON,
          heroImage,
          status: status || 'draft',
          authorId: user.id,
          categoryId: resolvedCategoryId,
        },
      })

      return NextResponse.json({
        id: trip.id,
        message: 'Trip created successfully',
      })
    }

    // Handle media content (Article)
    // Ensure slug is unique
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create article with all fields
    const article = await prisma.article.create({
      data: {
        title: title || 'Untitled',
        slug,
        type: type || 'standard',
        excerpt: excerpt || null,
        heroImage: heroImage || null,
        heroVideo: heroVideo || null,
        heroAudio: heroAudio || null,
        content: contentJSON,
        status: status || 'draft',
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        authorId: user.id,
        categoryId: resolvedCategoryId,
        publishedAt: status === 'published' ? new Date() : null,
      },
    })

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        })
        
        if (!tag) {
          const tagSlug = generateSlug(tagName)
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: tagSlug,
            }
          })
        }

        // Create article-tag relation
        await prisma.articleTag.create({
          data: {
            articleId: article.id,
            tagId: tag.id,
          }
        })
      }
    }

    return NextResponse.json({
      id: article.id,
      message: 'Content created successfully',
    })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update existing content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      type, 
      title, 
      heroImage,
      heroVideo,
      heroAudio,
      blocks, 
      status,
      categoryId,
      category, // Category name (will be converted to ID)
      tags,
      metaTitle,
      metaDescription,
      excerpt
    } = body

    // Create content JSON from blocks
    const contentJSON = JSON.stringify({ blocks })

    // Resolve category ID from name or ID
    let resolvedCategoryId: string | null = null
    if (categoryId) {
      resolvedCategoryId = categoryId
    } else if (category && typeof category === 'string' && category.trim()) {
      const existingCategory = await prisma.category.findFirst({
        where: { 
          OR: [
            { name: { equals: category, mode: 'insensitive' } },
            { slug: generateSlug(category) }
          ]
        }
      })
      if (existingCategory) {
        resolvedCategoryId = existingCategory.id
      } else {
        const newCategory = await prisma.category.create({
          data: {
            name: category,
            slug: generateSlug(category),
          }
        })
        resolvedCategoryId = newCategory.id
      }
    }

    // Handle OpenCall update
    if (type === 'open_call') {
      const currentOpenCall = await prisma.openCall.findUnique({
        where: { id },
      })

      if (!currentOpenCall) {
        return NextResponse.json({ error: 'Open call not found' }, { status: 404 })
      }

      // Generate new slug if title changed
      let slug = currentOpenCall.slug
      if (title && title !== currentOpenCall.title) {
        const baseSlug = generateSlug(title)
        slug = baseSlug
        let counter = 1

        while (true) {
          const existing = await prisma.openCall.findUnique({ where: { slug } })
          if (!existing || existing.id === id) break
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }

      const openCall = await prisma.openCall.update({
        where: { id },
        data: {
          title: title || 'Untitled',
          slug,
          description: title || 'Untitled',
          heroImage,
          content: contentJSON,
          status: status || 'draft',
          publishedAt: status === 'published' ? new Date() : currentOpenCall.publishedAt,
        },
      })

      return NextResponse.json({
        id: openCall.id,
        message: 'Open call updated successfully',
      })
    }

    // Handle Trip update
    if (type === 'trip') {
      const currentTrip = await prisma.trip.findUnique({
        where: { id },
      })

      if (!currentTrip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
      }

      // Generate new slug if title changed
      let slug = currentTrip.slug
      if (title && title !== currentTrip.title) {
        const baseSlug = generateSlug(title)
        slug = baseSlug
        let counter = 1

        while (true) {
          const existing = await prisma.trip.findUnique({ where: { slug } })
          if (!existing || existing.id === id) break
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }

      const trip = await prisma.trip.update({
        where: { id },
        data: {
          title: title || 'Untitled',
          slug,
          description: title || 'Untitled',
          heroImage,
          content: contentJSON,
          status: status || 'draft',
          publishedAt: status === 'published' ? new Date() : currentTrip.publishedAt,
        },
      })

      return NextResponse.json({
        id: trip.id,
        message: 'Trip updated successfully',
      })
    }

    // Handle Article update
    const currentArticle = await prisma.article.findUnique({
      where: { id },
    })

    if (!currentArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Generate new slug if title changed
    let slug = currentArticle.slug
    if (title && title !== currentArticle.title) {
      const baseSlug = generateSlug(title)
      slug = baseSlug
      let counter = 1

      while (true) {
        const existing = await prisma.article.findUnique({ where: { slug } })
        if (!existing || existing.id === id) break
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title || 'Untitled',
        slug,
        type: type || 'standard',
        excerpt: excerpt || null,
        heroImage: heroImage || null,
        heroVideo: heroVideo || null,
        heroAudio: heroAudio || null,
        content: contentJSON,
        status: status || 'draft',
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        categoryId: resolvedCategoryId,
        publishedAt: status === 'published' && !currentArticle.publishedAt ? new Date() : currentArticle.publishedAt,
      },
    })

    // Handle tags if provided - first remove existing, then add new
    if (tags && Array.isArray(tags)) {
      // Remove existing tags
      await prisma.articleTag.deleteMany({
        where: { articleId: article.id }
      })

      // Add new tags
      for (const tagName of tags) {
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        })
        
        if (!tag) {
          const tagSlug = generateSlug(tagName)
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug: tagSlug,
            }
          })
        }

        await prisma.articleTag.create({
          data: {
            articleId: article.id,
            tagId: tag.id,
          }
        })
      }
    }

    return NextResponse.json({
      id: article.id,
      message: 'Content updated successfully',
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.article.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
