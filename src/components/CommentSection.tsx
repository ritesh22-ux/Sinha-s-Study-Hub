import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Reply,
    User,
    Send,
    MoreVertical,
    Edit,
    Trash2
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useResourceStore, Comment } from '../store/resourceStore'
import { cn } from '../utils/cn'

interface CommentSectionProps {
    resourceId: string
    resourceTitle: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ resourceId, resourceTitle }) => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const {
        comments,
        addComment,
        addReply,
        updateComment,
        deleteComment,
        voteComment
    } = useResourceStore()

    const [newComment, setNewComment] = useState('')
    const [replyTo, setReplyTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')
    const [editingComment, setEditingComment] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
    const [showOptions, setShowOptions] = useState<string | null>(null)

    const resourceComments = comments.filter(comment => comment.resourceId === resourceId)

    const handleSubmitComment = () => {
        if (!user || !newComment.trim()) return

        console.log('Submitting comment:', newComment.trim())
        addComment({
            resourceId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: newComment.trim()
        })

        setNewComment('')
    }

    const handleSubmitReply = (parentCommentId: string) => {
        if (!user || !replyContent.trim()) return

        console.log('Submitting reply:', replyContent.trim(), 'to comment:', parentCommentId)
        addReply(parentCommentId, {
            resourceId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: replyContent.trim()
        })

        setReplyContent('')
        setReplyTo(null)
    }

    const handleUpdateComment = (commentId: string) => {
        if (!editContent.trim()) return
        console.log('Updating comment:', commentId, 'with content:', editContent.trim())
        updateComment(commentId, editContent.trim())
        setEditingComment(null)
        setEditContent('')
    }

    const handleDeleteComment = (commentId: string) => {
        console.log('Deleting comment:', commentId)
        deleteComment(commentId)
        setShowOptions(null)
    }

    const handleVote = (commentId: string, type: 'up' | 'down') => {
        if (!user) return
        console.log('Voting on comment:', commentId, 'type:', type, 'user:', user.id)

        // Find the comment to check if this is the user's first vote
        const comment = resourceComments.find(c => c.id === commentId) ||
            resourceComments.flatMap(c => c.replies).find(r => r.id === commentId)

        const isFirstVote = comment && !comment.userVotes[user.id]

        voteComment(commentId, type, user.id)

        // Add celebration effect for first vote
        if (isFirstVote) {
            console.log('First vote celebration!')
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
        return date.toLocaleDateString()
    }

    const CommentItem: React.FC<{ comment: Comment; level?: number }> = ({ comment, level = 0 }) => {
        const isOwner = user?.id === comment.userId
        const hasReplies = comment.replies && comment.replies.length > 0
        const currentUserVote = user ? comment.userVotes[user.id] : null

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "border-l-2 border-gray-200 dark:border-gray-700 pl-4",
                    level > 0 && "ml-4"
                )}
            >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                                {comment.userAvatar ? (
                                    <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <User className="h-4 w-4 text-white" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {comment.userName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(comment.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Options Menu */}
                        {isOwner && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(showOptions === comment.id ? null : comment.id)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                </button>
                                {showOptions === comment.id && (
                                    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                                        <button
                                            onClick={() => {
                                                setEditingComment(comment.id)
                                                setEditContent(comment.content)
                                                setShowOptions(null)
                                            }}
                                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Comment Content */}
                    {editingComment === comment.id ? (
                        <div className="mb-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => {
                                    console.log('Edit content onChange:', e.target.value)
                                    setEditContent(e.target.value)
                                }}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                rows={3}
                            />
                            <div className="flex items-center space-x-2 mt-2">
                                <button
                                    onClick={() => handleUpdateComment(comment.id)}
                                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingComment(null)
                                        setEditContent('')
                                    }}
                                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-700 dark:text-gray-300 mb-3">
                            {comment.content}
                        </div>
                    )}

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 text-sm">
                        <motion.button
                            onClick={() => handleVote(comment.id, 'up')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex items-center space-x-1 transition-all duration-200 rounded-lg p-1 relative",
                                currentUserVote === 'up'
                                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                    : "text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                            )}
                        >
                            <motion.div
                                animate={currentUserVote === 'up' ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <ThumbsUp className="h-4 w-4" />
                            </motion.div>
                            <motion.span
                                key={`${comment.id}-upvotes-${comment.upvotes}`}
                                animate={currentUserVote === 'up' ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.2 }}
                            >
                                {comment.upvotes}
                            </motion.span>
                            {currentUserVote === 'up' && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                                />
                            )}
                        </motion.button>
                        <motion.button
                            onClick={() => handleVote(comment.id, 'down')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex items-center space-x-1 transition-all duration-200 rounded-lg p-1 relative",
                                currentUserVote === 'down'
                                    ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                    : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            )}
                        >
                            <motion.div
                                animate={currentUserVote === 'down' ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <ThumbsDown className="h-4 w-4" />
                            </motion.div>
                            <motion.span
                                key={`${comment.id}-downvotes-${comment.downvotes}`}
                                animate={currentUserVote === 'down' ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.2 }}
                            >
                                {comment.downvotes}
                            </motion.span>
                            {currentUserVote === 'down' && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                                />
                            )}
                        </motion.button>
                        <motion.button
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        >
                            <Reply className="h-4 w-4" />
                            <span>Reply</span>
                        </motion.button>
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                        {replyTo === comment.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                            >
                                <div className="flex items-start space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => {
                                                console.log('Reply content onChange:', e.target.value)
                                                setReplyContent(e.target.value)
                                            }}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                            rows={2}
                                            placeholder="Write a reply..."
                                        />
                                        <div className="flex items-center space-x-2 mt-2">
                                            <button
                                                onClick={() => handleSubmitReply(comment.id)}
                                                className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                                Reply
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyTo(null)
                                                    setReplyContent('')
                                                }}
                                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Replies */}
                {hasReplies && (
                    <div className="space-y-2">
                        {comment.replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} level={level + 1} />
                        ))}
                    </div>
                )}
            </motion.div>
        )
    }

    return (
        <div className="mt-8">
            <div className="flex items-center space-x-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Comments ({resourceComments.length})
                </h3>
            </div>

            {/* Add Comment */}
            {user ? (
                <div className="card p-6 mb-6">
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                            ) : (
                                <User className="h-5 w-5 text-white" />
                            )}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => {
                                    console.log('New comment onChange:', e.target.value)
                                    setNewComment(e.target.value)
                                }}
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                rows={3}
                                placeholder={`Share your thoughts on "${resourceTitle}"...`}
                            />
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {newComment.length}/500 characters
                                </span>
                                <button
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim() || newComment.length > 500}
                                    className={cn(
                                        "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        newComment.trim() && newComment.length <= 500
                                            ? "bg-primary-600 text-white hover:bg-primary-700"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    <Send className="h-4 w-4" />
                                    <span>Post Comment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card p-6 mb-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Join the discussion
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Sign in to comment and interact with other students
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary"
                    >
                        Sign In to Comment
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {resourceComments.length > 0 ? (
                    resourceComments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No comments yet
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            Be the first to share your thoughts on this resource!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection 