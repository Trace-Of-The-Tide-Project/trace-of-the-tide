import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view media.' },
        { status: 401 }
      )
    }

    // Fetch media from database
    const media = await prisma.media.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this media
    // Users can access their own files, admins can access all files
    if (session.user.role !== 'admin' && media.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have access to this media.' },
        { status: 403 }
      )
    }

    // Read file from secure uploads directory
    const uploadsDir = join(process.cwd(), 'uploads')
    const filepath = join(uploadsDir, media.filepath)

    try {
      const fileBuffer = await readFile(filepath)

      // Set appropriate headers
      const headers = new Headers()
      headers.set('Content-Type', media.mimetype)
      headers.set('Content-Length', media.size.toString())
      headers.set('Cache-Control', 'private, max-age=31536000') // Cache for 1 year since files are immutable

      // Set Content-Disposition for downloads (optional)
      // Uncomment if you want files to download instead of display
      // headers.set('Content-Disposition', `attachment; filename="${media.filename}"`)

      return new NextResponse(fileBuffer, {
        status: 200,
        headers,
      })
    } catch (fileError) {
      console.error('Error reading file:', fileError)
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error serving media:', error)
    return NextResponse.json(
      { error: 'Failed to serve media' },
      { status: 500 }
    )
  }
}
