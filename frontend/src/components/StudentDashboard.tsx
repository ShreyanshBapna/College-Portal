import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import ChatApp from './ChatApp';
import ResponsiveContainer from './ResponsiveContainer';
import ResponsiveGrid from './ResponsiveGrid';
import Card from './Card';
import StatCard from './StatCard';
import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Clock,
  CheckCircle,
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as RechartsContainer, PieChart, Pie } from 'recharts';

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
    if (!dashboardData?.overview) return null;

    const { overview } = dashboardData;
    const stats = [
      { label: 'Courses', value: overview.totalCourses || 0, icon: BookOpen, color: 'bg-blue-500', textColor: 'text-blue-600' },
      { label: 'Pending', value: overview.pendingAssignments || 0, icon: Clock, color: 'bg-orange-500', textColor: 'text-orange-600' },
      { label: 'Completed', value: overview.completedAssignments || 0, icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-600' },
      { label: 'Attendance', value: `${overview.attendancePercentage || 0}%`, icon: Users, color: 'bg-purple-500', textColor: 'text-purple-600' },
      { label: 'CGPA', value: (overview.cgpa || 0).toFixed(2), icon: Award, color: 'bg-indigo-500', textColor: 'text-indigo-600' },
      { label: 'Fees Due', value: `₹${(overview.pendingFees || 0).toLocaleString()}`, icon: CreditCard, color: 'bg-red-500', textColor: 'text-red-600' }
    ];

    return (
      <ResponsiveContainer className="space-y-6 lg:space-y-8">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" hover={false}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Welcome, {user?.profile?.firstName || 'Student'}!
          </h1>
          <div className="text-blue-100 flex flex-wrap gap-4 text-sm sm:text-base">
            <span>Roll: {user?.studentDetails?.rollNumber || 'N/A'}</span>
            <span>Dept: {user?.studentDetails?.department || 'N/A'}</span>
            <span>Sem: {user?.studentDetails?.semester || 'N/A'}</span>
          </div>
        </Card>

        {/* Stats Grid - Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols */}
        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </ResponsiveGrid>

        {/* Charts Row - Stack on mobile, side-by-side on desktop */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          <Card>
            <h3 className="text-xl font-bold mb-4">Subject Progress</h3>
            <div className="h-64 lg:h-80">
              <RechartsContainer width="100%" height="100%">
                <BarChart data={dashboardData.subjectProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </RechartsContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Attendance</h3>
            <div className="h-64 lg:h-80">
              <RechartsContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: overview.attendancePercentage || 0, fill: '#10B981' },
                      { name: 'Absent', value: 100 - (overview.attendancePercentage || 0), fill: '#EF4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  />
                  <Tooltip />
                </PieChart>
              </RechartsContainer>
            </div>
          </Card>
        </ResponsiveGrid>

        {/* Activity Row - Stack on mobile/tablet, side-by-side on desktop */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          <Card>
            <h3 className="text-xl font-bold mb-4">Recent Assignments</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(dashboardData.recentAssignments || []).slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{assignment.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{assignment.subject}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                      assignment.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assignment.status === 'graded' ? assignment.grade : assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(dashboardData.upcomingEvents || []).slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    {event.type === 'exam' && <FileText className="w-5 h-5 text-red-500" />}
                    {event.type === 'assignment' && <BookOpen className="w-5 h-5 text-blue-500" />}
                    {event.type === 'event' && <Calendar className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </ResponsiveGrid>
      </ResponsiveContainer>
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
        <ResponsiveContainer>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        </ResponsiveContainer>
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