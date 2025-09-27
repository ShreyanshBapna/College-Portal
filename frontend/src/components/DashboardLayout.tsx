import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
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
  GraduationCap,
  ChevronDown
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
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  // Ensure sidebar is always visible on desktop (lg and up)
  useEffect(() => {
    const checkDesktop = () => {
      // Tailwind lg starts at 1024px
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getNavigationItems = () => {
    const commonItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'chat', label: 'Saarthi', icon: MessageCircle },
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

    // Removed profile from navigation - no longer needed in nav
    // const profileItem = [
    //   { id: 'profile', label: 'My Profile', icon: User }
    // ];

    return [...commonItems, ...(roleSpecificItems[user?.role || 'student'] || [])];
  };

  const navigationItems = getNavigationItems();

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full overflow-x-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-indigo-100/20 to-purple-100/20"></div>
      </div>
      {/* Mobile sidebar overlay */}
      {!isDesktop && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          variants={sidebarVariants}
          // On desktop, keep it open and skip slide animation effects
          animate={isDesktop ? 'open' : (sidebarOpen ? 'open' : 'closed')}
          className={`${
            isDesktop 
              ? 'relative w-64 flex-shrink-0' 
              : 'fixed left-0 top-0 w-64 z-50'
          } h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-indigo-500/10 flex flex-col`}
        >
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">JECRC</h2>
                  <p className="text-sm text-gray-600 capitalize font-medium">{user?.role} Portal</p>
                </div>
              </div>
              {!isDesktop && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                >
                  <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl shadow-indigo-500/30 ring-1 ring-white/20 transform scale-105'
                      : 'text-gray-700 hover:bg-white/80 hover:text-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-102'
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'
                  }`} />
                  <span className="font-semibold truncate">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-4 w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/20">
            <motion.button
              onClick={logout}
              className="group w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:bg-red-50/90 hover:text-red-700 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:scale-102"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-900/5 border-b border-white/20 flex-shrink-0 relative z-10">
            <div className="px-4 sm:px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0">
                  {!isDesktop && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2.5 hover:bg-white/80 rounded-xl flex-shrink-0 transition-all duration-200 group hover:shadow-md hover:shadow-indigo-500/10"
                    >
                      <Menu className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  )}
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent capitalize truncate">
                      {activeSection === 'chat' ? 'Saarthi - JECRC Chatbot' : activeSection}
                    </h1>
                  </div>
                </div>

                <div className="relative">
                  <motion.button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-2.5 hover:bg-white/80 rounded-2xl transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-white/20">
                      <span className="text-white text-sm font-bold">
                        {user?.profile?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.profile?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 capitalize font-medium">
                        {user?.role || 'student'}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-all duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-900/10 border border-white/30 py-2 z-20"
                    >
                      <motion.button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          // Navigate to profile route
                          window.location.href = '/profile';
                        }}
                        className="group w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-white/80 hover:text-indigo-600 transition-all duration-200 text-left rounded-xl mx-2 hover:shadow-md hover:shadow-indigo-500/10"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <User className="w-5 h-5 flex-shrink-0 group-hover:text-indigo-600 transition-colors" />
                        <span className="font-semibold">Profile</span>
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onSectionChange('settings');
                        }}
                        className="group w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-white/80 hover:text-indigo-600 transition-all duration-200 text-left rounded-xl mx-2 hover:shadow-md hover:shadow-indigo-500/10"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Settings className="w-5 h-5 flex-shrink-0 group-hover:text-indigo-600 transition-colors" />
                        <span className="font-semibold">Settings</span>
                      </motion.button>
                      <div className="border-t border-white/20 my-2 mx-4"></div>
                      <motion.button
                        onClick={logout}
                        className="group w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 text-left rounded-xl mx-2"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-semibold">Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto min-h-0 w-full max-w-full overflow-x-hidden">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full min-h-full w-full max-w-full overflow-x-hidden"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;