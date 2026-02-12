import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List all active project types
export async function GET() {
  try {
    const projectTypes = await prisma.projectType.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(projectTypes)
  } catch (error) {
    console.error('Error fetching project types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project types' },
      { status: 500 }
    )
  }
}

// POST - Create new project type (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Project type name is required' },
        { status: 400 }
      )
    }

    // Get the highest order value
    const lastProjectType = await prisma.projectType.findFirst({
      orderBy: { order: 'desc' },
    })

    const projectType = await prisma.projectType.create({
      data: {
        name,
        description: description || null,
        order: (lastProjectType?.order || 0) + 1,
      },
    })

    return NextResponse.json(projectType, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Project type with this name already exists' },
        { status: 409 }
      )
    }
    console.error('Error creating project type:', error)
    return NextResponse.json(
      { error: 'Failed to create project type' },
      { status: 500 }
    )
  }
}
