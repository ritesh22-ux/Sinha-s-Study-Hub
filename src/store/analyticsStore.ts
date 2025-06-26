import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Analytics {
    totalUsers: number
    totalDownloads: number
    totalResources: number
    averageRating: number
    departmentStats: {
        [departmentId: string]: {
            students: number
            resources: number
            subjects: number
        }
    }
    userRegistrations: {
        [date: string]: number
    }
    downloadHistory: {
        [resourceId: string]: number
    }
    resourceRatings: {
        [resourceId: string]: {
            totalRatings: number
            averageRating: number
            ratings: { [userId: string]: number }
        }
    }
    // New user-specific analytics
    userAnalytics: {
        [userId: string]: {
            resourcesUploaded: number
            totalDownloads: number
            totalUpvotes: number
            totalDownvotes: number
            studyStreak: number
            lastStudyDate: string
            commentsPosted: number
            helpfulComments: number // Comments with 5+ upvotes
            achievements: {
                topContributor: boolean
                studyStreak: boolean
                helpfulMember: boolean
            }
        }
    }
}

interface AnalyticsState extends Analytics {
    // User tracking
    incrementUserCount: () => void
    decrementUserCount: () => void

    // Download tracking
    incrementDownload: (resourceId: string) => void
    getResourceDownloads: (resourceId: string) => number
    getTotalDownloads: () => number

    // Resource tracking
    incrementResourceCount: () => void
    decrementResourceCount: () => void

    // Rating tracking
    addRating: (resourceId: string, userId: string, rating: number) => void
    getResourceRating: (resourceId: string) => { totalRatings: number; averageRating: number }
    getAverageRating: () => number

    // Department stats
    updateDepartmentStats: (departmentId: string, updates: Partial<Analytics['departmentStats'][string]>) => void
    getDepartmentStats: (departmentId: string) => Analytics['departmentStats'][string]

    // Registration tracking
    addUserRegistration: (date: string) => void
    getRecentRegistrations: (days: number) => number

    // User-specific analytics
    trackUserResourceUpload: (userId: string) => void
    trackUserDownload: (userId: string, resourceId: string) => void
    trackUserComment: (userId: string) => void
    trackUserVote: (userId: string, commentId: string, voteType: 'up' | 'down') => void
    trackStudyActivity: (userId: string) => void
    getUserAnalytics: (userId: string) => Analytics['userAnalytics'][string]
    getUserAchievements: (userId: string) => {
        topContributor: boolean
        studyStreak: boolean
        helpfulMember: boolean
    }
    getTopContributors: (limit?: number) => Array<{ userId: string; resourcesUploaded: number }>
    getHelpfulMembers: (limit?: number) => Array<{ userId: string; helpfulComments: number }>

    // Analytics helpers
    getAnalytics: () => Analytics
    resetAnalytics: () => void
}

const defaultAnalytics: Analytics = {
    totalUsers: 3,
    totalDownloads: 195, // Sum of all resource downloads
    totalResources: 5,
    averageRating: 4.46, // Average of all resource ratings
    departmentStats: {
        computer: { students: 3, resources: 5, subjects: 15 },
        civil: { students: 0, resources: 0, subjects: 12 },
        chemical: { students: 0, resources: 0, subjects: 10 },
        electrical: { students: 0, resources: 0, subjects: 13 },
        mechanical: { students: 0, resources: 0, subjects: 14 }
    },
    userRegistrations: {
        '2024-01-01': 1,
        '2024-01-05': 1,
        '2024-01-10': 1
    },
    downloadHistory: {
        '1': 45,
        '2': 32,
        '3': 28,
        '4': 67,
        '5': 23
    },
    resourceRatings: {
        '1': { totalRatings: 12, averageRating: 4.5, ratings: {} },
        '2': { totalRatings: 8, averageRating: 4.2, ratings: {} },
        '3': { totalRatings: 15, averageRating: 4.7, ratings: {} },
        '4': { totalRatings: 10, averageRating: 4.3, ratings: {} },
        '5': { totalRatings: 7, averageRating: 4.6, ratings: {} }
    },
    userAnalytics: {
        'demo-user-1': {
            resourcesUploaded: 2,
            totalDownloads: 0,
            totalUpvotes: 15,
            totalDownvotes: 0,
            studyStreak: 12,
            lastStudyDate: new Date().toISOString().split('T')[0],
            commentsPosted: 1,
            helpfulComments: 1,
            achievements: {
                topContributor: false,
                studyStreak: true,
                helpfulMember: false
            }
        },
        'demo-user-2': {
            resourcesUploaded: 2,
            totalDownloads: 0,
            totalUpvotes: 14,
            totalDownvotes: 0,
            studyStreak: 5,
            lastStudyDate: new Date().toISOString().split('T')[0],
            commentsPosted: 2,
            helpfulComments: 2,
            achievements: {
                topContributor: false,
                studyStreak: false,
                helpfulMember: false
            }
        },
        'demo-user-3': {
            resourcesUploaded: 1,
            totalDownloads: 0,
            totalUpvotes: 12,
            totalDownvotes: 0,
            studyStreak: 8,
            lastStudyDate: new Date().toISOString().split('T')[0],
            commentsPosted: 1,
            helpfulComments: 1,
            achievements: {
                topContributor: false,
                studyStreak: true,
                helpfulMember: false
            }
        }
    }
}

