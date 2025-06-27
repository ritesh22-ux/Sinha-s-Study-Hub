import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Star,
  Wrench,
  Download,
  Eye,
  Heart,
  MessageSquare,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react'
import { cn } from '../utils/cn'
import { useResourceStore } from '../store/resourceStore'
import CommentSection from '../components/CommentSection'

const SubjectView = () => {
  const { year, semester, subject } = useParams()
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showComments, setShowComments] = useState<string | null>(null)

  const {
    resources,
    favorites,
    addToFavorites,
    removeFromFavorites
  } = useResourceStore()

  const subjectData = {
    'data-structures': {
      name: 'Data Structures',
      code: 'CE-301',
      credits: 4,
      description: 'Fundamental data structures and their applications in problem solving',
      syllabus: [
        'Introduction to Data Structures',
        'Arrays and Linked Lists',
        'Stacks and Queues',
        'Trees and Binary Trees',
        'Graphs and Graph Algorithms',
        'Sorting and Searching Algorithms',
        'Hash Tables',
        'Advanced Data Structures'
      ],
      resources: [
        {
          id: '1',
          title: 'Complete Data Structures Notes',
          type: 'notes',
          description: 'Comprehensive handwritten notes covering all DSA topics with examples and diagrams',
          author: 'Prof. Sharma',
          downloads: 1250,
          rating: 4.8,
          size: '15.2 MB',
          uploadedAt: '2024-01-15',
          tags: ['algorithms', 'data-structures', 'programming'],
          thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '2',
          title: 'Binary Trees Implementation Video',
          type: 'videos',
          description: 'Step-by-step implementation of binary trees in C++ with practical examples',
          author: 'CodeWithHarry',
          downloads: 890,
          rating: 4.6,
          uploadedAt: '2024-01-10',
          tags: ['trees', 'implementation', 'cpp'],
          thumbnailUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '3',
          title: 'DSA Previous Year Questions 2019-2023',
          type: 'pyqs',
          description: 'Collection of previous year question papers with detailed solutions',
          author: 'Study Group Alpha',
          downloads: 2100,
          rating: 4.9,
          size: '8.7 MB',
          uploadedAt: '2024-01-08',
          tags: ['exam-prep', 'pyq', 'solutions'],
          thumbnailUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '4',
          title: 'Sorting Algorithms Lab Manual',
          type: 'labs',
          description: 'Practical lab exercises for implementing various sorting algorithms',
          author: 'Dr. Patel',
          downloads: 567,
          rating: 4.5,
          size: '5.3 MB',
          uploadedAt: '2024-01-05',
          tags: ['sorting', 'lab', 'practical'],
          thumbnailUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '5',
          title: 'Data Structures Textbook - Cormen',
          type: 'textbooks',
          description: 'Introduction to Algorithms by Cormen - The definitive guide to algorithms and data structures',
          author: 'Thomas H. Cormen',
          downloads: 3200,
          rating: 4.9,
          size: '45.8 MB',
          uploadedAt: '2024-01-01',
          tags: ['textbook', 'algorithms', 'reference'],
          thumbnailUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '6',
          title: 'Graph Algorithms Solutions',
          type: 'solutions',
          description: 'Detailed solutions to graph algorithm problems with complexity analysis',
          author: 'Prof. Kumar',
          downloads: 789,
          rating: 4.7,
          size: '12.1 MB',
          uploadedAt: '2023-12-28',
          tags: ['graphs', 'solutions', 'algorithms'],
          thumbnailUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ]
    }
  }

  const resourceTypes = [
    { key: 'all', label: 'All Resources', icon: BookOpen, count: 0 },
    { key: 'notes', label: 'Notes', icon: FileText, count: 0 },
    { key: 'videos', label: 'Videos', icon: Video, count: 0 },
    { key: 'pyqs', label: 'PYQs', icon: HelpCircle, count: 0 },
    { key: 'solutions', label: 'Solutions', icon: Star, count: 0 },
    { key: 'textbooks', label: 'Textbooks', icon: BookOpen, count: 0 },
    { key: 'labs', label: 'Lab Manuals', icon: Wrench, count: 0 }
  ]

  const currentSubject = subjectData[subject as keyof typeof subjectData]

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject Not Found</h1>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  // Count resources by type
  resourceTypes.forEach(type => {
    if (type.key === 'all') {
      type.count = currentSubject.resources.length
    } else {
      type.count = currentSubject.resources.filter(r => r.type === type.key).length
    }
  })

  // Filter resources
  const filteredResources = currentSubject.resources.filter(resource => {
    const matchesTab = activeTab === 'all' || resource.type === activeTab
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  const getResourceIcon = (type: string) => {
    const resourceType = resourceTypes.find(rt => rt.key === type)
    return resourceType ? resourceType.icon : FileText
  }

  const getResourceColor = (type: string) => {
    const colors = {
      notes: 'text-green-600',
      videos: 'text-red-600',
      pyqs: 'text-purple-600',
      solutions: 'text-yellow-600',
      textbooks: 'text-blue-600',
      labs: 'text-orange-600'
    }
    return colors[type as keyof typeof colors] || 'text-gray-600'
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <nav className="text-sm breadcrumbs mb-4">
            <Link to="/" className="text-primary-600 hover:text-primary-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to={`/year/${year}`} className="text-primary-600 hover:text-primary-700">
              Second Year
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to={`/year/${year}/semester/${semester}`} className="text-primary-600 hover:text-primary-700">
              Semester 3
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{currentSubject.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentSubject.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {currentSubject.code} • {currentSubject.credits} Credits
              </p>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                {currentSubject.description}
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {currentSubject.resources.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Resources
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Syllabus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Course Syllabus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentSubject.syllabus.map((topic, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                  {index + 1}.
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

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
          </div>
        </motion.div>

        {/* Resource Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.key}
                  onClick={() => setActiveTab(type.key)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors",
                    activeTab === type.key
                      ? "bg-primary-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{type.label}</span>
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    activeTab === type.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  )}>
                    {type.count}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Resources */}
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
          {filteredResources.map((resource, index) => {
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
                {/* Thumbnail */}
                <div className={cn(
                  "relative",
                  viewMode === 'grid' ? "mb-4" : "flex-shrink-0"
                )}>
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className={cn(
                      "rounded-lg object-cover",
                      viewMode === 'grid' ? "w-full h-48" : "w-24 h-24"
                    )}
                  />
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{resource.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{resource.rating}</span>
                      </div>
                      {resource.size && (
                        <span className="text-xs">{resource.size}</span>
                      )}
                    </div>
                    <span className="text-xs">
                      by {resource.author}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(resource)}
                      className="btn-primary text-sm flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    {resource.type === 'videos' && (
                      <button
                        onClick={() => handleWatch(resource)}
                        className="btn-secondary text-sm flex items-center space-x-1"
                      >
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
          })}
        </motion.div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or selecting a different resource type.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveTab('all')
              }}
              className="btn-primary"
            >
              Show All Resources
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SubjectView