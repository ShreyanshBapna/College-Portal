import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import ChatApp from './ChatApp';
import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';

interface DashboardData {
  overview: {
    totalCourses: number;
    completedAssignments: number;
    pendingAssignments: number;
    attendancePercentage: number;
    cgpa: number;
    pendingFees: number;
  };
  recentAssignments: Array<{
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'exam' | 'assignment' | 'event';
  }>;
  subjectProgress: Array<{
    subject: string;
    completed: number;
    total: number;
    grade: string;
  }>;
  attendanceData: Array<{
    subject: string;
    present: number;
    total: number;
    percentage: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Default/fallback data
  const defaultDashboardData: DashboardData = useMemo(() => ({
    overview: {
      totalCourses: 0,
      completedAssignments: 0,
      pendingAssignments: 0,
      attendancePercentage: 0,
      cgpa: 0,
      pendingFees: 0,
    },
    recentAssignments: [],
    upcomingEvents: [],
    subjectProgress: [],
    attendanceData: [],
  }), []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/student`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.log('Dashboard API not available, using default data');
        setDashboardData(defaultDashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.log('Using default dashboard data due to API error');
      setDashboardData(defaultDashboardData);
    } finally {
      setLoading(false);
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
        label: 'Total Courses',
        value: overview.totalCourses,
        icon: BookOpen,
        color: 'bg-gradient-to-r from-blue-600 to-blue-700',
        textColor: 'text-blue-600'
      },
      {
        label: 'Completed Assignments',
        value: overview.completedAssignments,
        icon: CheckCircle,
        color: 'bg-gradient-to-r from-green-600 to-green-700',
        textColor: 'text-green-600'
      },
      {
        label: 'Pending Assignments',
        value: overview.pendingAssignments,
        icon: Clock,
        color: 'bg-gradient-to-r from-orange-600 to-orange-700',
        textColor: 'text-orange-600'
      },
      {
        label: 'Attendance',
        value: `${overview.attendancePercentage}%`,
        icon: Users,
        color: 'bg-gradient-to-r from-purple-600 to-purple-700',
        textColor: 'text-purple-600'
      },
      {
        label: 'CGPA',
        value: (overview.cgpa || 0).toFixed(2),
        icon: Award,
        color: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
        textColor: 'text-indigo-600'
      },
      {
        label: 'Pending Fees',
        value: `₹${(overview.pendingFees || 0).toLocaleString()}`,
        icon: CreditCard,
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
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.profile?.firstName || 'Student'}!</h2>
          <p className="text-blue-100">
            Roll Number: {user?.studentDetails?.rollNumber || 'N/A'} | 
            Department: {user?.studentDetails?.department || 'N/A'} | 
            Semester: {user?.studentDetails?.semester || 'N/A'}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Subject Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.subjectProgress || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attendance Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: overview.attendancePercentage || 0, fill: '#10B981' },
                    { name: 'Absent', value: Math.max(0, 100 - (overview.attendancePercentage || 0)), fill: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Assignments</h3>
            <div className="space-y-4">
              {(dashboardData.recentAssignments || []).slice(0, 5).map((assignment, index) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assignment.status === 'pending' && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        Pending
                      </span>
                    )}
                    {assignment.status === 'submitted' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Submitted
                      </span>
                    )}
                    {assignment.status === 'graded' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {assignment.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {(dashboardData.upcomingEvents || []).slice(0, 5).map((event, index) => (
                <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'exam' ? 'bg-red-100' :
                    event.type === 'assignment' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    {event.type === 'exam' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {event.type === 'assignment' && <FileText className="w-5 h-5 text-orange-600" />}
                    {event.type === 'event' && <Calendar className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            All
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Pending
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Submitted
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(dashboardData?.recentAssignments || []).map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{assignment.title}</h3>
                <p className="text-sm text-gray-600">{assignment.subject}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                assignment.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {assignment.status === 'graded' ? assignment.grade : assignment.status}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                {assignment.status === 'pending' && (
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Submit
                  </button>
                )}
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
      case 'assignments':
        return renderAssignments();
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

export default StudentDashboard;