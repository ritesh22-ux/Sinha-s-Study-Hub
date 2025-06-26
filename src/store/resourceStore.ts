import { create } from 'zustand'
import { useAnalyticsStore } from './analyticsStore'
import { useAuthStore } from './authStore'

export interface Resource {
  id: string
  title: string
  type: 'textbook' | 'notes' | 'video' | 'pyq' | 'solution' | 'lab' | 'syllabus'
  subject: string
  year: string
  semester: string
  department?: string
  description: string
  fileUrl?: string
  videoUrl?: string
  thumbnailUrl?: string
  uploadedBy: string
  uploadedAt: string
  downloads: number
  rating: number
  tags: string[]
  size?: string
}

export interface Comment {
  id: string
  resourceId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  upvotes: number
  downvotes: number
  replies: Comment[]
  userVotes: { [userId: string]: 'up' | 'down' | null } // Track user votes
}

interface ResourceState {
  resources: Resource[]
  comments: Comment[]
  favorites: string[]
  searchQuery: string
  filters: {
    year: string
    semester: string
    subject: string
    type: string
    department: string
  }
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<ResourceState['filters']>) => void
  addToFavorites: (resourceId: string) => void
  removeFromFavorites: (resourceId: string) => void
  addResource: (resource: Omit<Resource, 'id' | 'downloads' | 'rating' | 'uploadedAt'>) => void
  removeResource: (resourceId: string) => void
  downloadResource: (resourceId: string) => void
  rateResource: (resourceId: string, userId: string, rating: number) => void
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'replies' | 'userVotes'>) => void
  addReply: (parentCommentId: string, reply: Omit<Comment, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'replies' | 'userVotes'>) => void
  updateComment: (commentId: string, newContent: string) => void
  deleteComment: (commentId: string) => void
  voteComment: (commentId: string, type: 'up' | 'down', userId: string) => void
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms Notes',
    type: 'notes',
    subject: 'Data Structures',
    year: '2nd Year',
    semester: '3rd Semester',
    department: 'computer',
    description: 'Comprehensive notes covering arrays, linked lists, trees, and graphs with implementation examples.',
    fileUrl: '/sample-resources/dsa-notes.pdf',
    uploadedBy: 'demo-user-1',
    uploadedAt: '2024-01-15T10:30:00Z',
    downloads: 45,
    rating: 4.5,
    tags: ['algorithms', 'data-structures', 'programming'],
    size: '2.3 MB'
  },
  {
    id: '2',
    title: 'Object Oriented Programming with Java',
    type: 'video',
    subject: 'OOP',
    year: '2nd Year',
    semester: '3rd Semester',
    department: 'computer',
    description: 'Complete video lecture series on OOP concepts including inheritance, polymorphism, and encapsulation.',
    videoUrl: 'https://sample-video.com/oop-java',
    thumbnailUrl: '/sample-thumbnails/oop-java.jpg',
    uploadedBy: 'demo-user-2',
    uploadedAt: '2024-01-20T14:15:00Z',
    downloads: 32,
    rating: 4.2,
    tags: ['java', 'oop', 'programming'],
    size: '150 MB'
  },
  {
    id: '3',
    title: 'Database Management Systems Lab Manual',
    type: 'lab',
    subject: 'DBMS',
    year: '3rd Year',
    semester: '5th Semester',
    department: 'computer',
    description: 'Practical lab exercises covering SQL queries, normalization, and database design.',
    fileUrl: '/sample-resources/dbms-lab.pdf',
    uploadedBy: 'demo-user-3',
    uploadedAt: '2024-01-25T09:45:00Z',
    downloads: 28,
    rating: 4.7,
    tags: ['database', 'sql', 'normalization'],
    size: '1.8 MB'
  },
  {
    id: '4',
    title: 'Computer Networks Previous Year Questions',
    type: 'pyq',
    subject: 'Computer Networks',
    year: '3rd Year',
    semester: '5th Semester',
    department: 'computer',
    description: 'Collection of previous year question papers with solutions for Computer Networks.',
    fileUrl: '/sample-resources/cn-pyp.pdf',
    uploadedBy: 'demo-user-1',
    uploadedAt: '2024-02-01T11:20:00Z',
    downloads: 67,
    rating: 4.3,
    tags: ['networks', 'previous-year', 'exam'],
    size: '3.1 MB'
  },
  {
    id: '5',
    title: 'Software Engineering Project Guidelines',
    type: 'syllabus',
    subject: 'Software Engineering',
    year: '4th Year',
    semester: '7th Semester',
    department: 'computer',
    description: 'Complete guidelines and syllabus for software engineering project development.',
    fileUrl: '/sample-resources/se-guidelines.pdf',
    uploadedBy: 'demo-user-2',
    uploadedAt: '2024-02-05T16:30:00Z',
    downloads: 23,
    rating: 4.6,
    tags: ['software-engineering', 'project', 'guidelines'],
    size: '1.5 MB'
  }
]

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    resourceId: '1',
    userId: 'demo-user-2',
    userName: 'Rahul Shah',
    content: 'These notes are really helpful for understanding data structures! The examples are clear and well-explained.',
    createdAt: '2024-01-16T12:30:00Z',
    upvotes: 8,
    downvotes: 0,
    userVotes: {},
    replies: []
  },
  {
    id: '2',
    resourceId: '1',
    userId: 'demo-user-3',
    userName: 'Anjali Mehta',
    content: 'Great resource! The implementation examples really helped me understand the concepts better.',
    createdAt: '2024-01-17T15:45:00Z',
    upvotes: 12,
    downvotes: 0,
    userVotes: {},
    replies: []
  },
  {
    id: '3',
    resourceId: '2',
    userId: 'demo-user-1',
    userName: 'Priya Patel',
    content: 'Excellent video series! The explanations are very clear and the practical examples make it easy to follow.',
    createdAt: '2024-01-21T10:20:00Z',
    upvotes: 15,
    downvotes: 0,
    userVotes: {},
    replies: []
  },
  {
    id: '4',
    resourceId: '3',
    userId: 'demo-user-2',
    userName: 'Rahul Shah',
    content: 'This lab manual is comprehensive and well-structured. Perfect for practical understanding of DBMS concepts.',
    createdAt: '2024-01-26T14:15:00Z',
    upvotes: 6,
    downvotes: 0,
    userVotes: {},
    replies: []
  }
]

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: mockResources,
  comments: mockComments,
  favorites: [],
  searchQuery: '',
  filters: {
    year: '',
    semester: '',
    subject: '',
    type: '',
    department: ''
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  addToFavorites: (resourceId) => set((state) => ({
    favorites: [...state.favorites, resourceId]
  })),

  removeFromFavorites: (resourceId) => set((state) => ({
    favorites: state.favorites.filter(id => id !== resourceId)
  })),

  addResource: (resourceData) => {
    const analyticsStore = useAnalyticsStore.getState()
    const newResource: Resource = {
      ...resourceData,
      id: Date.now().toString(),
      downloads: 0,
      rating: 0,
      uploadedAt: new Date().toISOString()
    }

    set((state) => ({
      resources: [...state.resources, newResource]
    }))

    // Track resource addition in analytics
    analyticsStore.incrementResourceCount()

    // Track user resource upload for achievements
    analyticsStore.trackUserResourceUpload(resourceData.uploadedBy)

    // Update department stats if resource has a department
    if (resourceData.department) {
      const currentStats = analyticsStore.getDepartmentStats(resourceData.department)
      analyticsStore.updateDepartmentStats(resourceData.department, {
        resources: currentStats.resources + 1
      })
    }
  },

  removeResource: (resourceId) => {
    const analyticsStore = useAnalyticsStore.getState()

    set((state) => {
      const resourceToRemove = state.resources.find(r => r.id === resourceId)
      const newResources = state.resources.filter(r => r.id !== resourceId)

      // Track resource removal in analytics
      if (resourceToRemove) {
        analyticsStore.decrementResourceCount()

        // Update department stats if resource has a department
        if (resourceToRemove.department) {
          const currentStats = analyticsStore.getDepartmentStats(resourceToRemove.department)
          analyticsStore.updateDepartmentStats(resourceToRemove.department, {
            resources: Math.max(0, currentStats.resources - 1)
          })
        }
      }

      return { resources: newResources }
    })
  },

  downloadResource: (resourceId: string) => {
    const analyticsStore = useAnalyticsStore.getState()
    const authStore = useAuthStore.getState()

    set((state) => ({
      resources: state.resources.map(resource =>
        resource.id === resourceId
          ? { ...resource, downloads: resource.downloads + 1 }
          : resource
      )
    }))

    // Track download in analytics
    analyticsStore.incrementDownload(resourceId)

    // Track study activity for the current user (if logged in)
    if (authStore.user) {
      analyticsStore.trackUserDownload(authStore.user.id, resourceId)
      analyticsStore.trackStudyActivity(authStore.user.id)
    }
  },

  rateResource: (resourceId: string, userId: string, rating: number) => {
    const analyticsStore = useAnalyticsStore.getState()

    set((state) => ({
      resources: state.resources.map(resource =>
        resource.id === resourceId
          ? { ...resource, rating: rating }
          : resource
      )
    }))

    // Track rating in analytics
    analyticsStore.addRating(resourceId, userId, rating)
  },

  addComment: (commentData) => {
    console.log('ResourceStore: Adding comment:', commentData)
    const analyticsStore = useAnalyticsStore.getState()

    set((state) => ({
      comments: [...state.comments, {
        ...commentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        userVotes: {},
        replies: []
      }]
    }))

    // Track user comment for achievements
    analyticsStore.trackUserComment(commentData.userId)
  },

  addReply: (parentCommentId, replyData) => {
    console.log('ResourceStore: Adding reply to comment:', parentCommentId, 'reply:', replyData)
    const analyticsStore = useAnalyticsStore.getState()

    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, {
              ...replyData,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              upvotes: 0,
              downvotes: 0,
              userVotes: {},
              replies: []
            }]
          }
        }
        return comment
      })
    }))

    // Track user comment for achievements
    analyticsStore.trackUserComment(replyData.userId)
  },

  updateComment: (commentId: string, newContent: string) => {
    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: newContent }
        }
        return comment
      })
    }))
  },

  deleteComment: (commentId: string) => {
    set((state) => ({
      comments: state.comments.filter(comment => comment.id !== commentId)
    }))
  },

  voteComment: (commentId: string, type: 'up' | 'down', userId: string) => {
    const analyticsStore = useAnalyticsStore.getState()

    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment.id === commentId) {
          const currentVote = comment.userVotes[userId]
          let newUpvotes = comment.upvotes
          let newDownvotes = comment.downvotes
          const newUserVotes = { ...comment.userVotes }

          if (currentVote === type) {
            // Remove vote
            if (type === 'up') newUpvotes--
            else newDownvotes--
            newUserVotes[userId] = null
          } else {
            // Add or change vote
            if (currentVote === 'up') newUpvotes--
            else if (currentVote === 'down') newDownvotes--

            if (type === 'up') newUpvotes++
            else newDownvotes++
            newUserVotes[userId] = type
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
    }))

    // Track user vote for achievements
    analyticsStore.trackUserVote(userId, commentId, type)
  }
}))