import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAnalyticsStore } from './analyticsStore'
import { sendPasswordResetEmail } from '../utils/emailService'

export interface User {
  id: string
  name: string
  email: string
  registrationId: string
  year: string
  branch: string
  password: string
  avatar?: string
  points: number
  streak: number
  joinedAt: string
}

interface ResetToken {
  email: string
  token: string
  expiresAt: string
}

interface AuthState {
  user: User | null
  registeredUsers: User[]
  resetTokens: ResetToken[]
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  register: (userData: Omit<User, 'id' | 'points' | 'streak' | 'joinedAt'>) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; token?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  checkUserExists: (email: string, registrationId: string) => { emailExists: boolean; registrationIdExists: boolean }
  validateResetToken: (token: string) => boolean
  getStoredCredentials: () => { email: string; password: string } | null
  clearStoredCredentials: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [
        {
          id: 'demo-user-1',
          name: 'Priya Patel',
          email: 'priya@example.com',
          registrationId: '241230107011',
          year: '3rd Year',
          branch: 'Computer Engineering',
          password: 'password123',
          points: 2450,
          streak: 12,
          joinedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'demo-user-2',
          name: 'Rahul Shah',
          email: 'rahul@example.com',
          registrationId: '241230107012',
          year: '2nd Year',
          branch: 'Computer Engineering',
          password: 'password123',
          points: 1890,
          streak: 5,
          joinedAt: '2024-01-05T00:00:00Z'
        },
        {
          id: 'demo-user-3',
          name: 'Anjali Mehta',
          email: 'anjali@example.com',
          registrationId: '241230107013',
          year: '4th Year',
          branch: 'Computer Engineering',
          password: 'password123',
          points: 1650,
          streak: 8,
          joinedAt: '2024-01-10T00:00:00Z'
        }
      ],
      resetTokens: [],
      isLoading: false,

      login: async (email: string, password: string, rememberMe?: boolean) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if user exists in registered users
        const { registeredUsers } = get()
        const existingUser = registeredUsers.find(user => user.email === email)

        if (!existingUser) {
          set({ isLoading: false })
          return false
        }

