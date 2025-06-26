import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  Download,
  Star,
  Award,
  ArrowRight,
  FileText,
  Video,
  MessageSquare,
  ChevronRight,
  Cpu,
  Building,
  FlaskConical,
  Zap,
  Settings,
  Search
} from 'lucide-react'
import { useAnalyticsStore } from '../store/analyticsStore'
import { useResourceStore } from '../store/resourceStore'

// AnimatedCounter component for stats
const AnimatedCounter = ({ value, duration = 1200, decimals = 0, suffix = '' }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = Number(value)
    if (start === end) return
    const increment = (end - start) / (duration / 16)
    let current = start
    const step = () => {
      current += increment
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end)
        return
      }
      setCount(current)
      requestAnimationFrame(step)
    }
    step()
    // eslint-disable-next-line
  }, [value])
  return (
    <span>
      {count.toFixed(decimals)}{suffix}
    </span>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredDept, setHoveredDept] = useState<string | null>(null)

  // Use the resource store for search functionality
  const { searchQuery, setSearchQuery } = useResourceStore()

  // Get real analytics data
  const analytics = useAnalyticsStore()
  const { totalUsers, totalDownloads, totalResources, averageRating, departmentStats } = analytics.getAnalytics()

  const yearCards = [
    {
      id: 'first-year',
      title: 'First Year (FY)',
      description: 'Foundation courses and basic engineering subjects',
      path: '/year/first-year',
      color: 'from-blue-500 to-cyan-500',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Engineering Graphics'],
      stats: { students: '3,500+', resources: '1,200+', subjects: 8 }
    },
    {
      id: 'second-year',
      title: 'Second Year (SY)',
      description: 'Core engineering fundamentals and programming',
      path: '/year/second-year',
      color: 'from-purple-500 to-pink-500',
      subjects: ['Data Structures', 'Digital Electronics', 'Thermodynamics', 'Mechanics'],
      stats: { students: '4,200+', resources: '1,800+', subjects: 10 }
    },
    {
      id: 'third-year',
      title: 'Third Year (TY)',
      description: 'Advanced topics and specialization subjects',
      path: '/year/third-year',
      color: 'from-green-500 to-teal-500',
      subjects: ['Database Systems', 'Computer Networks', 'Software Engineering', 'Algorithms'],
      stats: { students: '3,800+', resources: '2,100+', subjects: 12 }
    },
    {
      id: 'final-year',
      title: 'Final Year (BE)',
      description: 'Capstone projects and industry-ready skills',
      path: '/year/final-year',
      color: 'from-orange-500 to-red-500',
      subjects: ['Machine Learning', 'Cloud Computing', 'Project Work', 'Internship'],
      stats: { students: '3,200+', resources: '1,900+', subjects: 8 }
    }
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
      stats: departmentStats.computer
    },
    {
      id: 'civil',
      name: 'Civil Engineering',
      shortName: 'CIVIL',
      description: 'Infrastructure, construction, and structural design',
      icon: Building,
      color: 'from-slate-600 via-gray-600 to-zinc-600',
      subjects: ['Structural Analysis', 'Concrete Technology', 'Transportation', 'Surveying'],
      stats: departmentStats.civil
    },
    {
      id: 'chemical',
      name: 'Chemical Engineering',
      shortName: 'CHEM',
      description: 'Process design, materials, and industrial chemistry',
      icon: FlaskConical,
      color: 'from-emerald-600 via-teal-600 to-cyan-600',
      subjects: ['Process Design', 'Thermodynamics', 'Fluid Mechanics', 'Reaction Engineering'],
      stats: departmentStats.chemical
    },
    {
      id: 'electrical',
      name: 'Electrical Engineering',
      shortName: 'EE',
      description: 'Power systems, electronics, and electrical circuits',
      icon: Zap,
      color: 'from-amber-600 via-orange-600 to-red-600',
      subjects: ['Power Systems', 'Digital Electronics', 'Control Systems', 'Electromagnetic Theory'],
      stats: departmentStats.electrical
    },
    {
      id: 'mechanical',
      name: 'Mechanical Engineering',
      shortName: 'ME',
      description: 'Machine design, manufacturing, and thermal systems',
      icon: Settings,
      color: 'from-blue-600 via-sky-600 to-indigo-600',
      subjects: ['Machine Design', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing'],
      stats: departmentStats.mechanical
    }
  ]

  const stats = [
    { icon: Users, label: 'Active Students', value: `${totalUsers}+` },
    { icon: BookOpen, label: 'Resources', value: `${totalResources}+` },
    { icon: Download, label: 'Downloads', value: `${totalDownloads}+` },
    { icon: Star, label: 'Average Rating', value: averageRating.toFixed(1) }
  ]

  const features = [
    {
      icon: FileText,
      title: 'Comprehensive Notes',
      description: 'Handwritten and digital notes from top students and professors'
    },
    {
      icon: Video,
      title: 'Video Lectures',
      description: 'Curated video content from the best educators on YouTube'
    },
    {
      icon: MessageSquare,
      title: 'Community Support',
      description: 'Get help from peers and contribute to discussions'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn points and badges for active participation'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Patel',
      year: 'Final Year CE',
      content: 'SINHA\'S STUDY HUB helped me ace my exams with their amazing PYQ collection!',
      rating: 5
    },
    {
      name: 'Rahul Shah',
      year: 'Third Year IT',
      content: 'The community here is so supportive. Got help with my doubts instantly.',
      rating: 5
    },
    {
      name: 'Anjali Mehta',
      year: 'Second Year EC',
      content: 'Best platform for GTU students. The notes are comprehensive and well-organized.',
      rating: 5
    }
  ]

  const handleYearCardClick = (path: string) => {
    navigate(path)
  }

  const handleYearCardHover = (id: string) => {
    setHoveredCard(id)
  }

  const handleYearCardLeave = () => {
    setHoveredCard(null)
  }

  const handleDepartmentClick = (departmentId: string) => {
    navigate(`/resources?department=${departmentId}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  SINHA'S STUDY HUB
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Your ultimate destination for GTU study resources, community support, and academic excellence
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate('/resources')}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 group"
              >
                <span>Explore Resources</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Join Community
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BookOpen className="h-16 w-16" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Users className="h-20 w-20" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              let decimals = stat.label === 'Average Rating' ? 1 : 0
              let suffix = stat.label !== 'Average Rating' ? '+' : ''
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    <AnimatedCounter value={parseFloat(stat.value)} decimals={decimals} suffix={suffix} />
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Engineering Departments Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Engineering Departments
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access specialized study materials and resources for each engineering department
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            {engineeringDepartments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer flex-shrink-0 w-56"
                onClick={() => handleDepartmentClick(dept.id)}
                onMouseEnter={() => setHoveredDept(dept.id)}
                onMouseLeave={() => setHoveredDept(null)}
              >
                <div className="card p-4 h-full relative overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${dept.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  {/* Main content */}
                  <div className="relative z-10">
                    <div className={`w-full h-24 bg-gradient-to-r ${dept.color} rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative`}>
                      <dept.icon className="h-8 w-8 text-white" />
                      {/* Department Badge */}
                      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-xs font-semibold text-white">{dept.shortName}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {dept.name}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {dept.description}
                    </p>

                    <div className="space-y-1 mb-3">
                      {dept.subjects.slice(0, 2).map((subject) => (
                        <div key={subject} className="text-xs text-gray-500 dark:text-gray-500">
                          • {subject}
                        </div>
                      ))}
                      {dept.subjects.length > 2 && (
                        <div className="text-xs text-primary-600 dark:text-primary-400">
                          +{dept.subjects.length - 2} more subjects
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{dept.stats.students}</div>
                        <div>Students</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{dept.stats.resources}</div>
                        <div>Resources</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{dept.stats.subjects}</div>
                        <div>Subjects</div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors">
                        Explore Department
                      </span>
                      <ChevronRight className="h-3 w-3 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  {hoveredDept === dept.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-xl"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Departments Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/resources')}
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors group"
            >
              <span>View All Departments</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Year Cards Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Academic Year
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access organized study materials, notes, and resources tailored for your current year
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {yearCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => handleYearCardClick(card.path)}
                onMouseEnter={() => handleYearCardHover(card.id)}
                onMouseLeave={handleYearCardLeave}
              >
                <div className="card p-6 h-full relative overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  {/* Main content */}
                  <div className="relative z-10">
                    <div className={`w-full h-32 bg-gradient-to-r ${card.color} rounded-lg mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {card.description}
                    </p>

                    <div className="space-y-1 mb-4">
                      {card.subjects.slice(0, 3).map((subject) => (
                        <div key={subject} className="text-sm text-gray-500 dark:text-gray-500">
                          • {subject}
                        </div>
                      ))}
                      {card.subjects.length > 3 && (
                        <div className="text-sm text-primary-600 dark:text-primary-400">
                          +{card.subjects.length - 3} more subjects
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{card.stats.students}</div>
                        <div>Students</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{card.stats.resources}</div>
                        <div>Resources</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{card.stats.subjects}</div>
                        <div>Subjects</div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors">
                        Explore Year
                      </span>
                      <ChevronRight className="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  {hoveredCard === card.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-xl"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SINHA'S STUDY HUB?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide everything you need to excel in your GTU journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-6 group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of successful GTU students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {testimonial.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Excel in Your Studies?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join our community of successful GTU students and access premium study resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Browse Resources
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home