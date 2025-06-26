import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Copy, ExternalLink } from 'lucide-react'

interface EmailModalProps {
    isOpen: boolean
    onClose: () => void
    emailData: {
        to_email: string
        to_name: string
        reset_link: string
        user_name: string
    }
}

const EmailModal = ({ isOpen, onClose, emailData }: EmailModalProps) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(emailData.reset_link)
        // You can add a toast notification here
    }

    const openResetLink = () => {
        window.open(emailData.reset_link, '_blank')
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Password Reset Email Sent
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Demo: Email content displayed below
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Email Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                            {/* Email Header */}
                            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">From:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        noreply@sinhasstudyhub.com
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {emailData.to_email}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Subject:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Password Reset Request - SINHA'S STUDY HUB
                                    </span>
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Password Reset Request
                                </h2>

                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    Hello <strong>{emailData.user_name}</strong>,
                                </p>

                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    You requested a password reset for your SINHA'S STUDY HUB account.
                                </p>

                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    Click the button below to reset your password:
                                </p>

                                {/* Reset Button */}
                                <div className="text-center mb-6">
                                    <button
                                        onClick={openResetLink}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>Reset Password</span>
                                    </button>
                                </div>

                                {/* Reset Link */}
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">
                                            Reset Link:
                                        </span>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            title="Copy link"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 break-all mt-1">
                                        {emailData.reset_link}
                                    </p>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>⚠️ Important:</strong> This link expires in 30 minutes.
                                    </p>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    If you didn't request this reset, please ignore this email. Your password will remain unchanged.
                                </p>

                                <p className="text-gray-700 dark:text-gray-300">
                                    Best regards,<br />
                                    <strong>SINHA'S STUDY HUB Team</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This is a demo email. In production, this would be sent to your actual email address.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default EmailModal 