import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Filter,
  Grid,
  List,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Star,
  Wrench,
  ClipboardList,
  Download,
  Heart,
  MessageSquare,
  ChevronRight,
  Eye,
  Cpu,
  Building,
  FlaskConical,
  Zap,
  Settings
} from 'lucide-react'
import { useResourceStore } from '../store/resourceStore'
import { useAuthStore } from '../store/authStore'
import { useAnalyticsStore } from '../store/analyticsStore'
import { cn } from '../utils/cn'
import CommentSection from '../components/CommentSection'

const Resources = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    resources,
    searchQuery,
    filters,
    favorites,
    setSearchQuery,
    setFilters,
    addToFavorites,
    removeFromFavorites,
    downloadResource
  } = useResourceStore()

  const analytics = useAnalyticsStore()

  // Handle URL search parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    const departmentFromUrl = searchParams.get('department')
    const semesterFromUrl = searchParams.get('semester')

    if (searchFromUrl) {
      setSearchQuery(decodeURIComponent(searchFromUrl))
    }

    if (departmentFromUrl) {
      setFilters({
        department: departmentFromUrl,
        type: '' // Clear resource type to show "All Resources"
      })
    }

    if (semesterFromUrl) {
      setFilters({
        semester: semesterFromUrl
      })
    }
  }, [searchParams, setSearchQuery, setFilters])

  const resourceTypes = [
    { value: 'textbook', label: 'Textbooks', icon: BookOpen, color: 'text-blue-600' },
    { value: 'notes', label: 'Notes', icon: FileText, color: 'text-green-600' },
    { value: 'video', label: 'Videos', icon: Video, color: 'text-red-600' },
    { value: 'pyq', label: 'PYQs', icon: HelpCircle, color: 'text-purple-600' },
    { value: 'solution', label: 'Solutions', icon: Star, color: 'text-yellow-600' },
    { value: 'lab', label: 'Lab Manuals', icon: Wrench, color: 'text-orange-600' },
    { value: 'syllabus', label: 'Syllabus', icon: ClipboardList, color: 'text-pink-600' }
  ]

  const engineeringDepartments = [
    {
      id: 'computer',
      name: 'Computer Engineering',
      shortName: 'CE',
      description: 'Software development, algorithms, and computer systems',
      icon: Cpu,
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      subjects: ['Data Structures', 'Database Systems', 'Computer Networks', 'Software Engineering'],
      stats: analytics.getDepartmentStats('computer')
    },
    {
      id: 'civil',
      name: 'Civil Engineering',
      shortName: 'CIVIL',
      description: 'Infrastructure, construction, and structural design',
      icon: Building,
      color: 'from-slate-600 via-gray-600 to-zinc-600',
      subjects: ['Structural Analysis', 'Concrete Technology', 'Transportation', 'Surveying'],
      stats: analytics.getDepartmentStats('civil')
    },
    {
      id: 'chemical',
      name: 'Chemical Engineering',
      shortName: 'CHEM',
      description: 'Process design, materials, and industrial chemistry',
      icon: FlaskConical,
      color: 'from-emerald-600 via-teal-600 to-cyan-600',
      subjects: ['Process Design', 'Thermodynamics', 'Fluid Mechanics', 'Reaction Engineering'],
      stats: analytics.getDepartmentStats('chemical')
    },
    {
      id: 'electrical',
      name: 'Electrical Engineering',
      shortName: 'EE',
      description: 'Power systems, electronics, and electrical circuits',
      icon: Zap,
      color: 'from-amber-600 via-orange-600 to-red-600',
      subjects: ['Power Systems', 'Digital Electronics', 'Control Systems', 'Electromagnetic Theory'],
      stats: analytics.getDepartmentStats('electrical')
    },
    {
      id: 'mechanical',
      name: 'Mechanical Engineering',
      shortName: 'ME',
      description: 'Machine design, manufacturing, and thermal systems',
      icon: Settings,
      color: 'from-blue-600 via-sky-600 to-indigo-600',
      subjects: ['Machine Design', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing'],
      stats: analytics.getDepartmentStats('mechanical')
    }
  ]

  const years = ['First Year', 'Second Year', 'Third Year', 'Final Year']
  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']

  // Enhanced search functionality with folder navigation
  const searchAllContent = () => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return { resources: [], departments: [], subjects: [], folders: [] }

    const searchResults = {
      resources: [] as any[],
      departments: [] as any[],
      subjects: [] as string[],
      folders: [] as any[]
    }

    // Search through resources
    searchResults.resources = resources.filter(resource =>
      resource.title.toLowerCase().includes(query) ||
      resource.subject.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query) ||
      (resource.department && resource.department.toLowerCase().includes(query))
    )

    // Search through departments
    searchResults.departments = engineeringDepartments.filter(dept =>
      dept.name.toLowerCase().includes(query) ||
      dept.shortName.toLowerCase().includes(query) ||
      dept.description.toLowerCase().includes(query) ||
      dept.subjects.some(subject => subject.toLowerCase().includes(query))
    )

    // Search through subjects
    const allSubjects = engineeringDepartments.flatMap(dept => dept.subjects)
    searchResults.subjects = allSubjects.filter(subject =>
      subject.toLowerCase().includes(query)
    )

    // Search through folders/directories
    const folderKeywords = [
      'folder', 'directory', 'path', 'semester', 'year', 'department', 'subject',
      'notes', 'videos', 'pyqs', 'assignments', 'projects', 'lab', 'practical'
    ]

    if (folderKeywords.some(keyword => query.includes(keyword))) {
      // Add folder suggestions based on search query
      if (query.includes('semester') || query.includes('sem')) {
        for (let i = 1; i <= 8; i++) {
          searchResults.folders.push({
            id: `sem${i}`,
            name: `Semester ${i}`,
            path: `/semester/${i}`,
            icon: '📁',
            description: `All resources for Semester ${i}`,
            type: 'semester'
          })
        }
      }

      if (query.includes('year') || query.includes('fy') || query.includes('sy') || query.includes('ty') || query.includes('be')) {
        const years = [
          { id: 'first-year', name: 'First Year (FY)', path: '/year/first-year' },
          { id: 'second-year', name: 'Second Year (SY)', path: '/year/second-year' },
          { id: 'third-year', name: 'Third Year (TY)', path: '/year/third-year' },
          { id: 'final-year', name: 'Final Year (BE)', path: '/year/final-year' }
        ]
        years.forEach(year => {
          searchResults.folders.push({
            id: year.id,
            name: year.name,
            path: year.path,
            icon: '📁',
            description: `All resources for ${year.name}`,
            type: 'year'
          })
        })
      }

      if (query.includes('department') || query.includes('dept')) {
        engineeringDepartments.forEach(dept => {
          searchResults.folders.push({
            id: dept.id,
            name: dept.name,
            path: `/department/${dept.id}`,
            icon: '🏛️',
            description: `All resources for ${dept.name}`,
            type: 'department'
          })
        })
      }

      if (query.includes('notes')) {
        searchResults.folders.push({
          id: 'notes',
          name: 'Study Notes',
          path: '/resources?type=notes',
          icon: '📝',
          description: 'All handwritten and digital notes',
          type: 'resource-type'
        })
      }

      if (query.includes('video') || query.includes('lecture')) {
        searchResults.folders.push({
          id: 'videos',
          name: 'Video Lectures',
          path: '/resources?type=videos',
          icon: '🎥',
          description: 'All video lectures and tutorials',
          type: 'resource-type'
        })
      }

      if (query.includes('pyq') || query.includes('question')) {
        searchResults.folders.push({
          id: 'pyqs',
          name: 'Previous Year Questions',
          path: '/resources?type=pyqs',
          icon: '📋',
          description: 'All previous year question papers',
          type: 'resource-type'
        })
      }

      if (query.includes('assignment') || query.includes('project')) {
        searchResults.folders.push({
          id: 'assignments',
          name: 'Assignments & Projects',
          path: '/resources?type=assignments',
          icon: '📊',
          description: 'All assignments and project files',
          type: 'resource-type'
        })
      }
    }

    return searchResults
  }

  const searchResults = searchAllContent()
  const hasSearchResults = searchResults.resources.length > 0 ||
    searchResults.departments.length > 0 ||
    searchResults.subjects.length > 0 ||
    searchResults.folders.length > 0

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesYear = !filters.year || resource.year === filters.year
    const matchesSemester = !filters.semester || resource.semester === filters.semester
    const matchesType = !filters.type || resource.type === filters.type
    const matchesDepartment = !filters.department || resource.department === filters.department

    return matchesSearch && matchesYear && matchesSemester && matchesType && matchesDepartment
  })

  // Remove sample resources. Only show real filtered resources.
  const displayResources = filteredResources;

  const toggleFavorite = (resourceId: string) => {
    if (favorites.includes(resourceId)) {
      removeFromFavorites(resourceId)
    } else {
      addToFavorites(resourceId)
    }
  }

  const handleDiscussClick = (resourceId: string) => {
    setShowComments(showComments === resourceId ? null : resourceId)
  }

  const handleDownload = (resource: any) => {
    if (resource.fileUrl) {
      // Track download in analytics
      downloadResource(resource.id)

      // Create a temporary link element to trigger download
      const link = document.createElement('a')
      link.href = resource.fileUrl
      link.download = resource.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      alert(`Downloading: ${resource.title}`)
    } else {
      alert('Download link not available')
    }
  }

  const handleWatch = (resource: any) => {
    if (resource.videoUrl) {
      // Open video in new tab
      window.open(resource.videoUrl, '_blank')
    } else {
      alert('Video link not available')
    }
  }

  const getResourceIcon = (type: string) => {
    const resourceType = resourceTypes.find(rt => rt.value === type)
    return resourceType ? resourceType.icon : FileText
  }

  const getResourceColor = (type: string) => {
    const resourceType = resourceTypes.find(rt => rt.value === type)
    return resourceType ? resourceType.color : 'text-gray-600'
  }

  const clearFilters = () => {
    setFilters({
      year: '',
      semester: '',
      subject: '',
      type: '',
      department: ''
    })
  }

  const hasActiveFilters = filters.year || filters.semester || filters.subject || filters.type || filters.department

  const getSemesterDisplayName = (semesterId: string) => {
    const semesterMap: { [key: string]: string } = {
      'sem1': 'Semester 1',
      'sem2': 'Semester 2',
      'sem3': 'Semester 3',
      'sem4': 'Semester 4',
      'sem5': 'Semester 5',
      'sem6': 'Semester 6',
      'sem7': 'Semester 7',
      'sem8': 'Semester 8'
    }
    return semesterMap[semesterId] || semesterId
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Study Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover comprehensive study materials for all GTU subjects
          </p>
        </motion.div>

        {/* Department Indicator - Show when department is selected */}
        {filters.department && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            {(() => {
              const selectedDept = engineeringDepartments.find(dept => dept.id === filters.department)
              if (!selectedDept) return null

              const Icon = selectedDept.icon
              return (
                <div className="card p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedDept.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedDept.name} Resources
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        All study materials and resources for {selectedDept.name} students
                      </p>
                    </div>
                    <button
                      onClick={() => setFilters({ department: '' })}
                      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      View All Departments
                    </button>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'grid'
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list'
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({ year: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Semester
                  </label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ semester: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All Semesters</option>
                    {semesters.map(semester => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ type: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    {resourceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ year: '', semester: '', subject: '', type: '' })}
                    className="btn-outline w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Resource Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilters({ type: '' })}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                !filters.type
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <span>All Resources</span>
            </button>
            {resourceTypes.map(type => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  onClick={() => setFilters({ type: type.value })}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                    filters.type === type.value
                      ? "bg-primary-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Department Filters - Show when specific resource type is selected */}
        {filters.type && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <div className="space-y-4">
              {/* Department Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Department</h3>
                <div className="flex flex-wrap gap-3">
                  {engineeringDepartments.map(dept => {
                    const Icon = dept.icon
                    return (
                      <button
                        key={dept.id}
                        onClick={() => setFilters({ ...filters, department: dept.id, semester: '' })}
                        className={cn(
                          "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                          filters.department === dept.id
                            ? "bg-secondary-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{dept.shortName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Semester Selection - Show when department is selected */}
              {filters.department && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Semester</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                    {[
                      { id: 'sem1', name: 'Sem 1', year: 'First Year' },
                      { id: 'sem2', name: 'Sem 2', year: 'First Year' },
                      { id: 'sem3', name: 'Sem 3', year: 'Second Year' },
                      { id: 'sem4', name: 'Sem 4', year: 'Second Year' },
                      { id: 'sem5', name: 'Sem 5', year: 'Third Year' },
                      { id: 'sem6', name: 'Sem 6', year: 'Third Year' },
                      { id: 'sem7', name: 'Sem 7', year: 'Final Year' },
                      { id: 'sem8', name: 'Sem 8', year: 'Final Year' }
                    ].map((semester) => (
                      <button
                        key={semester.id}
                        onClick={() => setFilters({
                          ...filters,
                          semester: semester.id,
                          year: semester.year
                        })}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg transition-all duration-200 border-2",
                          filters.semester === semester.id
                            ? "bg-primary-600 text-white border-primary-600 shadow-lg"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md"
                        )}
                      >
                        <span className="font-semibold text-sm">{semester.name}</span>
                        <span className="text-xs opacity-75">{semester.year}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Active Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                    {resourceTypes.find(rt => rt.value === filters.type)?.label}
                  </span>
                )}
                {filters.department && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                    {engineeringDepartments.find(d => d.id === filters.department)?.name}
                  </span>
                )}
                {filters.semester && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                    {getSemesterDisplayName(filters.semester)}
                  </span>
                )}
                {filters.year && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200">
                    {filters.year}
                  </span>
                )}
                {filters.subject && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200">
                    {filters.subject}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Engineering Departments Section - Show when "All Resources" is selected */}
        {!filters.type && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Engineering Departments
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access specialized study materials and resources for each engineering department
              </p>
            </div>

            <div className="space-y-6">
              {engineeringDepartments.map((dept, deptIndex) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: deptIndex * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Department Header */}
                  <div className={`bg-gradient-to-r ${dept.color} text-white p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <dept.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{dept.name}</h3>
                        <p className="text-white/80 text-sm">{dept.description}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-xs font-semibold">{dept.shortName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Years */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          id: 'first-year',
                          name: 'First Year',
                          shortName: 'FY',
                          color: 'from-blue-500 to-cyan-500',
                          semesters: [
                            { id: 'sem1', name: 'Semester 1', subjects: ['Maths 1', 'UHV', 'BME', 'BEE', 'EGD'] },
                            { id: 'sem2', name: 'Semester 2', subjects: ['FAI', 'BE', 'Math 2', 'ETC', 'PPS', 'Physics'] }
                          ]
                        },
                        {
                          id: 'second-year',
                          name: 'Second Year',
                          shortName: 'SY',
                          color: 'from-purple-500 to-pink-500',
                          semesters: [
                            { id: 'sem3', name: 'Semester 3', subjects: ['Data Structures', 'Object Oriented Programming', 'Digital Electronics'] },
                            { id: 'sem4', name: 'Semester 4', subjects: ['Database Management Systems', 'Computer Networks', 'Operating Systems'] }
                          ]
                        },
                        {
                          id: 'third-year',
                          name: 'Third Year',
                          shortName: 'TY',
                          color: 'from-green-500 to-teal-500',
                          semesters: [
                            { id: 'sem5', name: 'Semester 5', subjects: ['Advanced Algorithms', 'Web Technologies', 'Mobile Computing'] },
                            { id: 'sem6', name: 'Semester 6', subjects: ['Machine Learning', 'Cloud Computing', 'Cybersecurity'] }
                          ]
                        },
                        {
                          id: 'final-year',
                          name: 'Final Year',
                          shortName: 'BE',
                          color: 'from-orange-500 to-red-500',
                          semesters: [
                            { id: 'sem7', name: 'Semester 7', subjects: ['Deep Learning', 'Blockchain Technology', 'DevOps'] },
                            { id: 'sem8', name: 'Semester 8', subjects: ['Capstone Project', 'Industry Internship', 'Research Methodology'] }
                          ]
                        }
                      ].map((year, yearIndex) => (
                        <motion.div
                          key={year.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (deptIndex * 0.1) + (yearIndex * 0.05) }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                        >
                          {/* Year Header */}
                          <div className={`bg-gradient-to-r ${year.color} text-white p-2 rounded-lg mb-2`}>
                            <h4 className="font-semibold text-center text-sm">{year.name}</h4>
                            <p className="text-center text-white/80 text-xs">{year.shortName}</p>
                          </div>

                          {/* Semesters */}
                          <div className="space-y-1">
                            {year.semesters.map((semester) => (
                              <motion.div
                                key={semester.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-gray-600 rounded-lg p-2 cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200"
                                onClick={() => navigate(`/resources?semester=${semester.id}`)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                                    {semester.name}
                                  </h5>
                                  <ChevronRight className="h-2 w-2 text-gray-400" />
                                </div>
                                <div className="space-y-0.5">
                                  {semester.subjects.slice(0, 1).map((subject, subIndex) => (
                                    <div key={subIndex} className="text-xs text-gray-600 dark:text-gray-400">
                                      • {subject}
                                    </div>
                                  ))}
                                  {semester.subjects.length > 1 && (
                                    <div className="text-xs text-primary-600 dark:text-primary-400">
                                      +{semester.subjects.length - 1} more
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Department Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{dept.stats.students}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{dept.stats.resources}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Resources</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{dept.stats.subjects}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Subjects</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {filters.department ? (
              (() => {
                const selectedDept = engineeringDepartments.find(dept => dept.id === filters.department)
                return selectedDept
                  ? `Showing ${filteredResources.length} resources for ${selectedDept.name}`
                  : `Showing ${filteredResources.length} resources`
              })()
            ) : (
              `Showing ${filteredResources.length} resources`
            )}
          </p>
        </motion.div>

        {/* Search Results Display */}
        {searchQuery.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {hasSearchResults ? (
              <div className="space-y-6">
                {/* Resources Results */}
                {searchResults.resources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      📚 Resources ({searchResults.resources.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.resources.slice(0, 6).map((resource, index) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/resources?search=${encodeURIComponent(resource.title)}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                              {getResourceIcon(resource.type)({ className: "h-5 w-5 text-primary-600 dark:text-primary-400" })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {resource.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {resource.subject}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Departments Results */}
                {searchResults.departments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      🏛️ Departments ({searchResults.departments.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.departments.map((dept, index) => (
                        <motion.div
                          key={dept.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/resources?department=${dept.id}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${dept.color}`}>
                              <dept.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {dept.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {dept.shortName}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subjects Results */}
                {searchResults.subjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      📖 Subjects ({searchResults.subjects.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.subjects.slice(0, 10).map((subject, index) => (
                        <motion.span
                          key={subject}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                          onClick={() => navigate(`/resources?search=${encodeURIComponent(subject)}`)}
                        >
                          {subject}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Folders Results */}
                {searchResults.folders.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      📁 Folders & Directories ({searchResults.folders.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.folders.map((folder, index) => (
                        <motion.div
                          key={folder.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-600"
                          onClick={() => {
                            if (folder.type === 'resource-type') {
                              setFilters({ type: folder.id })
                              setSearchQuery('')
                            } else {
                              navigate(folder.path)
                              setSearchQuery('')
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{folder.icon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {folder.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {folder.description}
                              </p>
                              <div className="mt-1">
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                  {folder.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-gray-400">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results State */}
                {!hasSearchResults && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      We couldn't find anything matching "{searchQuery}"
                    </p>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <p>💡 Try searching for:</p>
                      <ul className="space-y-1">
                        <li>• Subject names (e.g., "Data Structures", "Database")</li>
                        <li>• Department names (e.g., "Computer", "Civil")</li>
                        <li>• Resource types (e.g., "Notes", "Videos", "PYQs")</li>
                        <li>• Topics (e.g., "Algorithms", "Thermodynamics")</li>
                        <li>• Folders (e.g., "Semester 1", "First Year", "Department")</li>
                        <li>• Directories (e.g., "Notes folder", "Video lectures")</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        ) : null}

        {/* Resources Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "grid gap-6",
            viewMode === 'grid'
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {displayResources.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
              <p className="text-lg font-semibold mb-2">No resources found</p>
              <p className="text-sm">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            displayResources.map((resource, index) => {
              const Icon = getResourceIcon(resource.type)
              const isFavorite = favorites.includes(resource.id)

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "card p-6 group hover:shadow-xl transition-all duration-300",
                    viewMode === 'list' && "flex items-center space-x-6"
                  )}
                >
                  {/* Thumbnail/Icon */}
                  <div className={cn(
                    "relative",
                    viewMode === 'grid' ? "mb-4" : "flex-shrink-0"
                  )}>
                    {resource.thumbnailUrl ? (
                      <img
                        src={resource.thumbnailUrl}
                        alt={resource.title}
                        className={cn(
                          "rounded-lg object-cover",
                          viewMode === 'grid' ? "w-full h-48" : "w-24 h-24"
                        )}
                      />
                    ) : (
                      <div className={cn(
                        "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center",
                        viewMode === 'grid' ? "w-full h-48" : "w-24 h-24"
                      )}>
                        <Icon className={cn(
                          "h-12 w-12",
                          getResourceColor(resource.type)
                        )} />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full">
                      <Icon className={cn(
                        "h-4 w-4",
                        getResourceColor(resource.type)
                      )} />
                    </div>
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <Heart className={cn(
                        "h-4 w-4 transition-colors",
                        isFavorite ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-500"
                      )} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {resource.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                        {resource.subject}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {resource.year}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {getSemesterDisplayName(resource.semester)}
                      </span>
                      {resource.department && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-300 text-xs rounded-full">
                          {engineeringDepartments.find(d => d.id === resource.department)?.shortName || resource.department}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{analytics.getResourceDownloads(resource.id)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{analytics.getResourceRating(resource.id).averageRating.toFixed(1)}</span>
                        </div>
                        {resource.size && (
                          <span className="text-xs">{resource.size}</span>
                        )}
                      </div>
                      <span className="text-xs">
                        by {resource.uploadedBy}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {resource.fileUrl && (
                        <button className="btn-primary text-sm flex items-center space-x-1" onClick={() => handleDownload(resource)}>
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      )}
                      {resource.videoUrl && (
                        <button className="btn-secondary text-sm flex items-center space-x-1" onClick={() => handleWatch(resource)}>
                          <Eye className="h-4 w-4" />
                          <span>Watch</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDiscussClick(resource.id)}
                        className={cn(
                          "btn-outline text-sm flex items-center space-x-1 transition-colors",
                          showComments === resource.id && "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Discuss</span>
                      </button>
                    </div>

                    {/* Comment Section */}
                    {showComments === resource.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                      >
                        <CommentSection
                          resourceId={resource.id}
                          resourceTitle={resource.title}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Resources