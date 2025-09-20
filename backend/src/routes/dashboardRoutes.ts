import express from 'express';
import { Response } from 'express';
import { authService, AuthRequest } from '../services/authService';
import { User } from '../models/User';
import { Announcement } from '../models/Announcement';
import { Event, Schedule } from '../models/Event';
import { FeeStructure, FeePayment } from '../models/Fee';
import { Assignment, Attendance } from '../models/Academic';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @route GET /api/dashboard/student
 * @desc Get student dashboard data
 * @access Private (Student only)
 */
router.get('/student', 
  authService.authenticate, 
  authService.authorize(['student']), 
  async (req: AuthRequest, res: Response) => {
    try {
      const student = req.user!;
      const currentDate = new Date();

      // Get announcements for student
      const announcements = await Announcement.find({
        $or: [
          { targetAudience: 'all' },
          { targetAudience: 'student' },
          { 
            targetCourses: student.studentDetails?.course,
            targetSemesters: student.studentDetails?.semester
          }
        ],
        isActive: true,
        $and: [
          {
            $or: [
              { publishAt: { $lte: currentDate } },
              { publishAt: { $exists: false } }
            ]
          },
          {
            $or: [
              { expiresAt: { $gte: currentDate } },
              { expiresAt: { $exists: false } }
            ]
          }
        ]
      }).populate('author', 'profile.firstName profile.lastName')
        .sort({ priority: -1, createdAt: -1 })
        .limit(10);

      // Get upcoming events
      const upcomingEvents = await Event.find({
        startDate: { $gte: currentDate },
        status: 'upcoming'
      }).sort({ startDate: 1 }).limit(5);

      // Get class schedule for this week
      const startOfWeek = new Date();
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const weeklySchedule = await Schedule.find({
        course: student.studentDetails?.course,
        semester: student.studentDetails?.semester,
        status: 'scheduled',
        startTime: { $gte: startOfWeek, $lte: endOfWeek }
      }).populate('teacher', 'profile.firstName profile.lastName')
        .sort({ startTime: 1 });

      // Get fee information
      const feeStructure = await FeeStructure.findOne({
        course: student.studentDetails?.course,
        semester: student.studentDetails?.semester
      });

      const feePayments = await FeePayment.find({
        student: student._id
      }).sort({ createdAt: -1 }).limit(5);

      // Get pending assignments
      const pendingAssignments = await Assignment.find({
        assignedTo: student._id,
        dueDate: { $gte: currentDate },
        status: 'active',
        'submissions.student': { $ne: student._id }
      }).populate('teacher', 'profile.firstName profile.lastName')
        .sort({ dueDate: 1 })
        .limit(10);

      // Get recent attendance
      const recentAttendance = await Attendance.find({
        student: student._id
      }).populate('schedule', 'title subject classroom')
        .sort({ date: -1 })
        .limit(10);

      // Calculate attendance percentage
      const totalClasses = await Attendance.countDocuments({ student: student._id });
      const presentClasses = await Attendance.countDocuments({ 
        student: student._id, 
        status: { $in: ['present', 'late'] }
      });
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      const dashboardData = {
        student: {
          id: student._id,
          name: `${student.profile.firstName} ${student.profile.lastName}`,
          email: student.email,
          rollNumber: student.studentDetails?.rollNumber,
          course: student.studentDetails?.course,
          semester: student.studentDetails?.semester,
          batch: student.studentDetails?.batch,
          avatar: student.profile.avatar
        },
        stats: {
          attendancePercentage: Math.round(attendancePercentage),
          pendingAssignments: pendingAssignments.length,
          upcomingEvents: upcomingEvents.length,
          feeStatus: student.studentDetails?.feeStatus,
          totalFees: student.studentDetails?.totalFees,
          paidFees: student.studentDetails?.paidFees
        },
        announcements,
        upcomingEvents,
        weeklySchedule,
        pendingAssignments,
        recentAttendance,
        feeInfo: {
          structure: feeStructure,
          payments: feePayments,
          pendingAmount: (student.studentDetails?.totalFees || 0) - (student.studentDetails?.paidFees || 0)
        }
      };

      res.json({ success: true, data: dashboardData });

    } catch (error) {
      logger.error('Student dashboard error:', error);
      res.status(500).json({ error: 'Error fetching student dashboard data' });
    }
  }
);

/**
 * @route GET /api/dashboard/teacher
 * @desc Get teacher dashboard data
 * @access Private (Teacher only)
 */
