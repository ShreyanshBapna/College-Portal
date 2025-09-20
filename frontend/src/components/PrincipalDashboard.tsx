import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import ChatApp from './ChatApp';
import AnnouncementBroadcast from './AnnouncementBroadcast';
import ResponsiveContainer from './ResponsiveContainer';
import ResponsiveGrid from './ResponsiveGrid';
import Card from './Card';
import StatCard from './StatCard';
import {
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Bell,
  Award,
  Building,
  Target,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as RechartsContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

interface PrincipalDashboardData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalRevenue: number;
    pendingAdmissions: number;
    averageAttendance: number;
    collegeRating: number;
  };
  departmentStats: Array<{
    department: string;
    studentCount: number;
    teacherCount: number;
    averageGrade: number;
    placementRate: number;
  }>;
  financialData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  performanceMetrics: Array<{
    metric: string;
    current: number;
    target: number;
    change: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: 'admission' | 'graduation' | 'event' | 'announcement' | 'alert';
    title: string;
    description: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'meeting' | 'ceremony' | 'inspection' | 'conference';
    participants: number;
  }>;
}

const PrincipalDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState<PrincipalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/principal`, {
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
        label: 'Total Students',
        value: overview.totalStudents.toLocaleString(),
        icon: GraduationCap,
        color: 'bg-gradient-to-r from-blue-600 to-blue-700',
        textColor: 'text-blue-600',
        change: '+12%'
      },
      {
        label: 'Faculty Members',
        value: overview.totalTeachers,
        icon: Users,
        color: 'bg-gradient-to-r from-green-600 to-green-700',
        textColor: 'text-green-600',
        change: '+5%'
      },
      {
        label: 'Total Revenue',
        value: `₹${(overview.totalRevenue / 10000000).toFixed(1)}Cr`,
        icon: DollarSign,
        color: 'bg-gradient-to-r from-purple-600 to-purple-700',
        textColor: 'text-purple-600',
        change: '+18%'
      },
      {
        label: 'Pending Admissions',
        value: overview.pendingAdmissions,
        icon: FileText,
        color: 'bg-gradient-to-r from-orange-600 to-orange-700',
        textColor: 'text-orange-600',
        change: '+25%'
      },
      {
        label: 'Avg Attendance',
        value: `${overview.averageAttendance}%`,
        icon: Target,
        color: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
        textColor: 'text-indigo-600',
        change: '+3%'
      },
      {
        label: 'College Rating',
        value: `${overview.collegeRating}/5.0`,
        icon: Award,
        color: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
        textColor: 'text-yellow-600',
        change: '+0.2'
      }
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome, Principal {user?.profile?.lastName || 'Admin'}!</h2>
          <p className="text-purple-100">
            Employee ID: {user?.principalDetails?.employeeId} | 
            Leading JECRC Foundation towards excellence in education
          </p>
        </motion.div>

        {/* Stats Grid */}
        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              textColor={stat.textColor}
              change={stat.change}
            />
          ))}
        </ResponsiveGrid>

        {/* Analytics Section */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 3 }} gap="lg">
          {/* Department Performance */}
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Department Performance</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Students</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">Grades</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">Placement</button>
              </div>
            </div>
            <RechartsContainer width="100%" height={300}>
              <BarChart data={dashboardData.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="studentCount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </RechartsContainer>
          </Card>

          {/* Student Distribution */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Student Distribution</h3>
            <RechartsContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.departmentStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="studentCount"
                  label={({ department, studentCount }) => `${department}: ${studentCount}`}
                >
                  {dashboardData.departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </RechartsContainer>
          </Card>
        </ResponsiveGrid>

        {/* Financial Overview */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Financial Overview</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>
          </div>
          <RechartsContainer width="100%" height={350}>
            <AreaChart data={dashboardData.financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </RechartsContainer>
        </Card>

        {/* Performance Metrics and Activities */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          {/* Performance Metrics */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Performance Indicators</h3>
            <div className="space-y-4">
              {dashboardData.performanceMetrics.map((metric, index) => (
                <div key={metric.metric} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      metric.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Current: {metric.current}</span>
                    <span>Target: {metric.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivities.slice(0, 6).map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'admission' ? 'bg-blue-100' :
                    activity.type === 'graduation' ? 'bg-green-100' :
                    activity.type === 'event' ? 'bg-purple-100' :
                    activity.type === 'announcement' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {activity.type === 'admission' && <GraduationCap className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'graduation' && <Award className="w-4 h-4 text-green-600" />}
                    {activity.type === 'event' && <Calendar className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'announcement' && <Bell className="w-4 h-4 text-yellow-600" />}
                    {activity.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </ResponsiveGrid>

        {/* Upcoming Events */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Events & Meetings</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>
          <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
            {dashboardData.upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'ceremony' ? 'bg-green-100 text-green-800' :
                    event.type === 'inspection' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
                <p className="text-xs text-gray-500">
                  {event.participants} participants expected
                </p>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </Card>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Department Comparison</h3>
          <RechartsContainer width="100%" height={350}>
            <BarChart data={dashboardData?.departmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageGrade" fill="#3B82F6" name="Average Grade" />
              <Bar dataKey="placementRate" fill="#10B981" name="Placement Rate %" />
            </BarChart>
          </RechartsContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Trends</h3>
          <RechartsContainer width="100%" height={350}>
            <LineChart data={dashboardData?.financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} name="Profit" />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue" />
            </LineChart>
          </RechartsContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return renderAnalytics();
      case 'announcements':
        return <AnnouncementBroadcast />;
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

export default PrincipalDashboard;
