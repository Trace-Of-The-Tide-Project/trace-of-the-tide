import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/utils/api-response'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return errorResponse('All fields are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email format')
    }

    // Validate password length
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters long')
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse('User with this email already exists', 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: true, // Auto-verify for now, add email verification later
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    })

    // Create verification token (for future email verification)
    const token = randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: 'registration',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })

    return successResponse(
      {
        user,
        message: 'Account created successfully! You can now login.',
      },
      201
    )
  } catch (error: any) {
    console.error('Error creating user:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    })
    return errorResponse(
      process.env.NODE_ENV === 'development'
        ? `Error: ${error?.message || 'Unknown error'}`
        : 'Internal server error',
      500
    )
  }
}
