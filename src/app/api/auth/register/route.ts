import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateRegistrationEmail } from '@/lib/email'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      experienceField,
      aboutYourself,
      facebook,
      twitter,
      instagram,
      linkedin,
      otherLinks,
      projectTypeIds,
      availability,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !experienceField) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user (without password yet)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        experienceField,
        aboutYourself: aboutYourself || null,
        facebook: facebook || null,
        twitter: twitter || null,
        instagram: instagram || null,
        linkedin: linkedin || null,
        otherLinks: otherLinks ? JSON.stringify(otherLinks) : null,
      },
    })

    // Add project type associations
    if (projectTypeIds && Array.isArray(projectTypeIds)) {
      await Promise.all(
        projectTypeIds.map((projectTypeId: string) =>
          prisma.userProjectType.create({
            data: {
              userId: user.id,
              projectTypeId,
            },
          })
        )
      )
    }

    // Add availability slots
    if (availability && Array.isArray(availability)) {
      await Promise.all(
        availability.map((slot: any) =>
          prisma.availability.create({
            data: {
              userId: user.id,
              startDate: new Date(slot.startDate),
              endDate: new Date(slot.endDate),
              startTime: slot.startTime,
              endTime: slot.endTime,
              dayOfWeek: slot.dayOfWeek || null,
              notes: slot.notes || null,
            },
          })
        )
      )
    }

    // Generate verification token
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token,
        type: 'registration',
        expiresAt,
      },
    })

    // Send registration email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const emailContent = generateRegistrationEmail(firstName, token, baseUrl)

    try {
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the registration if email fails
      // In production, you might want to queue this for retry
    }

    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email to complete setup.',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
