import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAnalyticsStore } from '../store/analyticsStore'
import {
  BookOpen,
  Download,
  Users,
  Star,
  TrendingUp,
  Target
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { getUserAnalytics, getUserAchievements } = useAnalyticsStore()

  // Get real-time user analytics
  const userAnalytics = user ? getUserAnalytics(user.id) : null
  const userAchievements = user ? getUserAchievements(user.id) : null

  const stats = [
    {
      label: 'Resources Downloaded',
      value: userAnalytics?.totalDownloads || 0,
      change: userAnalytics?.totalDownloads ? `${userAnalytics.totalDownloads} total` : 'No downloads yet',
      icon: Download,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Study Streak',
      value: userAnalytics?.studyStreak || 0,
      change: userAnalytics?.studyStreak ? `${userAnalytics.studyStreak} days` : 'Start studying!',
      icon: Target,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Resources Uploaded',
      value: userAnalytics?.resourcesUploaded || 0,
      change: userAnalytics?.resourcesUploaded ? `${userAnalytics.resourcesUploaded} shared` : 'Share your first resource',
      icon: BookOpen,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Community Points',
      value: userAnalytics?.totalUpvotes || 0,
      change: userAnalytics?.totalUpvotes ? `${userAnalytics.totalUpvotes} upvotes` : 'Engage with community',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400'
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

  const achievements = [
    {
      icon: '🏆',
      title: 'Top Contributor',
      description: userAchievements?.topContributor
        ? 'Achieved! Uploaded 5+ resources'
        : `${userAnalytics?.resourcesUploaded || 0}/5 resources uploaded`,
      earned: userAchievements?.topContributor || false
    },
    {
      icon: '🔥',
      title: 'Study Streak',
      description: userAchievements?.studyStreak
        ? 'Achieved! 7+ days in a row'
        : `${userAnalytics?.studyStreak || 0}/7 days in a row`,
      earned: userAchievements?.studyStreak || false
    },
    {
      icon: '⭐',
      title: 'Helpful Member',
      description: userAchievements?.helpfulMember
        ? 'Achieved! 50+ upvotes received'
        : `${userAnalytics?.totalUpvotes || 0}/50 upvotes received`,
      earned: userAchievements?.helpfulMember || false
    }
  ]

  const upcomingDeadlines = [
    {
      title: 'Software Engineering Project',
      date: '2024-02-20',
      priority: 'medium'
    },
    {
      title: 'Computer Networks Lab',
      date: '2024-02-25',
      priority: 'low'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your studies today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
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
                          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {activity.type === 'favorite' && (
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                          <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
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
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/resources"
                  className="flex items-center space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                    Browse Resources
                  </span>
                </Link>
                <Link
                  to="/community"
                  className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors"
                >
                  <Users className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                  <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Join Discussion
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.earned
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                    }`}>
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${achievement.earned
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-gray-900 dark:text-white'
                        }`}>
                        {achievement.title}
                      </p>
                      <p className={`text-xs ${achievement.earned
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {deadline.date}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${deadline.priority === 'high'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : deadline.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {deadline.priority}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard