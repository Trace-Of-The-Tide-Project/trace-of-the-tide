import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Fetch all submissions (admin) or user's own submissions
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const openCallId = searchParams.get('openCallId')

    // Build query based on user role
    const where: any = {}

    // If not admin, only show user's own submissions
    if (user.role !== 'admin') {
      where.userId = user.id
    }

    // Filter by open call if provided
    if (openCallId) {
      where.openCallId = openCallId
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        openCall: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new submission
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, content, mediaUrls, type, openCallId } = body

    // Validate required fields
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, type' },
        { status: 400 }
      )
    }

    // Validate open call exists if provided
    if (openCallId) {
      const openCall = await prisma.openCall.findUnique({
        where: { id: openCallId },
      })

      if (!openCall) {
        return NextResponse.json(
          { error: 'Open call not found' },
          { status: 404 }
        )
      }

      // Check if open call is active
      if (!openCall.isActive || openCall.status !== 'published') {
        return NextResponse.json(
          { error: 'This open call is not accepting submissions' },
          { status: 400 }
        )
      }

      // Check if deadline has passed
      if (openCall.deadline && new Date(openCall.deadline) < new Date()) {
        return NextResponse.json(
          { error: 'The submission deadline has passed' },
          { status: 400 }
        )
      }
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        title,
        description,
        content: content ? JSON.stringify(content) : null,
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null,
        type,
        userId: user.id,
        openCallId: openCallId || null,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        openCall: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({ submission }, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