router.get('/teacher', 
  authService.authenticate, 
  authService.authorize(['teacher']), 
  async (req: AuthRequest, res: Response) => {
    try {
      const teacher = req.user!;
      const currentDate = new Date();

      // Get teacher's classes today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayClasses = await Schedule.find({
        teacher: teacher._id,
        startTime: { $gte: todayStart, $lte: todayEnd },
        status: 'scheduled'
      }).sort({ startTime: 1 });

      // Get teacher's assignments
      const teacherAssignments = await Assignment.find({
        teacher: teacher._id,
        status: 'active'
      }).sort({ dueDate: 1 });

      // Get pending grading count
      const pendingGradingCount = await Assignment.aggregate([
        { $match: { teacher: teacher._id } },
        { $unwind: '$submissions' },
        { $match: { 'submissions.status': 'submitted' } },
        { $count: 'pendingGrading' }
      ]);

      // Get announcements
      const announcements = await Announcement.find({
        $or: [
          { targetAudience: 'all' },
          { targetAudience: 'teacher' },
          { author: teacher._id }
        ],
        isActive: true
      }).populate('author', 'profile.firstName profile.lastName')
        .sort({ createdAt: -1 })
        .limit(10);

      // Get student statistics for teacher's subjects
      const studentStats = await User.aggregate([
        {
          $match: {
            role: 'student',
            'studentDetails.course': { $in: teacher.teacherDetails?.subjects || [] }
          }
        },
        {
          $group: {
            _id: '$studentDetails.semester',
            count: { $sum: 1 }
          }
        }
      ]);

      const dashboardData = {
        teacher: {
          id: teacher._id,
          name: `${teacher.profile.firstName} ${teacher.profile.lastName}`,
          email: teacher.email,
          employeeId: teacher.teacherDetails?.employeeId,
          department: teacher.teacherDetails?.department,
          subjects: teacher.teacherDetails?.subjects,
          avatar: teacher.profile.avatar
        },
        stats: {
          todayClasses: todayClasses.length,
          activeAssignments: teacherAssignments.length,
          pendingGrading: pendingGradingCount[0]?.pendingGrading || 0,
          totalStudents: studentStats.reduce((sum, stat) => sum + stat.count, 0)
        },
        todayClasses,
        recentAssignments: teacherAssignments.slice(0, 5),
        announcements,
        studentStats
      };

      res.json({ success: true, data: dashboardData });

    } catch (error) {
      logger.error('Teacher dashboard error:', error);
      res.status(500).json({ error: 'Error fetching teacher dashboard data' });
    }
  }
);

/**
 * @route GET /api/dashboard/principal
 * @desc Get principal dashboard data
 * @access Private (Principal only)
 */
router.get('/principal', 
  authService.authenticate, 
  authService.authorize(['principal']), 
  async (req: AuthRequest, res: Response) => {
    try {
      const principal = req.user!;

      // Get overall statistics
      const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
      const totalTeachers = await User.countDocuments({ role: 'teacher', isActive: true });
      const totalAnnouncements = await Announcement.countDocuments({ isActive: true });
      const totalEvents = await Event.countDocuments({ status: 'upcoming' });

      // Get recent activities
      const recentUsers = await User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('profile.firstName profile.lastName role createdAt');

      const recentAnnouncements = await Announcement.find({ isActive: true })
        .populate('author', 'profile.firstName profile.lastName')
        .sort({ createdAt: -1 })
        .limit(10);

      // Get fee collection stats
      const feeStats = await FeePayment.aggregate([
        {
          $group: {
            _id: null,
            totalCollected: { $sum: '$paymentDetails.amount' },
            totalTransactions: { $sum: 1 }
          }
        }
      ]);

      // Get course-wise student distribution
      const courseDistribution = await User.aggregate([
        { $match: { role: 'student', isActive: true } },
        {
          $group: {
            _id: '$studentDetails.course',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get monthly registrations
      const monthlyRegistrations = await User.aggregate([
        {
          $match: {
            role: 'student',
            createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      const dashboardData = {
        principal: {
          id: principal._id,
          name: `${principal.profile.firstName} ${principal.profile.lastName}`,
          email: principal.email,
          employeeId: principal.principalDetails?.employeeId,
          avatar: principal.profile.avatar
        },
        stats: {
          totalStudents,
          totalTeachers,
          totalAnnouncements,
          totalEvents,
          totalFeeCollected: feeStats[0]?.totalCollected || 0,
          totalTransactions: feeStats[0]?.totalTransactions || 0
        },
        recentUsers,
        recentAnnouncements,
        courseDistribution,
        monthlyRegistrations,
        systemHealth: {
          dbStatus: 'connected',
          serverUptime: process.uptime(),
          memoryUsage: process.memoryUsage()
        }
      };

      res.json({ success: true, data: dashboardData });

    } catch (error) {
      logger.error('Principal dashboard error:', error);
      res.status(500).json({ error: 'Error fetching principal dashboard data' });
    }
  }
);

export default router;