        // Check if password matches
        if (existingUser.password !== password) {
          set({ isLoading: false })
          return false
        }

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }))
        } else {
          // Clear any previously stored credentials
          localStorage.removeItem('rememberedCredentials')
        }

        // Track study activity for analytics
        const analyticsStore = useAnalyticsStore.getState()
        analyticsStore.trackStudyActivity(existingUser.id)

        set({ user: existingUser, isLoading: false })
        return true
      },

      register: async (userData) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { registeredUsers } = get()

        // Check for duplicate email
        const emailExists = registeredUsers.some(user => user.email.toLowerCase() === userData.email.toLowerCase())
        if (emailExists) {
          set({ isLoading: false })
          return { success: false, error: 'An account with this email already exists' }
        }

        // Check for duplicate registration ID
        const registrationIdExists = registeredUsers.some(user => user.registrationId === userData.registrationId)
        if (registrationIdExists) {
          set({ isLoading: false })
          return { success: false, error: 'An account with this registration ID already exists' }
        }

        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          points: 0,
          streak: 0,
          joinedAt: new Date().toISOString()
        }

        // Add to registered users list
        const updatedRegisteredUsers = [...registeredUsers, newUser]
        set({ registeredUsers: updatedRegisteredUsers })

        // Track user registration in analytics
        const analyticsStore = useAnalyticsStore.getState()
        analyticsStore.incrementUserCount()
        analyticsStore.addUserRegistration(new Date().toISOString().split('T')[0])

        // Update department stats if user has a branch
        if (userData.branch) {
          const departmentMap: { [key: string]: string } = {
            'Computer Engineering': 'computer',
            'Civil Engineering': 'civil',
            'Chemical Engineering': 'chemical',
            'Electrical Engineering': 'electrical',
            'Mechanical Engineering': 'mechanical'
          }

          const departmentId = departmentMap[userData.branch]
          if (departmentId) {
            const currentStats = analyticsStore.getDepartmentStats(departmentId)
            analyticsStore.updateDepartmentStats(departmentId, {
              students: currentStats.students + 1
            })
          }
        }

        set({ user: newUser, isLoading: false })
        return { success: true }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { registeredUsers, resetTokens } = get()

        // Find user with the provided email
        const user = registeredUsers.find(user => user.email.toLowerCase() === email.toLowerCase())

        if (!user) {
          set({ isLoading: false })
          return { success: false, error: 'No account found with this email address' }
        }

        // Generate a secure reset token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now

        // Remove any existing tokens for this email
        const filteredTokens = resetTokens.filter(t => t.email !== email)

        // Add new reset token
        const newResetToken: ResetToken = {
          email: email,
          token: token,
          expiresAt: expiresAt
        }

        set({ resetTokens: [...filteredTokens, newResetToken] })

        // Generate reset link
        const resetLink = `${window.location.origin}/reset-password?token=${token}`

        // Send email with reset link
        const emailSent = await sendPasswordResetEmail({
          to_email: email,
          to_name: user.name,
          reset_link: resetLink,
          user_name: user.name
        })

        if (!emailSent) {
          set({ isLoading: false })
          return { success: false, error: 'Failed to send reset email. Please try again.' }
        }

        set({ isLoading: false })
        return { success: true, token: token }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { resetTokens, registeredUsers } = get()

        // Find the reset token
        const resetToken = resetTokens.find(t => t.token === token)

        if (!resetToken) {
          set({ isLoading: false })
          return { success: false, error: 'Invalid or expired reset token' }
        }

        // Check if token has expired
        if (new Date() > new Date(resetToken.expiresAt)) {
          // Remove expired token
          const updatedTokens = resetTokens.filter(t => t.token !== token)
          set({ resetTokens: updatedTokens })
          set({ isLoading: false })
          return { success: false, error: 'Reset token has expired' }
        }

        // Find and update the user's password
        const updatedUsers = registeredUsers.map(user => {
          if (user.email === resetToken.email) {
            return { ...user, password: newPassword }
          }
          return user
        })

        // Remove the used token
        const updatedTokens = resetTokens.filter(t => t.token !== token)

        set({
          registeredUsers: updatedUsers,
          resetTokens: updatedTokens,
          isLoading: false
        })

        return { success: true }
      },

      validateResetToken: (token: string) => {
        const { resetTokens } = get()
        const resetToken = resetTokens.find(t => t.token === token)

        if (!resetToken) {
          return false
        }

        // Check if token has expired
        if (new Date() > new Date(resetToken.expiresAt)) {
          return false
        }

        return true
      },

      logout: () => {
        // Clear stored credentials on logout for security
        try {
          localStorage.removeItem('rememberedCredentials')
        } catch (error) {
          console.error('Error clearing stored credentials on logout:', error)
        }
        set({ user: null })
      },

      updateProfile: (updates) => {
        const { user, registeredUsers } = get()
        if (user) {
          const updatedUser = { ...user, ...updates }
          set({ user: updatedUser })

          // Update in registered users list as well
          const updatedRegisteredUsers = registeredUsers.map(u =>
            u.id === user.id ? updatedUser : u
          )
          set({ registeredUsers: updatedRegisteredUsers })
        }
      },

      checkUserExists: (email: string, registrationId: string) => {
        const { registeredUsers } = get()
        const emailExists = registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase())
        const registrationIdExists = registeredUsers.some(user => user.registrationId === registrationId)

        return { emailExists, registrationIdExists }
      },

      getStoredCredentials: () => {
        try {
          const stored = localStorage.getItem('rememberedCredentials')
          if (stored) {
            return JSON.parse(stored)
          }
          return null
        } catch (error) {
          console.error('Error retrieving stored credentials:', error)
          return null
        }
      },

      clearStoredCredentials: () => {
        try {
          localStorage.removeItem('rememberedCredentials')
        } catch (error) {
          console.error('Error clearing stored credentials:', error)
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)