export const useAnalyticsStore = create<AnalyticsState>()(
    persist(
        (set, get) => ({
            ...defaultAnalytics,

            incrementUserCount: () => {
                set((state) => ({
                    totalUsers: state.totalUsers + 1
                }))
            },

            decrementUserCount: () => {
                set((state) => ({
                    totalUsers: Math.max(0, state.totalUsers - 1)
                }))
            },

            incrementDownload: (resourceId: string) => {
                set((state) => ({
                    totalDownloads: state.totalDownloads + 1,
                    downloadHistory: {
                        ...state.downloadHistory,
                        [resourceId]: (state.downloadHistory[resourceId] || 0) + 1
                    }
                }))
            },

            getResourceDownloads: (resourceId: string) => {
                const state = get()
                return state.downloadHistory[resourceId] || 0
            },

            getTotalDownloads: () => {
                const state = get()
                return state.totalDownloads
            },

            incrementResourceCount: () => {
                set((state) => ({
                    totalResources: state.totalResources + 1
                }))
            },

            decrementResourceCount: () => {
                set((state) => ({
                    totalResources: Math.max(0, state.totalResources - 1)
                }))
            },

            addRating: (resourceId: string, userId: string, rating: number) => {
                set((state) => {
                    const currentRatings = state.resourceRatings[resourceId] || {
                        totalRatings: 0,
                        averageRating: 0,
                        ratings: {}
                    }

                    const newRatings = {
                        ...currentRatings.ratings,
                        [userId]: rating
                    }

                    const totalRatings = Object.keys(newRatings).length
                    const averageRating = totalRatings > 0
                        ? Object.values(newRatings).reduce((sum, r) => sum + r, 0) / totalRatings
                        : 0

                    // Calculate overall average rating
                    const allResourceRatings = Object.values({
                        ...state.resourceRatings,
                        [resourceId]: { totalRatings, averageRating, ratings: newRatings }
                    })

                    const overallAverage = allResourceRatings.length > 0
                        ? allResourceRatings.reduce((sum, r) => sum + r.averageRating, 0) / allResourceRatings.length
                        : 0

                    return {
                        resourceRatings: {
                            ...state.resourceRatings,
                            [resourceId]: { totalRatings, averageRating, ratings: newRatings }
                        },
                        averageRating: overallAverage
                    }
                })
            },

            getResourceRating: (resourceId: string) => {
                const state = get()
                const ratings = state.resourceRatings[resourceId]
                return ratings
                    ? { totalRatings: ratings.totalRatings, averageRating: ratings.averageRating }
                    : { totalRatings: 0, averageRating: 0 }
            },

            getAverageRating: () => {
                const state = get()
                return state.averageRating
            },

            updateDepartmentStats: (departmentId: string, updates: Partial<Analytics['departmentStats'][string]>) => {
                set((state) => ({
                    departmentStats: {
                        ...state.departmentStats,
                        [departmentId]: {
                            ...state.departmentStats[departmentId],
                            ...updates
                        }
                    }
                }))
            },

            getDepartmentStats: (departmentId: string) => {
                const state = get()
                return state.departmentStats[departmentId] || { students: 0, resources: 0, subjects: 0 }
            },

            addUserRegistration: (date: string) => {
                set((state) => ({
                    userRegistrations: {
                        ...state.userRegistrations,
                        [date]: (state.userRegistrations[date] || 0) + 1
                    }
                }))
            },

            getRecentRegistrations: (days: number) => {
                const state = get()
                const cutoffDate = new Date()
                cutoffDate.setDate(cutoffDate.getDate() - days)

                return Object.entries(state.userRegistrations)
                    .filter(([date]) => new Date(date) >= cutoffDate)
                    .reduce((sum, [, count]) => sum + count, 0)
            },

            // New user-specific analytics methods
            trackUserResourceUpload: (userId: string) => {
                set((state) => {
                    const currentUserAnalytics = state.userAnalytics[userId] || {
                        resourcesUploaded: 0,
                        totalDownloads: 0,
                        totalUpvotes: 0,
                        totalDownvotes: 0,
                        studyStreak: 0,
                        lastStudyDate: '',
                        commentsPosted: 0,
                        helpfulComments: 0,
                        achievements: {
                            topContributor: false,
                            studyStreak: false,
                            helpfulMember: false
                        }
                    }

                    const newResourcesUploaded = currentUserAnalytics.resourcesUploaded + 1
                    const topContributor = newResourcesUploaded >= 5

                    return {
                        userAnalytics: {
                            ...state.userAnalytics,
                            [userId]: {
                                ...currentUserAnalytics,
                                resourcesUploaded: newResourcesUploaded,
                                achievements: {
                                    ...currentUserAnalytics.achievements,
                                    topContributor
                                }
                            }
                        }
                    }
                })
            },

            trackUserDownload: (userId: string, resourceId: string) => {
                set((state) => {
                    const currentUserAnalytics = state.userAnalytics[userId] || {
                        resourcesUploaded: 0,
                        totalDownloads: 0,
                        totalUpvotes: 0,
                        totalDownvotes: 0,
                        studyStreak: 0,
                        lastStudyDate: '',
                        commentsPosted: 0,
                        helpfulComments: 0,
                        achievements: {
                            topContributor: false,
                            studyStreak: false,
                            helpfulMember: false
                        }
                    }

                    return {
                        userAnalytics: {
                            ...state.userAnalytics,
                            [userId]: {
                                ...currentUserAnalytics,
                                totalDownloads: currentUserAnalytics.totalDownloads + 1
                            }
                        }
                    }
                })
            },

            trackUserComment: (userId: string) => {
                set((state) => {
                    const currentUserAnalytics = state.userAnalytics[userId] || {
                        resourcesUploaded: 0,
                        totalDownloads: 0,
                        totalUpvotes: 0,
                        totalDownvotes: 0,
                        studyStreak: 0,
                        lastStudyDate: '',
                        commentsPosted: 0,
                        helpfulComments: 0,
                        achievements: {
                            topContributor: false,
                            studyStreak: false,
                            helpfulMember: false
                        }
                    }

                    return {
                        userAnalytics: {
                            ...state.userAnalytics,
                            [userId]: {
                                ...currentUserAnalytics,
                                commentsPosted: currentUserAnalytics.commentsPosted + 1
                            }
                        }
                    }
                })
            },

            trackUserVote: (userId: string, commentId: string, voteType: 'up' | 'down') => {
                set((state) => {
                    const currentUserAnalytics = state.userAnalytics[userId] || {
                        resourcesUploaded: 0,
                        totalDownloads: 0,
                        totalUpvotes: 0,
                        totalDownvotes: 0,
                        studyStreak: 0,
                        lastStudyDate: '',
                        commentsPosted: 0,
                        helpfulComments: 0,
                        achievements: {
                            topContributor: false,
                            studyStreak: false,
                            helpfulMember: false
                        }
                    }

                    const newUpvotes = voteType === 'up' ? currentUserAnalytics.totalUpvotes + 1 : currentUserAnalytics.totalUpvotes
                    const newDownvotes = voteType === 'down' ? currentUserAnalytics.totalDownvotes + 1 : currentUserAnalytics.totalDownvotes

                    // Check if user has enough upvotes to be helpful member
                    const helpfulMember = newUpvotes >= 50

                    return {
                        userAnalytics: {
                            ...state.userAnalytics,
                            [userId]: {
                                ...currentUserAnalytics,
                                totalUpvotes: newUpvotes,
                                totalDownvotes: newDownvotes,
                                achievements: {
                                    ...currentUserAnalytics.achievements,
                                    helpfulMember
                                }
                            }
                        }
                    }
                })
            },

            trackStudyActivity: (userId: string) => {
                set((state) => {
                    const currentUserAnalytics = state.userAnalytics[userId] || {
                        resourcesUploaded: 0,
                        totalDownloads: 0,
                        totalUpvotes: 0,
                        totalDownvotes: 0,
                        studyStreak: 0,
                        lastStudyDate: '',
                        commentsPosted: 0,
                        helpfulComments: 0,
                        achievements: {
                            topContributor: false,
                            studyStreak: false,
                            helpfulMember: false
                        }
                    }

                    const today = new Date().toISOString().split('T')[0]
                    const lastStudyDate = currentUserAnalytics.lastStudyDate

                    let newStreak = currentUserAnalytics.studyStreak

                    if (lastStudyDate === today) {
                        // Already studied today, no change to streak
                        newStreak = currentUserAnalytics.studyStreak
                    } else if (lastStudyDate === '') {
                        // First study session
                        newStreak = 1
                    } else {
                        const lastDate = new Date(lastStudyDate)
                        const todayDate = new Date(today)
                        const diffTime = todayDate.getTime() - lastDate.getTime()
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                        if (diffDays === 1) {
                            // Consecutive day
                            newStreak = currentUserAnalytics.studyStreak + 1
                        } else {
                            // Streak broken
                            newStreak = 1
                        }
                    }

                    const studyStreak = newStreak >= 7

                    return {
                        userAnalytics: {
                            ...state.userAnalytics,
                            [userId]: {
                                ...currentUserAnalytics,
                                studyStreak: newStreak,
                                lastStudyDate: today,
                                achievements: {
                                    ...currentUserAnalytics.achievements,
                                    studyStreak
                                }
                            }
                        }
                    }
                })
            },

            getUserAnalytics: (userId: string) => {
                const state = get()
                return state.userAnalytics[userId] || {
                    resourcesUploaded: 0,
                    totalDownloads: 0,
                    totalUpvotes: 0,
                    totalDownvotes: 0,
                    studyStreak: 0,
                    lastStudyDate: '',
                    commentsPosted: 0,
                    helpfulComments: 0,
                    achievements: {
                        topContributor: false,
                        studyStreak: false,
                        helpfulMember: false
                    }
                }
            },

            getUserAchievements: (userId: string) => {
                const state = get()
                const userAnalytics = state.userAnalytics[userId]
                if (!userAnalytics) {
                    return {
                        topContributor: false,
                        studyStreak: false,
                        helpfulMember: false
                    }
                }
                return userAnalytics.achievements
            },

            getTopContributors: (limit = 10) => {
                const state = get()
                return Object.entries(state.userAnalytics)
                    .map(([userId, analytics]) => ({
                        userId,
                        resourcesUploaded: analytics.resourcesUploaded
                    }))
                    .filter(user => user.resourcesUploaded > 0)
                    .sort((a, b) => b.resourcesUploaded - a.resourcesUploaded)
                    .slice(0, limit)
            },

            getHelpfulMembers: (limit = 10) => {
                const state = get()
                return Object.entries(state.userAnalytics)
                    .map(([userId, analytics]) => ({
                        userId,
                        helpfulComments: analytics.totalUpvotes
                    }))
                    .filter(user => user.helpfulComments > 0)
                    .sort((a, b) => b.helpfulComments - a.helpfulComments)
                    .slice(0, limit)
            },

            getAnalytics: () => {
                const state = get()
                return {
                    totalUsers: state.totalUsers,
                    totalDownloads: state.totalDownloads,
                    totalResources: state.totalResources,
                    averageRating: state.averageRating,
                    departmentStats: state.departmentStats,
                    userRegistrations: state.userRegistrations,
                    downloadHistory: state.downloadHistory,
                    resourceRatings: state.resourceRatings,
                    userAnalytics: state.userAnalytics
                }
            },

            resetAnalytics: () => {
                set(defaultAnalytics)
            }
        }),
        {
            name: 'analytics-storage',
        }
    )
) 