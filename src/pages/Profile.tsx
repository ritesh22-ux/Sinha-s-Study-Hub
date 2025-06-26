import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  GraduationCap,
  Award,
  Download,
  Heart,
  MessageSquare,
  Calendar,
  Edit,
  Save,
  X,
  Star,
  TrendingUp,
  BookOpen,
  Upload
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useForm } from 'react-hook-form'
import { useAnalyticsStore } from '../store/analyticsStore'

interface ProfileForm {
  name: string
  email: string
  registrationId: string
  year: string
  branch: string
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { user, updateProfile } = useAuthStore()
  const { getUserAnalytics, getUserAchievements } = useAnalyticsStore()

  // Get real-time user analytics
  const userAnalytics = user ? getUserAnalytics(user.id) : null
  const userAchievements = user ? getUserAchievements(user.id) : null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      registrationId: user?.registrationId || '',
      year: user?.year || '',
      branch: user?.branch || ''
    }
  })

  const years = ['First Year', 'Second Year', 'Third Year', 'Final Year']
  const branches = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Automobile Engineering'
  ]

  const stats = [
    {
      label: 'Resources Uploaded',
      value: userAnalytics?.resourcesUploaded || 0,
      icon: Upload,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Downloads',
      value: userAnalytics?.totalDownloads || 0,
      icon: Download,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Study Streak',
      value: userAnalytics?.studyStreak || 0,
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Community Points',
      value: userAnalytics?.totalUpvotes || 0,
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ]

  const achievements = [
    {
      icon: '🏆',
      title: 'Top Contributor',
      description: 'Upload 5+ quality resources',
      date: userAchievements?.topContributor ? '2024-01-15' : null,
      earned: userAchievements?.topContributor || false
    },
    {
      icon: '🔥',
      title: 'Study Streak',
      description: 'Active for 7 consecutive days',
      date: userAchievements?.studyStreak ? '2024-01-25' : null,
      earned: userAchievements?.studyStreak || false
    },
    {
      icon: '💬',
      title: 'Helpful Member',
      description: 'Received 50+ upvotes on comments',
      date: userAchievements?.helpfulMember ? '2024-02-01' : null,
      earned: userAchievements?.helpfulMember || false
    }
  ]

  const recentActivity = userAnalytics ? [
    ...(userAnalytics.totalDownloads > 0 ? [{
      type: 'download',
      title: `Downloaded ${userAnalytics.totalDownloads} resource${userAnalytics.totalDownloads > 1 ? 's' : ''}`,
      subject: 'Study Resources',
      time: 'Recently'
    }] : []),
    ...(userAnalytics.resourcesUploaded > 0 ? [{
      type: 'favorite',
      title: `Uploaded ${userAnalytics.resourcesUploaded} resource${userAnalytics.resourcesUploaded > 1 ? 's' : ''}`,
      subject: 'Shared Content',
      time: 'Recently'
    }] : []),
    ...(userAnalytics.commentsPosted > 0 ? [{
      type: 'comment',
      title: `Posted ${userAnalytics.commentsPosted} comment${userAnalytics.commentsPosted > 1 ? 's' : ''}`,
      subject: 'Community Engagement',
      time: 'Recently'
    }] : [])
  ] : [
    {
      type: 'download',
      title: 'No activity yet',
      subject: 'Start exploring resources',
      time: 'Get started'
    }
  ]

  const onSubmit = (data: ProfileForm) => {
    updateProfile(data)
    setIsEditing(false)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  {user.registrationId} • {user.branch}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.year} • Member since {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-outline flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-2 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="input-field"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration ID
                  </label>
                  <input
                    {...register('registrationId', { required: 'Registration ID is required' })}
                    className="input-field"
                  />
                  {errors.registrationId && (
                    <p className="mt-1 text-sm text-red-600">{errors.registrationId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Academic Year
                  </label>
                  <select
                    {...register('year', { required: 'Year is required' })}
                    className="input-field"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <select
                    {...register('branch', { required: 'Branch is required' })}
                    className="input-field"
                  >
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Achievements
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg ${achievement.earned
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.earned
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-gray-900 dark:text-white'
                      }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.earned
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                      }`}>
                      {achievement.description}
                    </p>
                    {achievement.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Earned on {achievement.date}
                      </p>
                    )}
                  </div>
                  {achievement.earned && (
                    <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'download' && (
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    {activity.type === 'comment' && (
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    {activity.type === 'favorite' && (
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                        <Upload className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.subject} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile