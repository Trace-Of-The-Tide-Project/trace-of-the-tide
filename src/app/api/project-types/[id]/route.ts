import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - Delete a project type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.projectType.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Project type deleted successfully' })
  } catch (error) {
    console.error('Error deleting project type:', error)
    return NextResponse.json(
      { error: 'Failed to delete project type' },
      { status: 500 }
    )
  }
}
