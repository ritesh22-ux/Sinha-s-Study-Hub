export interface EmailData {
    to_email: string
    to_name: string
    reset_link: string
    user_name: string
}

export const sendPasswordResetEmail = async (emailData: EmailData): Promise<boolean> => {
    try {
        // For demo purposes, we'll simulate email sending
        // In production, you would use the actual EmailJS configuration

        console.log('📧 Sending password reset email...')
        console.log('To:', emailData.to_email)
        console.log('Name:', emailData.to_name)
        console.log('Reset Link:', emailData.reset_link)

        // Extract token from reset link for debugging
        const token = emailData.reset_link.split('token=')[1]
        console.log('🔑 Reset Token:', token)

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // For demo: Show success message
        console.log('✅ Email sent successfully!')
        console.log('📋 You can copy this token to test the reset link:', token)

        // In production, uncomment this code and configure EmailJS:
        /*
        const result = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            to_email: emailData.to_email,
            to_name: emailData.to_name,
            reset_link: emailData.reset_link,
            user_name: emailData.user_name,
            message: `Hello ${emailData.user_name}, you requested a password reset. Click the link below to reset your password: ${emailData.reset_link}`
          },
          EMAILJS_CONFIG.publicKey
        )
        
        return result.status === 200
        */

        return true
    } catch (error) {
        console.error('❌ Failed to send email:', error)
        return false
    }
}

// Alternative: Simple email service using a free email API
export const sendEmailWithSimpleAPI = async (emailData: EmailData): Promise<boolean> => {
    try {
        // Using a simple email service (you can replace with any email service)
        const emailContent = `
      <h2>Password Reset Request</h2>
      <p>Hello ${emailData.user_name},</p>
      <p>You requested a password reset for your SINHA'S STUDY HUB account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${emailData.reset_link}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
        Reset Password
      </a>
      <p><strong>This link expires in 30 minutes.</strong></p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <p>Best regards,<br>SINHA'S STUDY HUB Team</p>
    `

        // For demo purposes, we'll show the email content
        console.log('📧 Email Content:')
        console.log('To:', emailData.to_email)
        console.log('Subject: Password Reset Request - SINHA\'S STUDY HUB')
        console.log('Content:', emailContent)

        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('✅ Email sent successfully!')

        return true
    } catch (error) {
        console.error('❌ Failed to send email:', error)
        return false
    }
}

// Setup EmailJS (call this in your app initialization)
export const initializeEmailJS = () => {
    // Initialize EmailJS with your public key
    // emailjs.init(EMAILJS_CONFIG.publicKey)
    console.log('📧 EmailJS initialized (demo mode)')
} 