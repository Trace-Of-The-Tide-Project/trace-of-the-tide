import nodemailer from 'nodemailer'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Format email address properly
function formatEmailAddress(email: string, name?: string): string {
  if (!isValidEmail(email)) {
    throw new Error(`Invalid email address: ${email}`)
  }
  
  if (name) {
    return `"${name}" <${email}>`
  }
  
  return email
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // Check if email is configured
  if (!process.env.SMTP_HOST) {
    console.warn('Email not configured. Email will not be sent.')
    console.log('To configure email, see FREE_EMAIL_SETUP.md for free options like Mailtrap, Ethereal Email, or MailHog')
    return { success: false, messageId: null, error: 'Email not configured' }
  }

  // Validate recipient email address
  if (!isValidEmail(to)) {
    throw new Error(`Invalid recipient email address: ${to}`)
  }

  // Determine the from address with proper formatting
  let fromAddress: string
  const smtpFrom = process.env.SMTP_FROM
  const smtpUser = process.env.SMTP_USER
  const fromName = process.env.EMAIL_FROM_NAME || 'Articles Dashboard'

  if (smtpFrom && isValidEmail(smtpFrom)) {
    fromAddress = formatEmailAddress(smtpFrom, fromName)
  } else if (smtpUser && isValidEmail(smtpUser)) {
    fromAddress = formatEmailAddress(smtpUser, fromName)
  } else {
    // Fallback to a valid local address
    fromAddress = formatEmailAddress('noreply@localhost', fromName)
  }

  // Use SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    } : undefined,
    // Additional options for various providers
    tls: {
      rejectUnauthorized: false,
    },
  })

  // Send email
  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html,
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Error sending email:', error)
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed. Please check your credentials. ' +
        'For free alternatives, see FREE_EMAIL_SETUP.md'
      )
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Failed to connect to email server. Please check your settings.')
    } else if (error.code === 'EENVELOPE') {
      throw new Error(
        'Invalid email address format. Please check your SMTP_FROM and SMTP_USER environment variables. ' +
        'They should contain valid email addresses like "user@domain.com"'
      )
    }
    
    throw error
  }
}

export function generateRegistrationEmail(
  firstName: string,
  token: string,
  baseUrl: string
) {
  const verificationUrl = `${baseUrl}/auth/setup-password?token=${token}`

  return {
    subject: 'Complete Your Registration',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Articles Dashboard!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Thank you for registering! To complete your registration, please set up your password by clicking the button below:</p>

              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Set Up Your Password</a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>

              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 24 hours for security reasons.
              </div>

              <p>If you didn't request this registration, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Articles Dashboard. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${firstName},

Thank you for registering! To complete your registration, please set up your password by visiting the following link:

${verificationUrl}

This link will expire in 24 hours for security reasons.

If you didn't request this registration, please ignore this email.

© ${new Date().getFullYear()} Articles Dashboard. All rights reserved.
    `,
  }
}
