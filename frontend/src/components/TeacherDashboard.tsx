import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import ChatApp from './ChatApp';
import LiveAttendance from './LiveAttendance';
import ResponsiveContainer from './ResponsiveContainer';
import ResponsiveGrid from './ResponsiveGrid';
import Card from './Card';
import StatCard from './StatCard';
import CalendarComponent, { CalendarEvent } from './Calendar';
import { teacherCalendarEvents, createSampleEvent } from '../utils/calendarData';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Plus,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as RechartsContainer, LineChart, Line } from 'recharts';

interface TeacherDashboardData {
  overview: {
    totalClasses: number;
    totalStudents: number;
    pendingGrading: number;
    averageAttendance: number;
    completedLectures: number;
    upcomingClasses: number;
  };
  classes: Array<{
    id: string;
    name: string;
    subject: string;
    semester: string;
    studentCount: number;
    nextClass: string;
    attendanceRate: number;
  }>;
  recentAssignments: Array<{
    id: string;
    title: string;
    class: string;
    submittedCount: number;
    totalCount: number;
    dueDate: string;
    status: 'active' | 'closed' | 'grading';
  }>;
  studentPerformance: Array<{
    class: string;
    averageGrade: number;
    attendanceRate: number;
    submissionRate: number;
  }>;
  upcomingSchedule: Array<{
    id: string;
    title: string;
    time: string;
    date: string;
    type: 'lecture' | 'lab' | 'exam' | 'meeting';
    class?: string;
  }>;
}

const TeacherDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);

  // Default/fallback data
  const defaultDashboardData: TeacherDashboardData = useMemo(() => ({
    overview: {
      totalClasses: 8,
      totalStudents: 240,
      pendingGrading: 15,
      averageAttendance: 82,
      completedLectures: 45,
      upcomingClasses: 6,
    },
    classes: [
      {
        id: '1',
        name: 'Computer Science 101',
        subject: 'Programming Fundamentals',
        semester: 'Fall 2024',
        studentCount: 35,
        nextClass: '2024-01-15T10:00:00Z',
        attendanceRate: 85
      },
      {
        id: '2',
        name: 'Data Structures',
        subject: 'Advanced Programming',
        semester: 'Fall 2024',
        studentCount: 28,
        nextClass: '2024-01-16T14:00:00Z',
        attendanceRate: 78
      },
    ],
    recentAssignments: [
      {
        id: '1',
        title: 'Programming Assignment 3',
        class: 'CS 101',
        submittedCount: 25,
        totalCount: 35,
        dueDate: '2024-01-20',
        status: 'active'
      },
    ],
    studentPerformance: [
      { class: 'CS 101', averageGrade: 78, attendanceRate: 85, submissionRate: 92 },
      { class: 'Data Structures', averageGrade: 82, attendanceRate: 78, submissionRate: 89 },
    ],
    upcomingSchedule: [
      {
        id: '1',
        title: 'Programming Fundamentals',
        time: '10:00 AM',
        date: '2024-01-15',
        type: 'lecture',
        class: 'CS 101'
      },
    ],
  }), []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/teacher`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.log('Teacher dashboard API not available, using default data');
        setDashboardData(defaultDashboardData);
      }
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      console.log('Using default teacher dashboard data due to API error');
      setDashboardData(defaultDashboardData);
    } finally {
      // Data loaded
    }
  }, [token, defaultDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const renderOverview = () => {
    if (!dashboardData || !dashboardData.overview) return null;

    const { overview } = dashboardData;
    
    const stats = [
      {
        label: 'Total Classes',
        value: overview.totalClasses || 0,
        icon: BookOpen,
        color: 'bg-gradient-to-r from-blue-600 to-blue-700',
        textColor: 'text-blue-600'
      },
      {
        label: 'Total Students',
        value: overview.totalStudents || 0,
        icon: Users,
        color: 'bg-gradient-to-r from-green-600 to-green-700',
        textColor: 'text-green-600'
      },
      {
        label: 'Pending Grading',
        value: overview.pendingGrading || 0,
        icon: Clock,
        color: 'bg-gradient-to-r from-orange-600 to-orange-700',
        textColor: 'text-orange-600'
      },
      {
        label: 'Avg Attendance',
        value: `${overview.averageAttendance || 0}%`,
        icon: Target,
        color: 'bg-gradient-to-r from-purple-600 to-purple-700',
        textColor: 'text-purple-600'
      },
      {
        label: 'Completed Lectures',
        value: overview.completedLectures,
        icon: CheckCircle,
        color: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
        textColor: 'text-indigo-600'
      },
      {
        label: 'Upcoming Classes',
        value: overview.upcomingClasses,
        icon: Calendar,
        color: 'bg-gradient-to-r from-red-600 to-red-700',
        textColor: 'text-red-600'
      }
    ];

    return (
      <ResponsiveContainer>
        <div className="space-y-6 lg:space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Welcome back, Prof. {user?.profile?.lastName || 'Teacher'}! 👨‍🏫</h2>
              <div className="text-indigo-100 flex flex-wrap gap-6 text-sm sm:text-base">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>ID: {user?.teacherDetails?.employeeId || 'N/A'}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Dept: {user?.teacherDetails?.department || 'N/A'}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Experience: {user?.teacherDetails?.experience || 'N/A'} years</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                textColor={stat.textColor}
                delay={index * 0.1}
              />
            ))}
          </ResponsiveGrid>

          {/* Performance Charts */}
          <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
            {/* Class Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span>Class Performance</span>
                </h3>
                <div className="px-3 py-1 bg-blue-100/70 text-blue-700 rounded-full text-xs font-semibold">
                  Overview
                </div>
              </div>
              <RechartsContainer width="100%" height={300}>
                <BarChart data={dashboardData.studentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="averageGrade" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </RechartsContainer>
            </motion.div>

            {/* Attendance Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                  <span>Attendance Trends</span>
                </h3>
                <div className="px-3 py-1 bg-emerald-100/70 text-emerald-700 rounded-full text-xs font-semibold">
                  Monthly
                </div>
              </div>
              <RechartsContainer width="100%" height={300}>
                <LineChart data={dashboardData.studentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="attendanceRate" stroke="#10B981" strokeWidth={4} dot={{ fill: '#10B981', r: 6 }} />
                </LineChart>
              </RechartsContainer>
            </motion.div>
          </ResponsiveGrid>

        {/* Classes and Schedule */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          {/* My Classes */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">My Classes</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.classes.slice(0, 4).map((classItem, index) => (
                <div key={classItem.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                      <p className="text-sm text-gray-600">{classItem.subject} - Semester {classItem.semester}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {classItem.studentCount} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Next class: {new Date(classItem.nextClass).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Attendance: {classItem.attendanceRate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${classItem.attendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Schedule */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add Event
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingSchedule.slice(0, 5).map((event, index) => (
                <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'lecture' ? 'bg-blue-100' :
                    event.type === 'lab' ? 'bg-green-100' :
                    event.type === 'exam' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    {event.type === 'lecture' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {event.type === 'lab' && <Users className="w-5 h-5 text-green-600" />}
                    {event.type === 'exam' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {event.type === 'meeting' && <Calendar className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.time} {event.class && `- ${event.class}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 capitalize">{event.type}</span>
                </div>
              ))}
            </div>
          </Card>
        </ResponsiveGrid>
      </div>
      </ResponsiveContainer>
    );
  };

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search classes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span>New Class</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData?.classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{classItem.name}</h3>
                <p className="text-sm text-gray-600">{classItem.subject}</p>
                <p className="text-xs text-gray-500">Semester {classItem.semester}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {classItem.studentCount} students
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="font-semibold text-green-600">{classItem.attendanceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${classItem.attendanceRate}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600">
                Next class: {new Date(classItem.nextClass).toLocaleDateString()}
              </p>
              
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Take Attendance
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => {
    const studentsData = [
      { id: 1, name: 'Arjun Sharma', rollNo: 'CSE2021001', grade: 'A+', attendance: 92, assignments: 8, status: 'active' },
      { id: 2, name: 'Priya Gupta', rollNo: 'CSE2021002', grade: 'A', attendance: 88, assignments: 7, status: 'active' },
      { id: 3, name: 'Rahul Patel', rollNo: 'CSE2021003', grade: 'B+', attendance: 85, assignments: 6, status: 'active' },
      { id: 4, name: 'Sneha Jain', rollNo: 'CSE2021004', grade: 'A+', attendance: 95, assignments: 8, status: 'active' },
      { id: 5, name: 'Vikash Kumar', rollNo: 'CSE2021005', grade: 'B', attendance: 78, assignments: 5, status: 'warning' }
    ];

    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-teal-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">🎓 My Students</h2>
            <p className="text-teal-100">Manage and track student performance in your classes</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {studentsData.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.rollNo}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  student.status === 'active' ? 'bg-green-100/70 text-green-800' : 'bg-orange-100/70 text-orange-800'
                }`}>
                  {student.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    student.grade === 'A+' ? 'text-green-600' :
                    student.grade === 'A' ? 'text-blue-600' :
                    student.grade === 'B+' ? 'text-yellow-600' : 'text-orange-600'
                  }`}>{student.grade}</div>
                  <div className="text-gray-500">Grade</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    student.attendance >= 90 ? 'text-green-600' :
                    student.attendance >= 80 ? 'text-blue-600' : 'text-orange-600'
                  }`}>{student.attendance}%</div>
                  <div className="text-gray-500">Attendance</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assignments</span>
                  <span className="font-medium">{student.assignments}/8</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-1000" 
                    style={{width: `${(student.assignments / 8) * 100}%`}}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssignments = () => {
    const assignmentsData = [
      { id: 1, title: 'Data Structures Lab', course: 'CS301', dueDate: '2024-10-01', submitted: 23, total: 25, status: 'active' },
      { id: 2, title: 'Algorithm Analysis', course: 'CS302', dueDate: '2024-10-05', submitted: 20, total: 25, status: 'grading' },
      { id: 3, title: 'Database Project', course: 'CS303', dueDate: '2024-10-10', submitted: 0, total: 25, status: 'draft' },
      { id: 4, title: 'Web Development', course: 'CS304', dueDate: '2024-10-15', submitted: 25, total: 25, status: 'completed' }
    ];

    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">📝 Assignments</h2>
            <p className="text-purple-100">Create, manage, and grade student assignments</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignmentsData.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{assignment.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{assignment.course}</span>
                    <span>•</span>
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  assignment.status === 'completed' ? 'bg-green-100/70 text-green-800' :
                  assignment.status === 'active' ? 'bg-blue-100/70 text-blue-800' :
                  assignment.status === 'grading' ? 'bg-yellow-100/70 text-yellow-800' :
                  'bg-gray-100/70 text-gray-800'
                }`}>
                  {assignment.status}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Submissions</span>
                  <span className="font-medium">{assignment.submitted}/{assignment.total}</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000" 
                    style={{width: `${(assignment.submitted / assignment.total) * 100}%`}}
                  ></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium">
                  View Details
                </button>
                <button className="px-4 py-2 border border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium">
                  Grade
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
              <input className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" placeholder="Enter assignment title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent">
                <option>CS301 - Data Structures</option>
                <option>CS302 - Algorithms</option>
                <option>CS303 - Database Systems</option>
                <option>CS304 - Web Development</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Points</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" placeholder="100" />
            </div>
          </div>
          <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium">
            Create Assignment
          </button>
        </motion.div>
      </div>
    );
  };

  const renderGrades = () => {
    const gradesData = [
      { student: 'Arjun Sharma', rollNo: 'CSE2021001', midterm: 85, assignments: 92, project: 88, final: 90, total: 'A+' },
      { student: 'Priya Gupta', rollNo: 'CSE2021002', midterm: 82, assignments: 88, project: 85, final: 87, total: 'A' },
      { student: 'Rahul Patel', rollNo: 'CSE2021003', midterm: 78, assignments: 80, project: 82, final: 83, total: 'B+' },
      { student: 'Sneha Jain', rollNo: 'CSE2021004', midterm: 90, assignments: 95, project: 92, final: 94, total: 'A+' },
      { student: 'Vikash Kumar', rollNo: 'CSE2021005', midterm: 75, assignments: 78, project: 80, final: 79, total: 'B' }
    ];

    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">🏆 Grading</h2>
            <p className="text-emerald-100">Student grades and performance evaluation</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300 overflow-x-auto"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Grade Book - CS301 Data Structures</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/30">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Roll No</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Midterm</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Assignments</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Project</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Final</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Grade</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.map((grade, index) => (
                  <motion.tr
                    key={grade.rollNo}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{grade.student}</div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">{grade.rollNo}</td>
                    <td className="py-3 px-4 text-center font-medium">{grade.midterm}</td>
                    <td className="py-3 px-4 text-center font-medium">{grade.assignments}</td>
                    <td className="py-3 px-4 text-center font-medium">{grade.project}</td>
                    <td className="py-3 px-4 text-center font-medium">{grade.final}</td>
                    <td className="py-3 px-4 text-center">
                      <div className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${
                        grade.total === 'A+' ? 'bg-green-100/70 text-green-800' :
                        grade.total === 'A' ? 'bg-blue-100/70 text-blue-800' :
                        grade.total === 'B+' ? 'bg-yellow-100/70 text-yellow-800' :
                        'bg-orange-100/70 text-orange-800'
                      }`}>
                        {grade.total}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
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
        `Class Schedule`,
        date,
        'class',
        'Scheduled class session',
        '10:00 AM',
        '11:00 AM',
        'Classroom 101'
      );
      console.log('Sample event created:', newEvent);
    };

    return (
      <div className="h-full">
        <CalendarComponent
          events={teacherCalendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onEventCreate={handleEventCreate}
          canCreateEvents={true}
          viewMode="month"
          userRole="teacher"
          className="calendar-teacher"
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'classes':
        return renderClasses();
      case 'students':
        return renderStudents();
      case 'assignments':
        return renderAssignments();
      case 'grades':
        return renderGrades();
      case 'calendar':
        return renderCalendar();
      case 'attendance':
        return <LiveAttendance />;
      case 'chat':
        return <ChatApp />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <p className="text-gray-600">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default TeacherDashboard;