import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { BookOpen, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'

interface ResetPasswordForm {
    password: string
    confirmPassword: string
}

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isValidToken, setIsValidToken] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { resetPassword, validateResetToken } = useAuthStore()

    const token = searchParams.get('token')

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ResetPasswordForm>()

    const password = watch('password')

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link')
            navigate('/forgot-password')
            return
        }

        const valid = validateResetToken(token)
        setIsValidToken(valid)
        setIsLoading(false)

        if (!valid) {
            toast.error('Reset link is invalid or has expired')
            navigate('/forgot-password')
        }
    }, [token, validateResetToken, navigate])

    const onSubmit = async (data: ResetPasswordForm) => {
        if (data.password !== data.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (!token) {
            toast.error('Invalid reset token')
            return
        }

        try {
            const result = await resetPassword(token, data.password)
            if (result.success) {
                setIsSubmitted(true)
                toast.success('Password reset successfully!')
            } else {
                toast.error(result.error || 'Failed to reset password')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Validating reset link...</p>
                </div>
            </div>
        )
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
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Password Reset Successfully
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Your password has been updated. You can now sign in with your new password.
                        </p>
                    </div>

                    {/* Back to Login */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                    >
                        <Link
                            to="/login"
                            className="w-full btn-primary flex items-center justify-center py-3"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Sign In
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    if (!isValidToken) {
        return null
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
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Create a new password for your account
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
                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === password || 'Passwords do not match'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full btn-primary flex items-center justify-center py-3"
                    >
                        Reset Password
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

export default ResetPassword 