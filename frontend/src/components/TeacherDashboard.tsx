import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import ChatApp from './ChatApp';
import LiveAttendance from './LiveAttendance';
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    if (!dashboardData) return null;

    const { overview } = dashboardData;
    
    const stats = [
      {
        label: 'Total Classes',
        value: overview.totalClasses,
        icon: BookOpen,
        color: 'bg-gradient-to-r from-blue-600 to-blue-700',
        textColor: 'text-blue-600'
      },
      {
        label: 'Total Students',
        value: overview.totalStudents,
        icon: Users,
        color: 'bg-gradient-to-r from-green-600 to-green-700',
        textColor: 'text-green-600'
      },
      {
        label: 'Pending Grading',
        value: overview.pendingGrading,
        icon: Clock,
        color: 'bg-gradient-to-r from-orange-600 to-orange-700',
        textColor: 'text-orange-600'
      },
      {
        label: 'Avg Attendance',
        value: `${overview.averageAttendance}%`,
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
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome, Prof. {user?.profile?.lastName || 'Teacher'}!</h2>
          <p className="text-indigo-100">
            Employee ID: {user?.teacherDetails?.employeeId} | 
            Department: {user?.teacherDetails?.department} | 
            Experience: {user?.teacherDetails?.experience} years
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Class Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageGrade" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attendance Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendanceRate" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Classes and Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
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
          </motion.div>

          {/* Upcoming Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
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
          </motion.div>
        </div>
      </div>
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'classes':
        return renderClasses();
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