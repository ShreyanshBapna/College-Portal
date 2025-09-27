import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, DollarSign, FileText, Target, Activity as ActivityIcon, Calendar, Download, Plus } from 'lucide-react';
import StatCard from './StatCard';
import ResponsiveGrid from './ResponsiveGrid';
import DashboardLayout from './DashboardLayout';
import AnnouncementBroadcast from './AnnouncementBroadcast';
import ChatApp from './ChatApp';
import CalendarComponent, { CalendarEvent } from './Calendar';
import { principalCalendarEvents, createSampleEvent } from '../utils/calendarData';
import { BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ResponsiveContainer as RechartsContainer } from 'recharts';

interface DashboardOverview {
  totalStudents: number;
  totalTeachers: number;
  totalDepartments: number;
  averageAttendance: number;
  totalRevenue: number;
  pendingAdmissions: number;
}

interface DepartmentStats {
  department: string;
  studentCount: number;
  teacherCount: number;
}

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  type: string;
  location?: string;
}

interface DashboardData {
  overview: DashboardOverview;
  departmentStats: DepartmentStats[];
  financialData: FinancialData[];
  performanceMetrics: PerformanceMetric[];
  recentActivities: Activity[];
  upcomingEvents: Event[];
}

const PrincipalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data - replace with actual API data
  const mockDashboardData: DashboardData = {
    overview: {
      totalStudents: 8542,
      totalTeachers: 425,
      totalDepartments: 12,
      averageAttendance: 87.5,
      totalRevenue: 125000000, // 12.5 Crores
      pendingAdmissions: 156
    },
    departmentStats: [
      { department: 'Computer Science', studentCount: 2150, teacherCount: 85 },
      { department: 'Electronics', studentCount: 1890, teacherCount: 72 },
      { department: 'Mechanical', studentCount: 1654, teacherCount: 68 },
      { department: 'Civil', studentCount: 1420, teacherCount: 58 },
      { department: 'Management', studentCount: 1428, teacherCount: 65 }
    ],
    financialData: [
      { month: 'Jan', revenue: 12000000, expenses: 8500000 },
      { month: 'Feb', revenue: 11500000, expenses: 8200000 },
      { month: 'Mar', revenue: 13200000, expenses: 9100000 },
      { month: 'Apr', revenue: 10800000, expenses: 7800000 },
      { month: 'May', revenue: 12800000, expenses: 8900000 },
      { month: 'Jun', revenue: 14200000, expenses: 9500000 }
    ],
    performanceMetrics: [
      { name: 'Student Satisfaction', value: 4.6, change: 0.2 },
      { name: 'Faculty Rating', value: 4.4, change: 0.1 },
      { name: 'Placement Rate', value: 89, change: 5 },
      { name: 'Research Publications', value: 156, change: 12 }
    ],
    recentActivities: [
      { id: '1', type: 'admission', description: 'New admission: John Doe (CS)', timestamp: new Date(), user: 'Admission Office' },
      { id: '2', type: 'event', description: 'Technical fest registration opened', timestamp: new Date(), user: 'Event Committee' },
      { id: '3', type: 'announcement', description: 'Mid-semester exam schedule released', timestamp: new Date(), user: 'Academic Office' }
    ],
    upcomingEvents: [
      { id: '1', title: 'Annual Tech Fest', date: new Date('2024-03-15'), type: 'academic', location: 'Main Campus' },
      { id: '2', title: 'Faculty Meeting', date: new Date('2024-02-28'), type: 'administrative', location: 'Conference Room' },
      { id: '3', title: 'Placement Drive', date: new Date('2024-03-20'), type: 'career', location: 'Auditorium' }
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        setDashboardData(mockDashboardData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderOverview = () => {
    if (!dashboardData) return null;

    const { overview } = dashboardData;
    
    const stats = [
      {
        label: 'Total Students',
        value: overview.totalStudents.toLocaleString(),
        icon: Users,
        color: 'bg-gradient-to-r from-blue-600 to-blue-700',
        textColor: 'text-blue-600',
        change: '+8%'
      },
      {
        label: 'Departments',
        value: overview.totalDepartments,
        icon: BookOpen,
        color: 'bg-gradient-to-r from-cyan-600 to-cyan-700',
        textColor: 'text-cyan-600',
        change: '+0%'
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
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Welcome, Principal {user?.profile?.firstName || 'Admin'}! 🏛️</h2>
            <div className="text-indigo-100 flex flex-wrap gap-6 text-sm sm:text-base">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>JECRC Foundation</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Academic Year 2024-25</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <span>Leading Excellence in Education</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 6 }} gap="md">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              textColor={stat.textColor}
              change={stat.change}
              delay={index * 0.1}
            />
          ))}
        </ResponsiveGrid>

        {/* Charts Section */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          {/* Department Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                <span>Department Overview</span>
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100/70 text-blue-800 rounded-lg text-sm font-semibold">Students</button>
                <button className="px-3 py-1 bg-gray-100/70 text-gray-600 rounded-lg text-sm">Grades</button>
                <button className="px-3 py-1 bg-gray-100/70 text-gray-600 rounded-lg text-sm">Placement</button>
              </div>
            </div>
            <RechartsContainer width="100%" height={300}>
              <BarChart data={dashboardData.departmentStats as any}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="studentCount" fill="url(#blueGradientPrincipal)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradientPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </RechartsContainer>
          </motion.div>

          {/* Student Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span>Student Distribution</span>
              </h3>
              <div className="px-3 py-1 bg-purple-100/70 text-purple-700 rounded-full text-xs font-semibold">
                By Department
              </div>
            </div>
            <RechartsContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.departmentStats as any}
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
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </RechartsContainer>
          </motion.div>
        </ResponsiveGrid>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              <span>Financial Overview</span>
            </h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg shadow-emerald-500/25 font-medium">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>
          </div>
          <RechartsContainer width="100%" height={350}>
            <AreaChart data={dashboardData.financialData as any}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </RechartsContainer>
        </motion.div>

        {/* Recent Activities & Events */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <span>Recent Activities</span>
              </h3>
              <ActivityIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dashboardData.recentActivities.slice(0, 6).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50/70 rounded-xl transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                <span>Upcoming Events</span>
              </h3>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200/30 rounded-xl hover:border-blue-300/50 transition-colors backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                    {event.date.getDate()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <span>{event.date.toLocaleDateString()}</span>
                      {event.location && (
                        <>
                          <span>•</span>
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-xs font-medium backdrop-blur-sm ${
                    event.type === 'academic' ? 'bg-blue-100/70 text-blue-800' :
                    event.type === 'administrative' ? 'bg-gray-100/70 text-gray-800' :
                    'bg-green-100/70 text-green-800'
                  }`}>
                    {event.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ResponsiveGrid>
      </div>
    );
  };

  const renderAnalytics = () => {
    const analyticsData = {
      yearlyGrowth: [
        { year: '2020', students: 6200, revenue: 85, satisfaction: 3.8 },
        { year: '2021', students: 7100, revenue: 98, satisfaction: 4.1 },
        { year: '2022', students: 7850, revenue: 112, satisfaction: 4.3 },
        { year: '2023', students: 8200, revenue: 119, satisfaction: 4.5 },
        { year: '2024', students: 8542, revenue: 125, satisfaction: 4.6 }
      ],
      departmentPerformance: [
        { department: 'Computer Science', avgGrade: 8.7, placement: 94, research: 28 },
        { department: 'Electronics', avgGrade: 8.4, placement: 89, research: 22 },
        { department: 'Mechanical', avgGrade: 8.1, placement: 85, research: 18 },
        { department: 'Civil', avgGrade: 7.9, placement: 82, research: 15 },
        { department: 'Management', avgGrade: 8.3, placement: 91, research: 12 }
      ],
      monthlyMetrics: [
        { month: 'Jul', applications: 520, admissions: 312, dropout: 8 },
        { month: 'Aug', applications: 680, admissions: 425, dropout: 12 },
        { month: 'Sep', applications: 750, admissions: 468, dropout: 6 },
        { month: 'Oct', applications: 420, admissions: 285, dropout: 9 },
        { month: 'Nov', applications: 380, admissions: 245, dropout: 4 },
        { month: 'Dec', applications: 290, admissions: 198, dropout: 7 }
      ]
    };

    return (
      <div className="space-y-6 lg:space-y-8">
        {/* Analytics Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">📊 Analytics Dashboard</h2>
            <p className="text-emerald-100">Comprehensive insights and performance metrics for JECRC Foundation</p>
          </div>
        </motion.div>

        {/* Year-over-Year Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              <span>5-Year Growth Analysis</span>
            </h3>
            <div className="flex space-x-2">
              <div className="px-3 py-1 bg-emerald-100/70 text-emerald-800 rounded-lg text-sm font-semibold">Students</div>
              <div className="px-3 py-1 bg-blue-100/70 text-blue-800 rounded-lg text-sm">Revenue (Cr)</div>
              <div className="px-3 py-1 bg-purple-100/70 text-purple-800 rounded-lg text-sm">Satisfaction</div>
            </div>
          </div>
          <RechartsContainer width="100%" height={350}>
            <AreaChart data={analyticsData.yearlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area yAxisId="left" type="monotone" dataKey="students" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
            </AreaChart>
          </RechartsContainer>
        </motion.div>

        {/* Department Performance & Monthly Metrics */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span>Department Performance</span>
            </h3>
            <div className="space-y-4">
              {analyticsData.departmentPerformance.map((dept, index) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200/30 rounded-xl hover:border-purple-300/50 transition-colors backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                    <div className="text-xs text-gray-500">#{index + 1}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{dept.avgGrade}</div>
                      <div className="text-gray-500">Avg Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{dept.placement}%</div>
                      <div className="text-gray-500">Placement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{dept.research}</div>
                      <div className="text-gray-500">Research</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <span>Monthly Trends</span>
            </h3>
            <RechartsContainer width="100%" height={280}>
              <BarChart data={analyticsData.monthlyMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="applications" fill="url(#orangeGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="admissions" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </RechartsContainer>
          </motion.div>
        </ResponsiveGrid>
      </div>
    );
  };

  const renderFaculty = () => {
    const facultyData = [
      { id: 1, name: 'Dr. Rajesh Sharma', department: 'Computer Science', experience: '15 years', students: 120, rating: 4.8, status: 'active' },
      { id: 2, name: 'Prof. Priya Gupta', department: 'Electronics', experience: '12 years', students: 98, rating: 4.7, status: 'active' },
      { id: 3, name: 'Dr. Amit Patel', department: 'Mechanical', experience: '18 years', students: 105, rating: 4.6, status: 'active' },
      { id: 4, name: 'Prof. Sneha Jain', department: 'Management', experience: '10 years', students: 85, rating: 4.9, status: 'active' },
      { id: 5, name: 'Dr. Vikash Kumar', department: 'Civil', experience: '14 years', students: 92, rating: 4.5, status: 'leave' }
    ];

    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">👨‍🏫 Faculty Management</h2>
            <p className="text-blue-100">Manage and monitor faculty performance across all departments</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {facultyData.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {faculty.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{faculty.name}</h3>
                  <p className="text-sm text-gray-600">{faculty.department}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  faculty.status === 'active' ? 'bg-green-100/70 text-green-800' : 'bg-orange-100/70 text-orange-800'
                }`}>
                  {faculty.status}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-medium">{faculty.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="text-sm font-medium">{faculty.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="text-sm font-medium text-yellow-600">⭐ {faculty.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderStudents = () => {
    const studentStats = [
      { department: 'Computer Science', total: 2150, active: 2098, graduated: 485, avgGrade: 8.7 },
      { department: 'Electronics', total: 1890, active: 1845, graduated: 412, avgGrade: 8.4 },
      { department: 'Mechanical', total: 1654, active: 1612, graduated: 356, avgGrade: 8.1 },
      { department: 'Civil', total: 1420, active: 1398, graduated: 298, avgGrade: 7.9 },
      { department: 'Management', total: 1428, active: 1405, graduated: 325, avgGrade: 8.3 }
    ];

    const recentAdmissions = [
      { name: 'Arjun Singh', course: 'B.Tech CSE', grade: 'A+', date: '2024-09-25' },
      { name: 'Priya Sharma', course: 'MBA', grade: 'A', date: '2024-09-24' },
      { name: 'Rahul Gupta', course: 'B.Tech ECE', grade: 'A+', date: '2024-09-24' },
      { name: 'Anita Patel', course: 'B.Tech Civil', grade: 'A', date: '2024-09-23' },
      { name: 'Vikram Jain', course: 'B.Tech Mech', grade: 'B+', date: '2024-09-23' }
    ];

    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-green-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">🎓 Student Management</h2>
            <p className="text-green-100">Comprehensive student data and academic performance tracking</p>
          </div>
        </motion.div>

        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
          {studentStats.map((dept, index) => (
            <motion.div
              key={dept.department}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="font-bold text-gray-900 mb-4 text-center">{dept.department}</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dept.total}</div>
                  <div className="text-sm text-gray-500">Total Students</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{dept.active}</div>
                    <div className="text-gray-500">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{dept.graduated}</div>
                    <div className="text-gray-500">Graduated</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{dept.avgGrade}</div>
                  <div className="text-sm text-gray-500">Avg Grade</div>
                </div>
              </div>
            </motion.div>
          ))}
        </ResponsiveGrid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
            <span>Recent Admissions</span>
          </h3>
          <div className="space-y-4">
            {recentAdmissions.map((student, index) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200/30 rounded-xl hover:border-blue-300/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.course}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    student.grade === 'A+' ? 'bg-green-100/70 text-green-800' :
                    student.grade === 'A' ? 'bg-blue-100/70 text-blue-800' : 'bg-yellow-100/70 text-yellow-800'
                  }`}>
                    {student.grade}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{student.date}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderReports = () => {
    const reports = [
      { id: 1, title: 'Academic Performance Report', type: 'Academic', date: '2024-09-25', status: 'Ready', size: '2.4 MB' },
      { id: 2, title: 'Financial Summary Q3', type: 'Financial', date: '2024-09-20', status: 'Ready', size: '1.8 MB' },
      { id: 3, title: 'Faculty Evaluation Report', type: 'HR', date: '2024-09-18', status: 'Processing', size: '3.1 MB' },
      { id: 4, title: 'Infrastructure Audit', type: 'Operations', date: '2024-09-15', status: 'Ready', size: '4.2 MB' },
      { id: 5, title: 'Student Satisfaction Survey', type: 'Academic', date: '2024-09-10', status: 'Ready', size: '1.5 MB' }
    ];

    return (
      <div className="space-y-6 lg:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">📊 Reports & Documents</h2>
            <p className="text-purple-100">Access and generate comprehensive institutional reports</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{report.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  report.status === 'Ready' ? 'bg-green-100/70 text-green-800' : 'bg-yellow-100/70 text-yellow-800'
                }`}>
                  {report.status}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium">
                  Download
                </button>
                <button className="px-4 py-2 border border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50/80 transition-all duration-200 text-sm font-medium">
                  Preview
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-gray-900/5 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Generate New Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-blue-400/50 hover:bg-blue-50/30 transition-all duration-200 text-center">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium text-gray-900">Academic Report</div>
              <div className="text-sm text-gray-500">Performance & grades</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-green-400/50 hover:bg-green-50/30 transition-all duration-200 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-medium text-gray-900">Financial Report</div>
              <div className="text-sm text-gray-500">Revenue & expenses</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300/50 rounded-xl hover:border-purple-400/50 hover:bg-purple-50/30 transition-all duration-200 text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900">HR Report</div>
              <div className="text-sm text-gray-500">Faculty & staff</div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderCalendar = () => {
    const handleEventClick = (event: CalendarEvent) => {
      console.log('Event clicked:', event);
      // Could open a modal or navigate to event details
    };

    const handleDateClick = (date: Date) => {
      console.log('Date clicked:', date);
      // Could highlight the date or show events for that date
    };

    const handleEventCreate = (date: Date) => {
      console.log('Create event for:', date);
      // Could open create event modal
      const newEvent = createSampleEvent(
        `New Meeting`,
        date,
        'meeting',
        'Principal meeting scheduled',
        '10:00 AM',
        '11:00 AM',
        'Principal Office'
      );
      console.log('Sample event created:', newEvent);
    };

    return (
      <div className="h-full">
        <CalendarComponent
          events={principalCalendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onEventCreate={handleEventCreate}
          canCreateEvents={true}
          viewMode="month"
          userRole="principal"
          className="calendar-principal"
        />
      </div>
    );
  };

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
      case 'faculty':
        return renderFaculty();
      case 'students':
        return renderStudents();
      case 'reports':
        return renderReports();
      case 'calendar':
        return renderCalendar();
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