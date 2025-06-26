import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAnalyticsStore } from '../store/analyticsStore'
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Star,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'

interface DiscussionComment {
  id: string
  discussionId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  upvotes: number
  downvotes: number
  replies: DiscussionComment[]
  userVotes: { [userId: string]: 'up' | 'down' | null }
}

interface Discussion {
  id: string
  title: string
  author: string
  authorAvatar?: string
  subject: string
  content: string
  replies: DiscussionComment[]
  upvotes: number
  lastActivity: string
  tags: string[]
  showComments: boolean
  userVotes: { [userId: string]: 'up' | 'down' | null }
}

const Community = () => {
  const { user, registeredUsers } = useAuthStore()
  const { getTopContributors, getHelpfulMembers, trackUserComment, trackUserVote } = useAnalyticsStore()
  const navigate = useNavigate()

  // Get real-time analytics data
  const topContributors = getTopContributors(5)
  const helpfulMembers = getHelpfulMembers(5)

  // Helper function to get user name by ID
  const getUserName = (userId: string) => {
    const user = registeredUsers.find(u => u.id === userId)
    return user ? user.name : `User ${userId.slice(-4)}`
  }

  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      title: 'Best approach for learning Data Structures?',
      author: 'Priya Patel',
      authorAvatar: undefined,
      subject: 'Data Structures',
      content: 'I\'m struggling with understanding the implementation of various data structures. Can anyone share their learning approach or recommend good resources?',
      replies: [
        {
          id: '1-1',
          discussionId: '1',
          userId: 'user2',
          userName: 'Rahul Shah',
          userAvatar: undefined,
          content: 'I found that implementing them from scratch really helps. Start with simple ones like arrays and linked lists, then move to trees and graphs.',
          createdAt: '2024-01-20T11:15:00Z',
          upvotes: 8,
          downvotes: 0,
          userVotes: {},
          replies: []
        },
        {
          id: '1-2',
          discussionId: '1',
          userId: 'user3',
          userName: 'Anjali Mehta',
          userAvatar: undefined,
          content: 'Visualization tools like VisuAlgo are amazing for understanding the concepts before coding.',
          createdAt: '2024-01-20T12:30:00Z',
          upvotes: 12,
          downvotes: 0,
          userVotes: {},
          replies: []
        }
      ],
      upvotes: 45,
      lastActivity: '2 hours ago',
      tags: ['algorithms', 'programming', 'study-tips'],
      showComments: false,
      userVotes: {}
    },
    {
      id: '2',
      title: 'DBMS Assignment Help - Normalization',
      author: 'Rahul Shah',
      authorAvatar: undefined,
      subject: 'Database Management',
      content: 'I need help understanding normalization forms. Can someone explain 3NF with examples?',
      replies: [
        {
          id: '2-1',
          discussionId: '2',
          userId: 'user4',
          userName: 'Kiran Modi',
          userAvatar: undefined,
          content: '3NF means no transitive dependencies. Think of it as: if A→B and B→C, then A→C should not exist.',
          createdAt: '2024-01-20T10:45:00Z',
          upvotes: 6,
          downvotes: 0,
          userVotes: {},
          replies: []
        }
      ],
      upvotes: 28,
      lastActivity: '4 hours ago',
      tags: ['database', 'normalization', 'help'],
      showComments: false,
      userVotes: {}
    },
    {
      id: '3',
      title: 'Sharing my OOP notes - Java concepts',
      author: 'Anjali Mehta',
      authorAvatar: undefined,
      subject: 'Object Oriented Programming',
      content: 'I\'ve compiled comprehensive notes on Java OOP concepts. Sharing them here for everyone\'s benefit!',
      replies: [],
      upvotes: 67,
      lastActivity: '1 day ago',
      tags: ['java', 'oop', 'notes', 'sharing'],
      showComments: false,
      userVotes: {}
    }
  ])

  const [newComment, setNewComment] = useState<{ [key: string]: string }>({})
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false)
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    subject: '',
    tags: ''
  })

  const recentAnswers = [
    {
      question: 'How to implement binary search tree?',
      answer: 'Start with understanding the basic structure...',
      author: 'Prof. Kumar',
      upvotes: 15,
      time: '1 hour ago'
    },
    {
      question: 'Difference between SQL and NoSQL?',
      answer: 'SQL databases are relational while NoSQL...',
      author: 'Ravi Joshi',
      upvotes: 12,
      time: '3 hours ago'
    }
  ]

  const handleToggleComments = (discussionId: string) => {
    setDiscussions(prev => prev.map(discussion =>
      discussion.id === discussionId
        ? { ...discussion, showComments: !discussion.showComments }
        : discussion
    ))
  }

  const handleSubmitComment = (discussionId: string) => {
    if (!user || !newComment[discussionId]?.trim()) return

    const comment: DiscussionComment = {
      id: `${discussionId}-${Date.now()}`,
      discussionId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newComment[discussionId].trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVotes: {},
      replies: []
    }

    setDiscussions(prev => prev.map(discussion =>
      discussion.id === discussionId
        ? {
          ...discussion,
          replies: [...discussion.replies, comment],
          lastActivity: 'Just now'
        }
        : discussion
    ))

    // Track user comment for analytics
    trackUserComment(user.id)

    setNewComment(prev => ({ ...prev, [discussionId]: '' }))
  }

  const handleSubmitReply = (parentCommentId: string) => {
    if (!user || !replyContent.trim()) return

    const reply: DiscussionComment = {
      id: `${parentCommentId}-${Date.now()}`,
      discussionId: parentCommentId.split('-')[0],
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVotes: {},
      replies: []
    }

    setDiscussions(prev => prev.map(discussion => ({
      ...discussion,
      replies: discussion.replies.map(comment =>
        comment.id === parentCommentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ),
      lastActivity: 'Just now'
    })))

    // Track user comment for analytics
    trackUserComment(user.id)

    setReplyContent('')
    setReplyTo(null)
  }

  const handleVote = (commentId: string, type: 'up' | 'down') => {
    if (!user) return

    setDiscussions(prev => prev.map(discussion => ({
      ...discussion,
      replies: discussion.replies.map(comment => {
        if (comment.id === commentId) {
          const currentVote = comment.userVotes[user.id]
          let newUpvotes = comment.upvotes
          let newDownvotes = comment.downvotes
          const newUserVotes = { ...comment.userVotes }

          if (currentVote === type) {
            // Remove vote
            if (type === 'up') newUpvotes--
            else newDownvotes--
            newUserVotes[user.id] = null
          } else {
            // Add or change vote
            if (currentVote === 'up') newUpvotes--
            else if (currentVote === 'down') newDownvotes--

            if (type === 'up') newUpvotes++
            else newDownvotes++
            newUserVotes[user.id] = type
          }

          return {
            ...comment,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVotes: newUserVotes
          }
        }
        return comment
      })
    })))

    // Track user vote for analytics
    trackUserVote(user.id, commentId, type)
  }

  const handleDiscussionVote = (discussionId: string, type: 'up' | 'down') => {
    if (!user) return

    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        const currentVote = discussion.userVotes[user.id]
        let newUpvotes = discussion.upvotes
        const newUserVotes = { ...discussion.userVotes }

        if (currentVote === type) {
          // Remove vote
          if (type === 'up') newUpvotes--
          newUserVotes[user.id] = null
        } else {
          // Add or change vote
          if (currentVote === 'up') newUpvotes--

          if (type === 'up') newUpvotes++
          newUserVotes[user.id] = type
        }

        return {
          ...discussion,
          upvotes: newUpvotes,
          userVotes: newUserVotes
        }
      }
      return discussion
    }))
  }

  const handleCreateDiscussion = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowNewDiscussionModal(true)
  }

  const handleSubmitNewDiscussion = () => {
    if (!user || !newDiscussion.title.trim() || !newDiscussion.content.trim() || !newDiscussion.subject.trim()) return

    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title.trim(),
      author: user.name,
      authorAvatar: user.avatar,
      subject: newDiscussion.subject.trim(),
      content: newDiscussion.content.trim(),
      replies: [],
      upvotes: 0,
      lastActivity: 'Just now',
      tags: newDiscussion.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      showComments: false,
      userVotes: {}
    }

    setDiscussions(prev => [discussion, ...prev])
    setShowNewDiscussionModal(false)
    setNewDiscussion({ title: '', content: '', subject: '', tags: '' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const CommentItem: React.FC<{ comment: DiscussionComment; level?: number }> = ({ comment, level = 0 }) => {
    const isVotedUp = user && comment.userVotes[user.id] === 'up'
    const isVotedDown = user && comment.userVotes[user.id] === 'down'

    return (
      <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {comment.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.userName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
            {user && comment.userId === user.id && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingComment(comment.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setDiscussions(prev => prev.map(discussion => ({
                      ...discussion,
                      replies: discussion.replies.filter(reply => reply.id !== comment.id)
                    })))
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setDiscussions(prev => prev.map(discussion => ({
                      ...discussion,
                      replies: discussion.replies.map(reply =>
                        reply.id === comment.id
                          ? { ...reply, content: editContent }
                          : reply
                      )
                    })))
                    setEditingComment(null)
                    setEditContent('')
                  }}
                  className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null)
                    setEditContent('')
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleVote(comment.id, 'up')}
                  className={`p-1 rounded ${isVotedUp ? 'text-green-600 dark:text-green-400' : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'}`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {comment.upvotes}
                </span>
                <button
                  onClick={() => handleVote(comment.id, 'down')}
                  className={`p-1 rounded ${isVotedDown ? 'text-red-600 dark:text-red-400' : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'}`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {comment.downvotes}
                </span>
              </div>
              {user && (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>
          </div>

          {replyTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Write your reply..."
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null)
                    setReplyContent('')
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to access the community
          </h1>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Community Discussions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with fellow students, ask questions, and share knowledge
              </p>
            </div>
            <button
              onClick={handleCreateDiscussion}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Discussion</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {discussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {discussion.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>by {discussion.author}</span>
                          <span>•</span>
                          <span>{discussion.subject}</span>
                          <span>•</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDiscussionVote(discussion.id, 'up')}
                        className={`p-2 rounded-lg ${discussion.userVotes[user?.id || ''] === 'up' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900'}`}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {discussion.upvotes}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {discussion.content}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {discussion.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleToggleComments(discussion.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.replies.length} replies</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {discussion.showComments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 dark:border-gray-700 pt-4"
                      >
                        <div className="space-y-4">
                          {discussion.replies.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                          ))}
                        </div>

                        {user && (
                          <div className="mt-6">
                            <textarea
                              value={newComment[discussion.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [discussion.id]: e.target.value }))}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                              placeholder="Write a comment..."
                              rows={3}
                            />
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() => handleSubmitComment(discussion.id)}
                                className="btn-primary"
                              >
                                Post Comment
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Top Contributors</span>
              </h3>
              <div className="space-y-4">
                {topContributors.length > 0 ? (
                  topContributors.map((contributor, index) => (
                    <div key={contributor.userId} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getUserName(contributor.userId)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {contributor.resourcesUploaded} resources uploaded
                        </div>
                      </div>
                      <div className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                        {index === 0 ? 'Top' : index === 1 ? 'Active' : 'Contributor'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No contributors yet
                  </p>
                )}
              </div>
            </motion.div>

            {/* Helpful Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-green-500" />
                <span>Helpful Members</span>
              </h3>
              <div className="space-y-4">
                {helpfulMembers.length > 0 ? (
                  helpfulMembers.map((member, index) => (
                    <div key={member.userId} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {getUserName(member.userId)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {member.helpfulComments} upvotes received
                        </div>
                      </div>
                      <div className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                        {index === 0 ? 'Expert' : index === 1 ? 'Helper' : 'Member'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No helpful members yet
                  </p>
                )}
              </div>
            </motion.div>

            {/* Recent Answers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-green-500" />
                <span>Recent Answers</span>
              </h3>
              <div className="space-y-4">
                {recentAnswers.map((answer, index) => (
                  <div key={index} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {answer.question}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {answer.answer}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>by {answer.author}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{answer.upvotes}</span>
                        </div>
                        <span>{answer.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Be respectful and helpful to fellow students</li>
                <li>• Search before asking duplicate questions</li>
                <li>• Provide clear and detailed explanations</li>
                <li>• Use appropriate tags for better visibility</li>
                <li>• Report inappropriate content</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* New Discussion Modal */}
      <AnimatePresence>
        {showNewDiscussionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewDiscussionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Start New Discussion
                  </h2>
                  <button
                    onClick={() => setShowNewDiscussionModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newDiscussion.title}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter discussion title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={newDiscussion.subject}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Data Structures, OOP, DBMS..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={newDiscussion.content}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Describe your question or topic..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newDiscussion.tags}
                      onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., algorithms, programming, help"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowNewDiscussionModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitNewDiscussion}
                    className="btn-primary"
                  >
                    Create Discussion
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Community