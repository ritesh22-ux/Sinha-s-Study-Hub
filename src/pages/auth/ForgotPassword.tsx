import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { BookOpen, Mail, ArrowLeft, Mail as MailIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import EmailModal from '../../components/EmailModal'
import { useState } from 'react'

interface ForgotPasswordForm {
    email: string
}

const ForgotPassword = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [emailData, setEmailData] = useState<any>(null)
    const { forgotPassword, isLoading } = useAuthStore()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ForgotPasswordForm>()

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            const result = await forgotPassword(data.email)
            if (result.success) {
                setIsSubmitted(true)
                setUserEmail(data.email)

                // Set email data for modal with genuine reset link
                setEmailData({
                    to_email: data.email,
                    to_name: data.email.split('@')[0], // Use email prefix as name
                    reset_link: `${window.location.origin}/reset-password?token=${result.token || 'demo_token_' + Date.now()}`,
                    user_name: data.email.split('@')[0]
                })

                // Show email modal after a short delay
                setTimeout(() => {
                    setShowEmailModal(true)
                }, 1000)

                toast.success('Password reset link sent to your email!')
            } else {
                toast.error(result.error || 'Failed to send reset link')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        }
    }

    const handleTryAgain = () => {
        // Reset all states
        setIsSubmitted(false)
        setUserEmail('')
        setShowEmailModal(false)
        setEmailData(null)
        reset() // Reset the form
    }

    const handleResendEmail = async () => {
        if (!userEmail) return

        try {
            toast.loading('Sending new reset link...')
            const result = await forgotPassword(userEmail)
            toast.dismiss()

            if (result.success) {
                // Update email data with new genuine reset link
                setEmailData({
                    to_email: userEmail,
                    to_name: userEmail.split('@')[0],
                    reset_link: `${window.location.origin}/reset-password?token=${result.token || 'demo_token_' + Date.now()}`,
                    user_name: userEmail.split('@')[0]
                })

                // Show email modal again
                setShowEmailModal(true)
                toast.success('New reset link sent!')
            } else {
                toast.error(result.error || 'Failed to send new reset link')
            }
        } catch (error) {
            toast.dismiss()
            toast.error('Something went wrong. Please try again.')
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8"
                >
                    {/* Success Message */}
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4"
                        >
                            <MailIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Check Your Email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            We've sent a password reset link to
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                            {userEmail}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                            Click the link in the email to reset your password
                        </p>
                    </div>

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    >
                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                    What to do next:
                                </h3>
                                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>• Check your email inbox</li>
                                    <li>• Look in spam/junk folder if not found</li>
                                    <li>• Click the reset link in the email</li>
                                    <li>• Create a new password</li>
                                    <li>• Link expires in 30 minutes</li>
                                </ul>
                            </div>

                            <div className="text-center space-y-3">
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    Didn't receive the email?
                                </p>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={handleResendEmail}
                                        disabled={isLoading}
                                        className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Sending...' : 'Resend Email'}
                                    </button>
                                    <button
                                        onClick={handleTryAgain}
                                        className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        Try different email
                                    </button>
                                </div>
                            </div>

                            <Link
                                to="/login"
                                className="w-full btn-primary flex items-center justify-center py-3"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Email Modal */}
                {emailData && (
                    <EmailModal
                        isOpen={showEmailModal}
                        onClose={() => setShowEmailModal(false)}
                        emailData={emailData}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Header */}
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mb-4"
                    >
                        <BookOpen className="h-8 w-8 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    className="input-field pl-10"
                                    placeholder="Enter your email address"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex items-center justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    {/* Back to Login */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    )
}

export default ForgotPassword 