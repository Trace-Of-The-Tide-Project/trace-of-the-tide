import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        articles: {
          where: {
            status: 'published',
          },
          select: {
            id: true,
            title: true,
            heroImage: true,
            createdAt: true,
            updatedAt: true,
            status: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            article: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        likes: {
          select: {
            id: true,
            createdAt: true,
            article: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Combine and sort all activities
    const activities = [
      ...user.articles.map(article => ({
        id: `article-${article.id}`,
        type: 'Published article',
        title: article.title,
        date: article.createdAt,
      })),
      ...user.comments.map(comment => ({
        id: `comment-${comment.id}`,
        type: 'Commented on',
        title: comment.article?.title || 'Unknown article',
        date: comment.createdAt,
      })),
      ...user.likes.map(like => ({
        id: `like-${like.id}`,
        type: 'Liked',
        title: like.article?.title || 'Unknown article',
        date: like.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Return user data
    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
      articlesCount: user.articles.length,
      articles: user.articles,
      activities: activities.map(activity => ({
        ...activity,
        date: new Date(activity.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      })),
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
