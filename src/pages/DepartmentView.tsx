import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    BookOpen,
    Users,
    Star,
    Calendar,
    Cpu,
    Building,
    FlaskConical,
    Zap,
    Settings,
    X
} from 'lucide-react'

const DepartmentView = () => {
    const { departmentId } = useParams()
    const navigate = useNavigate()
    const [selectedSemester, setSelectedSemester] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)

    const departmentData = {
        computer: {
            name: 'Computer Engineering',
            shortName: 'CE',
            icon: Cpu,
            color: 'from-indigo-600 via-purple-600 to-pink-600',
            description: 'Software development, algorithms, and computer systems',
            stats: { students: '4,200+', resources: '2,100+', subjects: 15 }
        },
        civil: {
            name: 'Civil Engineering',
            shortName: 'CIVIL',
            icon: Building,
            color: 'from-slate-600 via-gray-600 to-zinc-600',
            description: 'Infrastructure, construction, and structural design',
            stats: { students: '3,800+', resources: '1,900+', subjects: 12 }
        },
        chemical: {
            name: 'Chemical Engineering',
            shortName: 'CHEM',
            icon: FlaskConical,
            color: 'from-emerald-600 via-teal-600 to-cyan-600',
            description: 'Process design, materials, and industrial chemistry',
            stats: { students: '2,500+', resources: '1,300+', subjects: 10 }
        },
        electrical: {
            name: 'Electrical Engineering',
            shortName: 'EE',
            icon: Zap,
            color: 'from-amber-600 via-orange-600 to-red-600',
            description: 'Power systems, electronics, and electrical circuits',
            stats: { students: '3,600+', resources: '1,800+', subjects: 13 }
        },
        mechanical: {
            name: 'Mechanical Engineering',
            shortName: 'ME',
            icon: Settings,
            color: 'from-blue-600 via-sky-600 to-indigo-600',
            description: 'Machine design, manufacturing, and thermal systems',
            stats: { students: '3,900+', resources: '1,700+', subjects: 14 }
        }
    }

    const department = departmentData[departmentId as keyof typeof departmentData]

    if (!department) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Department Not Found</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        )
    }

    const semesters = [
        {
            id: 'sem1',
            name: 'Semester 1',
            number: 1,
            subjects: ['Maths 1', 'UHV', 'BME', 'BEE', 'EGD'],
            stats: { students: '850+', resources: '420+', subjects: 5 },
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'sem2',
            name: 'Semester 2',
            number: 2,
            subjects: ['FAI', 'BE', 'Math 2', 'ETC', 'PPS', 'Physics'],
            stats: { students: '820+', resources: '380+', subjects: 6 },
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'sem3',
            name: 'Semester 3',
            number: 3,
            subjects: ['Data Structures', 'Object Oriented Programming', 'Digital Electronics', 'Computer Organization', 'Discrete Mathematics'],
            stats: { students: '780+', resources: '450+', subjects: 5 },
            color: 'from-green-500 to-teal-500'
        },
        {
            id: 'sem4',
            name: 'Semester 4',
            number: 4,
            subjects: ['Database Management Systems', 'Computer Networks', 'Operating Systems', 'Software Engineering', 'Computer Graphics'],
            stats: { students: '750+', resources: '420+', subjects: 5 },
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'sem5',
            name: 'Semester 5',
            number: 5,
            subjects: ['Advanced Algorithms', 'Web Technologies', 'Mobile Computing', 'Artificial Intelligence', 'Computer Vision'],
            stats: { students: '720+', resources: '480+', subjects: 5 },
            color: 'from-indigo-500 to-purple-500'
        },
        {
            id: 'sem6',
            name: 'Semester 6',
            number: 6,
            subjects: ['Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Big Data Analytics', 'Internet of Things'],
            stats: { students: '690+', resources: '460+', subjects: 5 },
            color: 'from-pink-500 to-rose-500'
        },
        {
            id: 'sem7',
            name: 'Semester 7',
            number: 7,
            subjects: ['Deep Learning', 'Blockchain Technology', 'DevOps', 'Project Management', 'Professional Ethics'],
            stats: { students: '650+', resources: '520+', subjects: 5 },
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 'sem8',
            name: 'Semester 8',
            number: 8,
            subjects: ['Capstone Project', 'Industry Internship', 'Research Methodology', 'Entrepreneurship', 'Technical Writing'],
            stats: { students: '620+', resources: '580+', subjects: 5 },
            color: 'from-emerald-500 to-green-500'
        }
    ]

    const handleSemesterClick = (semesterId: string) => {
        const semester = semesters.find(s => s.id === semesterId)
        if (semester) {
            setSelectedSemester(semester)
            setShowModal(true)
        }
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedSemester(null)
    }

    const getSubjectDescription = (subject: string): string => {
        const descriptions: { [key: string]: string } = {
            // First Year Subjects
            'Maths 1': 'Engineering Mathematics covering calculus, linear algebra, and differential equations.',
            'UHV': 'Universal Human Values focusing on ethics, values, and professional conduct.',
            'BME': 'Basic Mechanical Engineering covering mechanics, materials, and manufacturing processes.',
            'BEE': 'Basic Electrical Engineering covering circuits, electronics, and electrical systems.',
            'EGD': 'Engineering Graphics & Design teaching technical drawing and CAD fundamentals.',
            'FAI': 'Fundamentals of Artificial Intelligence introducing AI concepts and machine learning basics.',
            'BE': 'Basic Electronics covering electronic components, circuits, and digital logic.',
            'Math 2': 'Advanced Engineering Mathematics including complex analysis and numerical methods.',
            'ETC': 'Electronic Technical Communication focusing on technical writing and presentation skills.',
            'PPS': 'Programming for Problem Solving teaching programming fundamentals and problem-solving techniques.',
            'Physics': 'Engineering Physics covering mechanics, thermodynamics, and wave phenomena.',

            // Second Year Subjects
            'Data Structures': 'Fundamental data structures and algorithms for efficient problem solving.',
            'Object Oriented Programming': 'OOP concepts, design patterns, and software development principles.',
            'Digital Electronics': 'Digital logic design, Boolean algebra, and sequential circuits.',
            'Computer Organization': 'Computer architecture, memory systems, and processor design.',
            'Discrete Mathematics': 'Mathematical foundations for computer science and logic.',
            'Database Management Systems': 'Database design, SQL, and data management principles.',
            'Computer Networks': 'Network protocols, architecture, and communication systems.',
            'Operating Systems': 'OS concepts, process management, and system programming.',
            'Software Engineering': 'Software development lifecycle, methodologies, and project management.',
            'Computer Graphics': 'Graphics programming, rendering techniques, and visualization.',

            // Third Year Subjects
            'Advanced Algorithms': 'Complex algorithms, optimization techniques, and computational complexity.',
            'Web Technologies': 'Web development, frameworks, and modern web applications.',
            'Mobile Computing': 'Mobile app development, platforms, and mobile technologies.',
            'Artificial Intelligence': 'AI algorithms, neural networks, and intelligent systems.',
            'Computer Vision': 'Image processing, pattern recognition, and computer vision applications.',
            'Machine Learning': 'ML algorithms, statistical learning, and predictive modeling.',
            'Cloud Computing': 'Cloud platforms, virtualization, and distributed systems.',
            'Cybersecurity': 'Security principles, cryptography, and network security.',
            'Big Data Analytics': 'Data processing, analytics, and big data technologies.',
            'Internet of Things': 'IoT architecture, sensors, and connected systems.',

            // Final Year Subjects
            'Deep Learning': 'Neural networks, deep learning frameworks, and advanced AI applications.',
            'Blockchain Technology': 'Blockchain principles, cryptocurrencies, and distributed ledgers.',
            'DevOps': 'Development operations, CI/CD, and software deployment practices.',
            'Project Management': 'Project planning, execution, and management methodologies.',
            'Professional Ethics': 'Ethical considerations in technology and professional conduct.',
            'Capstone Project': 'Comprehensive project integrating all learned concepts and technologies.',
            'Industry Internship': 'Real-world industry experience and professional development.',
            'Research Methodology': 'Research methods, data analysis, and academic writing.',
            'Entrepreneurship': 'Business development, innovation, and startup fundamentals.',
            'Technical Writing': 'Technical documentation, communication, and writing skills.'
        }

        return descriptions[subject] || 'Core subject covering fundamental concepts and practical applications in computer engineering.'
    }

    const IconComponent = department.icon

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className={`bg-gradient-to-r ${department.color} text-white py-8`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 rounded-lg bg-white/20">
                                <IconComponent className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{department.name}</h1>
                                <p className="text-white/80">{department.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Department Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <Users className="w-6 h-6" />
                                <div>
                                    <p className="text-sm text-white/80">Active Students</p>
                                    <p className="text-xl font-bold">{department.stats.students}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <BookOpen className="w-6 h-6" />
                                <div>
                                    <p className="text-sm text-white/80">Resources</p>
                                    <p className="text-xl font-bold">{department.stats.resources}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <Star className="w-6 h-6" />
                                <div>
                                    <p className="text-sm text-white/80">Subjects</p>
                                    <p className="text-xl font-bold">{department.stats.subjects}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Years and Semesters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Academic Structure</h2>
                    <p className="text-gray-600 dark:text-gray-400">4 Years • 8 Semesters • Comprehensive Curriculum</p>
                </div>

                <div className="space-y-8">
                    {semesters.map((semester, semesterIndex) => (
                        <motion.div
                            key={semester.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: semesterIndex * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                        >
                            {/* Semester Header */}
                            <div
                                className={`bg-gradient-to-r ${semester.color} text-white p-6 cursor-pointer`}
                                onClick={() => handleSemesterClick(semester.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-white/20">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{semester.name}</h3>
                                            <p className="text-white/80">{semester.number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subjects */}
                            <div className="p-6">
                                <div className="space-y-1">
                                    {semester.subjects.slice(0, 3).map((subject, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{subject}</span>
                                        </div>
                                    ))}
                                    {semester.subjects.length > 3 && (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                                +{semester.subjects.length - 3} more subjects
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Semester Stats */}
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{semester.stats.students}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Resources</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{semester.stats.resources}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Subjects</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{semester.stats.subjects}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Navigation */}
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Navigation</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {semesters.map((semester) => (
                            <button
                                key={semester.id}
                                onClick={() => handleSemesterClick(semester.id)}
                                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                            >
                                <p className="font-medium text-gray-900 dark:text-white">{semester.number}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{semester.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Semester Details Modal */}
            {showModal && selectedSemester && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Modal Header */}
                        <div className={`bg-gradient-to-r ${selectedSemester.color} text-white p-6 rounded-t-xl`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-lg bg-white/20">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedSemester.name}</h2>
                                        <p className="text-white/80">Semester {selectedSemester.number}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Semester Overview */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Semester Overview
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                            {selectedSemester.stats.subjects}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Subjects</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                            {selectedSemester.stats.resources}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Resources</p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                            {selectedSemester.stats.students}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                                    </div>
                                </div>
                            </div>

                            {/* Subjects List */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Core Subjects ({selectedSemester.subjects.length})
                                </h3>
                                <div className="space-y-3">
                                    {selectedSemester.subjects.map((subject: string, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {subject}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Core subject for {selectedSemester.name}
                                                </p>
                                            </div>
                                            <BookOpen className="w-5 h-5 text-gray-400" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Subject Descriptions */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Subject Descriptions
                                </h3>
                                <div className="space-y-3">
                                    {selectedSemester.subjects.map((subject: string, index: number) => (
                                        <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                {subject}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {getSubjectDescription(subject)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        closeModal()
                                        navigate(`/resources?semester=${selectedSemester.id}`)
                                    }}
                                    className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                >
                                    View Resources
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default DepartmentView 