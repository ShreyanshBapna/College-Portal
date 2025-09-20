import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Send, 
  Users, 
  GraduationCap, 
  UserCheck,
  Building,
  Globe,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface AnnouncementData {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetRoles: string[];
  department?: string;
  type: 'general' | 'academic' | 'event' | 'emergency';
}

const AnnouncementBroadcast: React.FC = () => {
  const { broadcastAnnouncement } = useSocket();
  const [announcement, setAnnouncement] = useState<AnnouncementData>({
    title: '',
    message: '',
    priority: 'medium',
    targetRoles: [],
    department: '',
    type: 'general'
  });
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const departments = [
    'Computer Science', 'Information Technology', 'Electronics', 
    'Mechanical', 'Civil', 'Chemical', 'Electrical'
  ];

  const roleOptions = [
    { id: 'all', label: 'Everyone', icon: Globe },
    { id: 'student', label: 'Students', icon: GraduationCap },
    { id: 'teacher', label: 'Teachers', icon: UserCheck },
    { id: 'principal', label: 'Principals', icon: Users }
  ];

  const priorityOptions = [
    { id: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-700', icon: Info },
    { id: 'medium', label: 'Medium Priority', color: 'bg-blue-100 text-blue-700', icon: Info },
    { id: 'high', label: 'High Priority', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700', icon: AlertCircle }
  ];

  const typeOptions = [
    { id: 'general', label: 'General' },
    { id: 'academic', label: 'Academic' },
    { id: 'event', label: 'Event' },
    { id: 'emergency', label: 'Emergency' }
  ];

  const handleRoleToggle = (roleId: string) => {
    if (roleId === 'all') {
      setAnnouncement(prev => ({
        ...prev,
        targetRoles: prev.targetRoles.includes('all') ? [] : ['all']
      }));
    } else {
      setAnnouncement(prev => ({
        ...prev,
        targetRoles: prev.targetRoles.includes('all') 
          ? [roleId]
          : prev.targetRoles.includes(roleId)
            ? prev.targetRoles.filter(r => r !== roleId)
            : [...prev.targetRoles.filter(r => r !== 'all'), roleId]
      }));
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.title.trim() || !announcement.message.trim() || announcement.targetRoles.length === 0) {
      return;
    }

    setIsSending(true);

    try {
      // Send via Socket.IO
      broadcastAnnouncement(
        {
          title: announcement.title,
          content: announcement.message,
          priority: announcement.priority,
          type: announcement.type,
          timestamp: new Date().toISOString()
        },
        announcement.targetRoles,
        announcement.department || undefined
      );

      // Reset form
      setAnnouncement({
        title: '',
        message: '',
        priority: 'medium',
        targetRoles: [],
        department: '',
        type: 'general'
      });

      // Show success (you could add a toast notification here)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Failed to send announcement:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityConfig = (priority: string) => {
    return priorityOptions.find(p => p.id === priority) || priorityOptions[1];
  };

  const getTargetAudience = () => {
    if (announcement.targetRoles.includes('all')) return 'Everyone';
    if (announcement.targetRoles.length === 0) return 'No audience selected';
    
    const roles = announcement.targetRoles.map(role => 
      roleOptions.find(r => r.id === role)?.label
    ).filter(Boolean);
    
    let audience = roles.join(', ');
    if (announcement.department) {
      audience += ` (${announcement.department} Department)`;
    }
    
    return audience;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Broadcast Announcement
          </h1>
          <p className="text-gray-600 mt-1">Send real-time announcements to students and staff</p>
        </div>
        
        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcement Form */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Title *
            </label>
            <input
              type="text"
              value={announcement.title}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content *
            </label>
            <textarea
              value={announcement.message}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter your announcement message..."
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={announcement.type}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {typeOptions.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={announcement.priority}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorityOptions.map(priority => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Audience *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map(role => {
                const Icon = role.icon;
                const isSelected = announcement.targetRoles.includes(role.id);
                
                return (
                  <motion.button
                    key={role.id}
                    onClick={() => handleRoleToggle(role.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{role.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Department Filter */}
          {!announcement.targetRoles.includes('all') && announcement.targetRoles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department (Optional)
              </label>
              <select
                value={announcement.department}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, department: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Send Button */}
          <motion.button
            onClick={handleSendAnnouncement}
            disabled={!announcement.title.trim() || !announcement.message.trim() || announcement.targetRoles.length === 0 || isSending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Broadcasting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Send Announcement
              </div>
            )}
          </motion.button>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Preview
            </h3>
            
            <div className="space-y-4">
              {/* Priority Badge */}
              {announcement.priority && (
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityConfig(announcement.priority).color}`}>
                    {getPriorityConfig(announcement.priority).label}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{announcement.type}</span>
                </div>
              )}

              {/* Title */}
              <h4 className="text-xl font-bold text-gray-800">
                {announcement.title || 'Announcement Title'}
              </h4>

              {/* Message */}
              <p className="text-gray-600 whitespace-pre-wrap">
                {announcement.message || 'Your announcement message will appear here...'}
              </p>

              {/* Audience */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>Audience: {getTargetAudience()}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-400">
                {new Date().toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBroadcast;