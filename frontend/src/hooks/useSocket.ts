import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface SocketNotification {
  id: string;
  type: 'announcement' | 'assignment' | 'attendance' | 'grade' | 'payment' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  notifications: SocketNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  joinDashboard: () => void;
  markAttendance: (studentId: string, courseId: string, status: 'present' | 'absent') => void;
  broadcastAnnouncement: (announcement: any, targetRoles: string[], department?: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<SocketNotification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      timeout: 30000,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
      forceNew: false,
      autoConnect: true,
      upgrade: true,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('🔌 Connected to server');
      setIsConnected(true);
      
      // Auto-join dashboard room
      socket.emit('join_dashboard', {
        userId: user._id,
        role: user.role,
        department: user.studentDetails?.department || user.teacherDetails?.department || 'general'
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
      
      // Attempt immediate reconnection for certain disconnect reasons
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('🔥 Connection error:', error);
      setIsConnected(false);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    socket.on('reconnect_failed', () => {
      console.error('💥 Failed to reconnect to server');
      setIsConnected(false);
    });

    socket.on('dashboard_joined', (data) => {
      console.log('🎓 Dashboard joined:', data);
    });

    // Real-time notification handlers
    socket.on('announcement', (data) => {
      addNotification({
        type: 'announcement',
        title: data.title || 'New Announcement',
        message: data.message || data.content,
        data
      });
    });

    socket.on('assignment_notification', (data) => {
      addNotification({
        type: 'assignment',
        title: 'New Assignment',
        message: `${data.title} - Due: ${new Date(data.dueDate).toLocaleDateString()}`,
        data
      });
    });

    socket.on('attendance_updated', (data) => {
      addNotification({
        type: 'attendance',
        title: 'Attendance Updated',
        message: data.message,
        data
      });
    });

    socket.on('grade_notification', (data) => {
      addNotification({
        type: 'grade',
        title: 'Grade Updated',
        message: data.message,
        data
      });
    });

    socket.on('payment_notification', (data) => {
      addNotification({
        type: 'payment',
        title: 'Payment Update',
        message: data.message,
        data
      });
    });

    // Teacher-specific events
    if (user.role === 'teacher') {
      socket.on('attendance_recorded', (data) => {
        console.log('📋 Attendance recorded:', data);
      });
    }

    // Admin/Principal-specific events
    if (user.role === 'principal') {
      socket.on('payment_update', (data) => {
        addNotification({
          type: 'payment',
          title: 'Payment Update',
          message: `Payment ${data.status} for student ${data.studentId}`,
          data
        });
      });
    }

    // Live class events
    socket.on('user_joined_class', (data) => {
      console.log('🎥 User joined class:', data);
    });

    socket.on('user_left_class', (data) => {
      console.log('🎥 User left class:', data);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const addNotification = (notificationData: Omit<SocketNotification, 'id' | 'timestamp' | 'read'>) => {
    const notification: SocketNotification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep only latest 50

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const joinDashboard = () => {
    if (socketRef.current && user) {
      socketRef.current.emit('join_dashboard', {
        userId: user._id,
        role: user.role,
        department: user.studentDetails?.department || user.teacherDetails?.department
      });
    }
  };

  const markAttendance = (studentId: string, courseId: string, status: 'present' | 'absent') => {
    if (socketRef.current && user) {
      socketRef.current.emit('mark_attendance', {
        studentId,
        courseId,
        status,
        teacherId: user._id
      });
    }
  };

  const broadcastAnnouncement = (announcement: any, targetRoles: string[], department?: string) => {
    if (socketRef.current) {
      socketRef.current.emit('broadcast_announcement', {
        announcement,
        targetRoles,
        department
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    joinDashboard,
    markAttendance,
    broadcastAnnouncement
  };
};

export default useSocket;