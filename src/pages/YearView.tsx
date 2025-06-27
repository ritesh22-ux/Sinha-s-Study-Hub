import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Users, TrendingUp } from 'lucide-react'

const YearView = () => {
  const { year } = useParams()

  const yearData = {
    'first-year': {
      title: 'First Year (FY)',
      description: 'Foundation courses and basic engineering subjects',
      semesters: [
        {
          id: 'semester-1',
          title: 'Semester 1',
          subjects: ['Maths 1', 'UHV', 'BME', 'BEE', 'EGD'],
          resources: 245
        },
        {
          id: 'semester-2',
          title: 'Semester 2',
          subjects: ['FAI', 'BE', 'Math 2', 'ETC', 'PPS', 'Physics'],
          resources: 198
        }
      ]
    },
    'second-year': {
      title: 'Second Year (SY)',
      description: 'Core engineering fundamentals and programming',
      semesters: [
        {
          id: 'semester-3',
          title: 'Semester 3',
          subjects: ['Data Structures', 'Digital Electronics', 'Computer Organization', 'Discrete Mathematics', 'Object Oriented Programming', 'Database Management Systems'],
          resources: 312
        },
        {
          id: 'semester-4',
          title: 'Semester 4',
          subjects: ['Analysis and Design of Algorithms', 'Computer Networks', 'Operating Systems', 'Theory of Computation', 'Microprocessor and Interfacing', 'Software Engineering'],
          resources: 289
        }
      ]
    },
    'third-year': {
      title: 'Third Year (TY)',
      description: 'Advanced topics and specialization subjects',
      semesters: [
        {
          id: 'semester-5',
          title: 'Semester 5',
          subjects: ['Design and Analysis of Algorithms', 'Computer Graphics', 'Web Technology', 'Compiler Design', 'Machine Learning', 'Information Security'],
          resources: 267
        },
        {
          id: 'semester-6',
          title: 'Semester 6',
          subjects: ['Artificial Intelligence', 'Mobile Computing', 'Cloud Computing', 'Big Data Analytics', 'Internet of Things', 'Project-I'],
          resources: 234
        }
      ]
    },
    'final-year': {
      title: 'Final Year (BE)',
      description: 'Capstone projects and industry-ready skills',
      semesters: [
        {
          id: 'semester-7',
          title: 'Semester 7',
          subjects: ['Distributed Systems', 'Blockchain Technology', 'Natural Language Processing', 'Cyber Security', 'Elective-I', 'Project-II'],
          resources: 189
        },
        {
          id: 'semester-8',
          title: 'Semester 8',
          subjects: ['Industry Internship', 'Major Project', 'Seminar', 'Elective-II', 'Comprehensive Viva', 'Professional Ethics'],
          resources: 156
        }
      ]
    }
  }

  const currentYear = yearData[year as keyof typeof yearData]

  if (!currentYear) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Year Not Found</h1>
          <Link to="/" className="btn-primary">Go Home</Link>
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
          <nav className="text-sm breadcrumbs mb-4">
            <Link to="/" className="text-primary-600 hover:text-primary-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{currentYear.title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentYear.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {currentYear.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'Semesters', value: currentYear.semesters.length.toString() },
              { icon: BookOpen, label: 'Total Resources', value: currentYear.semesters.reduce((acc, sem) => acc + sem.resources, 0).toString() },
              { icon: Users, label: 'Active Students', value: '2,450' },
              { icon: TrendingUp, label: 'Success Rate', value: '94%' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Semesters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentYear.semesters.map((semester, index) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <Link to={`/year/${year}/semester/${semester.id}`}>
                <div className="card p-8 h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {semester.title}
                    </h2>
                    <div className="text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                      {semester.resources} resources
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Core Subjects:
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {semester.subjects.slice(0, 4).map((subject, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors"
                        >
                          <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {subject}
                          </span>
                        </div>
                      ))}
                      {semester.subjects.length > 4 && (
                        <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-2">
                          +{semester.subjects.length - 4} more subjects
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to explore resources
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

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 card p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Additional Resources for {currentYear.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Study Guides
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Comprehensive study guides and exam preparation materials
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Study Groups
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Join or create study groups with your classmates
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track your learning progress and achievements
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default YearView