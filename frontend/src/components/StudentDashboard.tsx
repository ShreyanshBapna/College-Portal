import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import ChatApp from './ChatApp';
import ResponsiveContainer from './ResponsiveContainer';
import ResponsiveGrid from './ResponsiveGrid';
import Card from './Card';
import CalendarComponent, { CalendarEvent } from './Calendar';
import { studentCalendarEvents, createSampleEvent } from '../utils/calendarData';
import { BookOpen, Clock, CheckCircle, Users, Award, CreditCard } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  const renderOverview = () => {
    const dashboardData = {
      totalCourses: 6,
      completedAssignments: 12,
      pendingAssignments: 3,
      attendancePercentage: 85,
      cgpa: 8.5,
      pendingFees: 15000,
    };

    const stats = [
      { label: 'Courses', value: dashboardData.totalCourses, icon: BookOpen, color: 'bg-gradient-to-r from-blue-500 to-indigo-600', textColor: 'text-blue-600' },
      { label: 'Pending', value: dashboardData.pendingAssignments, icon: Clock, color: 'bg-gradient-to-r from-orange-500 to-red-500', textColor: 'text-orange-600' },
      { label: 'Completed', value: dashboardData.completedAssignments, icon: CheckCircle, color: 'bg-gradient-to-r from-green-500 to-emerald-600', textColor: 'text-green-600' },
      { label: 'Attendance', value: `${dashboardData.attendancePercentage}%`, icon: Users, color: 'bg-gradient-to-r from-purple-500 to-violet-600', textColor: 'text-purple-600' },
      { label: 'CGPA', value: dashboardData.cgpa.toFixed(2), icon: Award, color: 'bg-gradient-to-r from-indigo-500 to-blue-600', textColor: 'text-indigo-600' },
      { label: 'Fees Due', value: `₹${dashboardData.pendingFees.toLocaleString()}`, icon: CreditCard, color: 'bg-gradient-to-r from-red-500 to-pink-600', textColor: 'text-red-600' }
    ];

    return (
      <ResponsiveContainer className="space-y-6 lg:space-y-8">
        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-2xl shadow-indigo-500/20 border-0 relative overflow-hidden" hover={false}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              Welcome back, {user?.profile?.firstName || 'Student'}! ✨
            </h1>
            <div className="text-blue-100 flex flex-wrap gap-6 text-sm sm:text-base">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Roll: {user?.studentDetails?.rollNumber || 'N/A'}</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Dept: {user?.studentDetails?.department || 'N/A'}</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Sem: {user?.studentDetails?.semester || 'N/A'}</span>
              </span>
            </div>
          </div>
        </Card>

        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 3 }} gap="md">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card hover={true} padding="lg" className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor} mb-1`}>
                        {stat.value}
                      </p>
                      <div className="w-full bg-gray-200/50 rounded-full h-1.5 mb-2">
                        <div className={`h-1.5 rounded-full ${stat.color} transition-all duration-1000`} style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg shadow-gray-900/10 ring-1 ring-white/20`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </ResponsiveGrid>

        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300" hover={true}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <span>Recent Assignments</span>
              </h3>
              <div className="px-3 py-1 bg-indigo-100/70 text-indigo-700 rounded-full text-xs font-semibold">
                2 Active
              </div>
            </div>
            <div className="space-y-4">
              <motion.div 
                className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/30 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900">Programming Project</p>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Due Soon</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Due: Jan 20, 2024</p>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full" style={{width: '65%'}}></div>
                </div>
              </motion.div>
              <motion.div 
                className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-2xl border border-green-200/30 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900">Data Analysis Report</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">On Track</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Due: Jan 25, 2024</p>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" style={{width: '45%'}}></div>
                </div>
              </motion.div>
            </div>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300" hover={true}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span>Upcoming Events</span>
              </h3>
              <div className="px-3 py-1 bg-purple-100/70 text-purple-700 rounded-full text-xs font-semibold">
                2 Events
              </div>
            </div>
            <div className="space-y-4">
              <motion.div 
                className="p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 rounded-2xl border border-red-200/30 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900">Mid-term Exams</p>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Important</span>
                </div>
                <p className="text-sm text-gray-600">Feb 1-5, 2024</p>
              </motion.div>
              <motion.div 
                className="p-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-2xl border border-purple-200/30 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900">Campus Event</p>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Optional</span>
                </div>
                <p className="text-sm text-gray-600">Jan 30, 2024</p>
              </motion.div>
            </div>
          </Card>
        </ResponsiveGrid>
      </ResponsiveContainer>
    );
  };

  const renderCourses = () => {
    const courses = [
      { id: 1, code: 'CS301', name: 'Data Structures and Algorithms', credits: 4, instructor: 'Dr. Smith', progress: 75, grade: 'A-', color: 'from-blue-500 to-indigo-600' },
      { id: 2, code: 'CS302', name: 'Database Management Systems', credits: 3, instructor: 'Prof. Johnson', progress: 82, grade: 'A', color: 'from-green-500 to-emerald-600' },
      { id: 3, code: 'CS303', name: 'Computer Networks', credits: 4, instructor: 'Dr. Williams', progress: 68, grade: 'B+', color: 'from-purple-500 to-violet-600' },
      { id: 4, code: 'CS304', name: 'Software Engineering', credits: 3, instructor: 'Prof. Davis', progress: 90, grade: 'A+', color: 'from-pink-500 to-rose-600' },
      { id: 5, code: 'CS305', name: 'Operating Systems', credits: 4, instructor: 'Dr. Brown', progress: 55, grade: 'B', color: 'from-orange-500 to-red-500' },
      { id: 6, code: 'CS306', name: 'Machine Learning', credits: 3, instructor: 'Prof. Taylor', progress: 72, grade: 'A-', color: 'from-indigo-500 to-blue-600' },
    ];

    return (
      <ResponsiveContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
          <div className="px-4 py-2 bg-indigo-100/70 text-indigo-700 rounded-xl text-sm font-semibold">
            Semester 6
          </div>
        </div>

        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300" hover={true}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${course.color}`}></div>
                      <span className="text-sm font-semibold text-gray-500">{course.code}</span>
                      <span className="px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full text-xs">
                        {course.credits} Credits
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{course.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Instructor: {course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{course.grade}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${course.color} transition-all duration-1000`} 
                      style={{width: `${course.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-indigo-100/80 text-indigo-700 rounded-lg hover:bg-indigo-200/80 transition-colors text-sm font-medium">
                    View Materials
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100/80 text-gray-700 rounded-lg hover:bg-gray-200/80 transition-colors text-sm font-medium">
                    Assignments
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </ResponsiveGrid>
      </ResponsiveContainer>
    );
  };

  const renderAssignments = () => {
    const assignments = [
      { id: 1, title: 'Database Schema Design', course: 'DBMS', dueDate: '2024-01-20', status: 'pending', priority: 'high', submitted: false, grade: null },
      { id: 2, title: 'Algorithm Analysis Report', course: 'DSA', dueDate: '2024-01-18', status: 'submitted', priority: 'medium', submitted: true, grade: 'A-' },
      { id: 3, title: 'Network Protocol Implementation', course: 'Networks', dueDate: '2024-01-25', status: 'pending', priority: 'medium', submitted: false, grade: null },
      { id: 4, title: 'Software Requirements Document', course: 'SE', dueDate: '2024-01-22', status: 'pending', priority: 'low', submitted: false, grade: null },
      { id: 5, title: 'ML Model Training', course: 'ML', dueDate: '2024-01-15', status: 'graded', priority: 'high', submitted: true, grade: 'A' },
      { id: 6, title: 'OS Process Scheduling', course: 'OS', dueDate: '2024-01-28', status: 'pending', priority: 'medium', submitted: false, grade: null },
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'bg-orange-100 text-orange-700';
        case 'submitted': return 'bg-blue-100 text-blue-700';
        case 'graded': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-700 border-red-200';
        case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    return (
      <ResponsiveContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
          <div className="flex space-x-2">
            <div className="px-3 py-1 bg-orange-100/70 text-orange-700 rounded-full text-sm font-semibold">
              4 Pending
            </div>
            <div className="px-3 py-1 bg-green-100/70 text-green-700 rounded-full text-sm font-semibold">
              2 Completed
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300" hover={true}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignment.course}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </span>
                      {assignment.grade && (
                        <span className="flex items-center space-x-2">
                          <Award className="w-4 h-4" />
                          <span className="font-semibold text-green-600">Grade: {assignment.grade}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      {!assignment.submitted && (
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                          Submit Assignment
                        </button>
                      )}
                      <button className="px-4 py-2 bg-gray-100/80 text-gray-700 rounded-lg hover:bg-gray-200/80 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      {assignment.submitted && (
                        <button className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-lg hover:bg-blue-200/80 transition-colors text-sm font-medium">
                          View Submission
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ResponsiveContainer>
    );
  };

  const renderGrades = () => {
    const semesters = [
      {
        id: 6,
        name: 'Semester 6 (Current)',
        courses: [
          { code: 'CS301', name: 'Data Structures and Algorithms', credits: 4, grade: 'A-', gpa: 3.7 },
          { code: 'CS302', name: 'Database Management Systems', credits: 3, grade: 'A', gpa: 4.0 },
          { code: 'CS303', name: 'Computer Networks', credits: 4, grade: 'B+', gpa: 3.3 },
          { code: 'CS304', name: 'Software Engineering', credits: 3, grade: 'A+', gpa: 4.0 },
          { code: 'CS305', name: 'Operating Systems', credits: 4, grade: 'B', gpa: 3.0 },
          { code: 'CS306', name: 'Machine Learning', credits: 3, grade: 'A-', gpa: 3.7 },
        ]
      },
      {
        id: 5,
        name: 'Semester 5',
        courses: [
          { code: 'CS251', name: 'Computer Architecture', credits: 4, grade: 'A', gpa: 4.0 },
          { code: 'CS252', name: 'Theory of Computation', credits: 3, grade: 'A-', gpa: 3.7 },
          { code: 'CS253', name: 'Computer Graphics', credits: 4, grade: 'B+', gpa: 3.3 },
          { code: 'CS254', name: 'Compiler Design', credits: 3, grade: 'A', gpa: 4.0 },
        ]
      }
    ];

    const getGradeColor = (grade: string) => {
      if (grade === 'A+' || grade === 'A') return 'text-green-600 bg-green-100';
      if (grade === 'A-' || grade === 'B+') return 'text-blue-600 bg-blue-100';
      if (grade === 'B' || grade === 'B-') return 'text-yellow-600 bg-yellow-100';
      return 'text-gray-600 bg-gray-100';
    };

    const calculateSemesterGPA = (courses: any[]) => {
      const totalPoints = courses.reduce((sum, course) => sum + (course.gpa * course.credits), 0);
      const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
      return (totalPoints / totalCredits).toFixed(2);
    };

    return (
      <ResponsiveContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Academic Grades</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall CGPA</div>
            <div className="text-3xl font-bold text-indigo-600">8.54</div>
          </div>
        </div>

        <div className="space-y-6">
          {semesters.map((semester, index) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{semester.name}</h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Semester GPA</div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {calculateSemesterGPA(semester.courses)}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200/50">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Course Code</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Course Name</th>
                        <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Credits</th>
                        <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Grade</th>
                        <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">GPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course, courseIndex) => (
                        <motion.tr
                          key={course.code}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.2) + (courseIndex * 0.1), duration: 0.3 }}
                          className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors"
                        >
                          <td className="py-3 px-2 font-medium text-gray-900">{course.code}</td>
                          <td className="py-3 px-2 text-gray-700">{course.name}</td>
                          <td className="py-3 px-2 text-center text-gray-600">{course.credits}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-semibold text-gray-900">{course.gpa}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ResponsiveContainer>
    );
  };

  const renderFees = () => {
    const feeStructure = [
      { category: 'Tuition Fee', amount: 75000, paid: 60000, due: 15000, dueDate: '2024-02-15', status: 'pending' },
      { category: 'Lab Fee', amount: 5000, paid: 5000, due: 0, dueDate: '2023-12-15', status: 'paid' },
      { category: 'Library Fee', amount: 2000, paid: 2000, due: 0, dueDate: '2023-12-15', status: 'paid' },
      { category: 'Hostel Fee', amount: 30000, paid: 30000, due: 0, dueDate: '2023-12-15', status: 'paid' },
      { category: 'Transport Fee', amount: 8000, paid: 4000, due: 4000, dueDate: '2024-02-20', status: 'partial' },
    ];

    const totalAmount = feeStructure.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = feeStructure.reduce((sum, fee) => sum + fee.paid, 0);
    const totalDue = feeStructure.reduce((sum, fee) => sum + fee.due, 0);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-700';
        case 'partial': return 'bg-yellow-100 text-yellow-700';
        case 'pending': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <ResponsiveContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Fee Management</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Make Payment
          </button>
        </div>

        <ResponsiveGrid cols={{ mobile: 1, tablet: 3, desktop: 3 }} gap="lg">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Total Fee</div>
              <div className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Amount Paid</div>
              <div className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</div>
            </div>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Amount Due</div>
              <div className="text-3xl font-bold">₹{totalDue.toLocaleString()}</div>
            </div>
          </Card>
        </ResponsiveGrid>

        <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Fee Breakdown</h3>
            <div className="text-sm text-gray-600">Academic Year 2023-24</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Total Amount</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Paid</th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Due</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee, index) => (
                  <motion.tr
                    key={fee.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="py-4 px-2 font-medium text-gray-900">{fee.category}</td>
                    <td className="py-4 px-2 text-right text-gray-900">₹{fee.amount.toLocaleString()}</td>
                    <td className="py-4 px-2 text-right text-green-600 font-semibold">₹{fee.paid.toLocaleString()}</td>
                    <td className="py-4 px-2 text-right text-red-600 font-semibold">₹{fee.due.toLocaleString()}</td>
                    <td className="py-4 px-2 text-center text-sm text-gray-600">{fee.dueDate}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(fee.status)}`}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      {fee.due > 0 && (
                        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs font-medium">
                          Pay Now
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-3">
            {[
              { date: '2023-12-15', amount: 112000, description: 'Initial Payment (Multiple categories)', status: 'completed' },
              { date: '2023-10-20', amount: 4000, description: 'Transport Fee - Partial Payment', status: 'completed' },
            ].map((payment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{payment.description}</div>
                  <div className="text-sm text-gray-600">{payment.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{payment.amount.toLocaleString()}</div>
                  <div className="text-xs text-green-600 capitalize">{payment.status}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </ResponsiveContainer>
    );
  };

  const renderAttendance = () => {
    const attendanceData = [
      { course: 'Data Structures and Algorithms', code: 'CS301', attended: 28, total: 32, percentage: 87.5, color: 'from-green-500 to-emerald-600' },
      { course: 'Database Management Systems', code: 'CS302', attended: 25, total: 28, percentage: 89.3, color: 'from-blue-500 to-indigo-600' },
      { course: 'Computer Networks', code: 'CS303', attended: 22, total: 30, percentage: 73.3, color: 'from-yellow-500 to-orange-500' },
      { course: 'Software Engineering', code: 'CS304', attended: 26, total: 28, percentage: 92.9, color: 'from-purple-500 to-violet-600' },
      { course: 'Operating Systems', code: 'CS305', attended: 20, total: 32, percentage: 62.5, color: 'from-red-500 to-pink-600' },
      { course: 'Machine Learning', code: 'CS306', attended: 24, total: 26, percentage: 92.3, color: 'from-indigo-500 to-blue-600' },
    ];

    const overallAttendance = {
      attended: attendanceData.reduce((sum, course) => sum + course.attended, 0),
      total: attendanceData.reduce((sum, course) => sum + course.total, 0),
      percentage: 0,
    };
    overallAttendance.percentage = (overallAttendance.attended / overallAttendance.total) * 100;

    const getAttendanceStatus = (percentage: number) => {
      if (percentage >= 85) return { status: 'Excellent', color: 'text-green-600 bg-green-100' };
      if (percentage >= 75) return { status: 'Good', color: 'text-blue-600 bg-blue-100' };
      if (percentage >= 65) return { status: 'Average', color: 'text-yellow-600 bg-yellow-100' };
      return { status: 'Poor', color: 'text-red-600 bg-red-100' };
    };

    return (
      <ResponsiveContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Attendance Tracking</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall Attendance</div>
            <div className="text-3xl font-bold text-indigo-600">{overallAttendance.percentage.toFixed(1)}%</div>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Monthly Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-sm opacity-90">Classes Attended:</span>
                  <span className="font-bold">{overallAttendance.attended}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm opacity-90">Total Classes:</span>
                  <span className="font-bold">{overallAttendance.total}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{overallAttendance.percentage.toFixed(0)}%</div>
                  <div className="text-xs opacity-90">Overall</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {attendanceData.map((course, index) => {
            const status = getAttendanceStatus(course.percentage);
            return (
              <motion.div
                key={course.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300" hover={true}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${course.color}`}></div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{course.course}</h3>
                          <p className="text-sm text-gray-600">{course.code}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{course.attended}</span> / {course.total} classes
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                        <span className="text-lg font-bold text-gray-900">{course.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${course.color} transition-all duration-1000`} 
                          style={{width: `${course.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50/80 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">5</div>
              <div className="text-sm text-green-700">Days Present This Week</div>
            </div>
            <div className="text-center p-4 bg-red-50/80 rounded-xl">
              <div className="text-2xl font-bold text-red-600 mb-1">1</div>
              <div className="text-sm text-red-700">Days Absent This Week</div>
            </div>
            <div className="text-center p-4 bg-blue-50/80 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">22</div>
              <div className="text-sm text-blue-700">Days Present This Month</div>
            </div>
          </div>
        </Card>
      </ResponsiveContainer>
    );
  };

  const renderCalendar = () => {
    const handleEventClick = (event: CalendarEvent) => {
      console.log('Event clicked:', event);
    };

    const handleDateClick = (date: Date) => {
      console.log('Date clicked:', date);
    };

    const handleEventCreate = (date: Date) => {
      console.log('Create event for:', date);
      const newEvent = createSampleEvent(
        `Study Session`,
        date,
        'assignment',
        'Personal study time',
        '07:00 PM',
        '09:00 PM',
        'Library'
      );
      console.log('Sample event created:', newEvent);
    };

    return (
      <div className="h-full">
        <CalendarComponent
          events={studentCalendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onEventCreate={handleEventCreate}
          canCreateEvents={false} // Students can't create institutional events
          viewMode="month"
          userRole="student"
          className="calendar-student"
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      case 'assignments':
        return renderAssignments();
      case 'grades':
        return renderGrades();
      case 'fees':
        return renderFees();
      case 'attendance':
        return renderAttendance();
      case 'calendar':
        return renderCalendar();
      case 'chat':
        return <ChatApp />;
      default:
        return (
          <ResponsiveContainer>
            <div className="text-center py-12">
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                This section is coming soon!
              </motion.p>
            </div>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
