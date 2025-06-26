import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Video, HelpCircle, Star, Wrench } from 'lucide-react'

const SemesterView = () => {
  const { year, semester } = useParams()

  const semesterData = {
    'semester-3': {
      title: 'Semester 3',
      year: 'Second Year',
      subjects: [
        {
          id: 'data-structures',
          name: 'Data Structures',
          code: 'CE-301',
          credits: 4,
          resources: {
            notes: 15,
            videos: 8,
            pyqs: 12,
            solutions: 10,
            textbooks: 3,
            labs: 6
          },
          description: 'Fundamental data structures and their applications in problem solving'
        },
        {
          id: 'digital-electronics',
          name: 'Digital Electronics',
          code: 'CE-302',
          credits: 4,
          resources: {
            notes: 12,
            videos: 6,
            pyqs: 10,
            solutions: 8,
            textbooks: 2,
            labs: 8
          },
          description: 'Digital logic design and electronic circuits'
        },
        {
          id: 'computer-organization',
          name: 'Computer Organization',
          code: 'CE-303',
          credits: 4,
          resources: {
            notes: 18,
            videos: 10,
            pyqs: 15,
            solutions: 12,
            textbooks: 4,
            labs: 5
          },
          description: 'Computer architecture and organization principles'
        },
        {
          id: 'discrete-mathematics',
          name: 'Discrete Mathematics',
          code: 'CE-304',
          credits: 3,
          resources: {
            notes: 20,
            videos: 12,
            pyqs: 18,
            solutions: 15,
            textbooks: 3,
            labs: 0
          },
          description: 'Mathematical foundations for computer science'
        },
        {
          id: 'oop',
          name: 'Object Oriented Programming',
          code: 'CE-305',
          credits: 4,
          resources: {
            notes: 16,
            videos: 14,
            pyqs: 11,
            solutions: 9,
            textbooks: 3,
            labs: 10
          },
          description: 'Object-oriented programming concepts and implementation'
        },
        {
          id: 'dbms',
          name: 'Database Management Systems',
          code: 'CE-306',
          credits: 4,
          resources: {
            notes: 14,
            videos: 9,
            pyqs: 13,
            solutions: 11,
            textbooks: 2,
            labs: 7
          },
          description: 'Database design, implementation, and management'
        }
      ]
    }
  }

  const resourceTypes = [
    { key: 'notes', label: 'Notes', icon: FileText, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { key: 'videos', label: 'Videos', icon: Video, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { key: 'pyqs', label: 'PYQs', icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { key: 'solutions', label: 'Solutions', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { key: 'textbooks', label: 'Textbooks', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { key: 'labs', label: 'Lab Manuals', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' }
  ]

  const currentSemester = semesterData[semester as keyof typeof semesterData]

  if (!currentSemester) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Semester Not Found</h1>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const totalResources = currentSemester.subjects.reduce((total, subject) => {
    return total + Object.values(subject.resources).reduce((sum, count) => sum + count, 0)
  }, 0)

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
              {currentSemester.year}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{currentSemester.title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentSemester.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {currentSemester.year} • {currentSemester.subjects.length} Subjects • {totalResources} Resources
          </p>
        </motion.div>

        {/* Resource Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Resource Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resourceTypes.map((type) => {
              const Icon = type.icon
              const totalCount = currentSemester.subjects.reduce((sum, subject) =>
                sum + subject.resources[type.key as keyof typeof subject.resources], 0
              )

              return (
                <div key={type.key} className={`${type.bg} p-4 rounded-lg text-center`}>
                  <Icon className={`h-8 w-8 ${type.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {type.label}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentSemester.subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <Link to={`/year/${year}/semester/${semester}/subject/${subject.id}`}>
                <div className="card p-6 h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Subject Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {subject.code}
                      </span>
                      <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {subject.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subject.description}
                    </p>
                  </div>

                  {/* Resource Counts */}
                  <div className="space-y-3">
                    {resourceTypes.map((type) => {
                      const Icon = type.icon
                      const count = subject.resources[type.key as keyof typeof subject.resources]

                      if (count === 0) return null

                      return (
                        <div key={type.key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${type.color}`} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {type.label}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Total Resources */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Resources
                      </span>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {Object.values(subject.resources).reduce((sum, count) => sum + count, 0)}
                      </span>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to explore
                      </span>
                      <div className="text-primary-600 dark:text-primary-400 group-hover:translate-x-2 transition-transform">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Study Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 card p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Study Tips for {currentSemester.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📚 Focus on Fundamentals
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Master the core concepts in Data Structures and OOP as they form the foundation for advanced topics.
              </p>
            </div>
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                💻 Practice Coding
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Regular coding practice is essential for Data Structures, OOP, and Database programming assignments.
              </p>
            </div>
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔬 Lab Work
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Complete all lab exercises thoroughly as they provide hands-on experience with theoretical concepts.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SemesterView