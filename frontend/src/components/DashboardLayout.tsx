import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  MessageCircle,
  Home,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  CreditCard,
  FileText,
  GraduationCap
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getNavigationItems = () => {
    const commonItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
    ];

    const roleSpecificItems = {
      student: [
        { id: 'courses', label: 'My Courses', icon: BookOpen },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'grades', label: 'Grades', icon: BarChart3 },
        { id: 'fees', label: 'Fees', icon: CreditCard },
        { id: 'attendance', label: 'Attendance', icon: Users },
      ],
      teacher: [
        { id: 'classes', label: 'My Classes', icon: Users },
        { id: 'students', label: 'Students', icon: GraduationCap },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'grades', label: 'Grading', icon: BarChart3 },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
      ],
      principal: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'faculty', label: 'Faculty', icon: Users },
        { id: 'students', label: 'Students', icon: GraduationCap },
        { id: 'announcements', label: 'Announcements', icon: Bell },
        { id: 'reports', label: 'Reports', icon: FileText },
      ]
    };

    return [...commonItems, ...(roleSpecificItems[user?.role || 'student'] || [])];
  };

  const navigationItems = getNavigationItems();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">JECRC</h2>
                <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <motion.button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.profile?.firstName || 'User'}!
                  </h1>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Real-time Notifications */}
                <NotificationBell />

                {/* Profile dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-gray-900">{user?.profile?.firstName} {user?.profile?.lastName}</p>
                      <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </motion.button>

                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <button
                        onClick={() => {
                          onSectionChange('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          onSectionChange('settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;