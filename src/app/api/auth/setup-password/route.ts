import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Verify token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 410 })
    }

    // Check if token is already used
    if (verificationToken.used) {
      return NextResponse.json(
        { error: 'Token has already been used' },
        { status: 410 }
      )
    }

    // Return user info (without sensitive data)
    return NextResponse.json({
      valid: true,
      user: {
        id: verificationToken.user.id,
        firstName: verificationToken.user.firstName,
        lastName: verificationToken.user.lastName,
        email: verificationToken.user.email,
      },
    })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}

// POST - Set password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 410 })
    }

    // Check if token is already used
    if (verificationToken.used) {
      return NextResponse.json(
        { error: 'Token has already been used' },
        { status: 410 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user with password and mark as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        password: hashedPassword,
        isVerified: true,
      },
    })

    // Mark token as used
    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true },
    })

    return NextResponse.json({
      message: 'Password set successfully! You can now log in.',
      success: true,
    })
  } catch (error) {
    console.error('Error setting password:', error)
    return NextResponse.json(
      { error: 'Failed to set password' },
      { status: 500 }
    )
  }
}
