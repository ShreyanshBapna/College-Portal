import express from 'express';
import { authService, AuthRequest } from '../services/authService';
import { User } from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get user profile
router.get('/', authService.authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!._id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Transform user data to match ProfileData interface
  const profileData = {
    id: user._id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email,
    phone: user.profile.phone || '',
    address: user.profile.address || '',
    dateOfBirth: user.profile.dateOfBirth || '',
    joinedDate: user.createdAt,
    role: user.role,
    profileImage: user.profile.avatar || '',
    
    // Role-specific fields from student/teacher/principal details
    studentId: user.studentDetails?.rollNumber,
    employeeId: user.teacherDetails?.employeeId || user.principalDetails?.employeeId,
    department: user.teacherDetails?.department,
    course: user.studentDetails?.course,
    semester: user.studentDetails?.semester,
    subjects: user.teacherDetails?.subjects || [],
    specialization: '',
    qualification: user.teacherDetails?.qualification ? [user.teacherDetails.qualification] : [],
    experience: user.teacherDetails?.experience,
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    
    // Additional info (defaults for now)
    bio: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} at JECRC Foundation`,
    achievements: [],
    skills: [],
    languages: ['English', 'Hindi']
  };

  res.json(profileData);
}));

// Update user profile
router.put('/', authService.authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const {
    firstName, lastName, phone, address, dateOfBirth, profileImage
  } = req.body;

  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update basic profile fields
  if (firstName) user.profile.firstName = firstName;
  if (lastName) user.profile.lastName = lastName;
  if (phone) user.profile.phone = phone;
  if (address) user.profile.address = address;
  if (dateOfBirth) user.profile.dateOfBirth = new Date(dateOfBirth);
  if (profileImage) user.profile.avatar = profileImage;

  await user.save();

  // Return updated profile data
  const profileData = {
    id: user._id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email,
    phone: user.profile.phone || '',
    address: user.profile.address || '',
    dateOfBirth: user.profile.dateOfBirth || '',
    joinedDate: user.createdAt,
    role: user.role,
    profileImage: user.profile.avatar || '',
    studentId: user.studentDetails?.rollNumber,
    employeeId: user.teacherDetails?.employeeId || user.principalDetails?.employeeId,
    department: user.teacherDetails?.department,
    course: user.studentDetails?.course,
    semester: user.studentDetails?.semester,
    subjects: user.teacherDetails?.subjects || [],
    specialization: '',
    qualification: user.teacherDetails?.qualification ? [user.teacherDetails.qualification] : [],
    experience: user.teacherDetails?.experience,
    emergencyContact: { name: '', relation: '', phone: '' },
    bio: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} at JECRC Foundation`,
    achievements: [],
    skills: [],
    languages: ['English', 'Hindi']
  };

  res.json(profileData);
}));

// Change password
router.put('/password', authService.authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters long', 400);
  }

  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password using bcrypt comparison
  const bcrypt = require('bcryptjs');
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash and update new password
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ message: 'Password updated successfully' });
}));

export default router;