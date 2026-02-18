import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/utils/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return errorResponse('Email is required')
    }

    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      return errorResponse('Invalid email format')
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmed.toLowerCase() },
    })

    if (!user) {
      return successResponse({ message: 'If an account exists, you will receive a reset link.' })
    }

    // TODO: generate reset token, save to DB, send email via lib/email
    return successResponse({ message: 'If an account exists, you will receive a reset link.' })
  } catch {
    return serverErrorResponse()
  }
}
