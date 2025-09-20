import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

const seedUsers = async () => {
  try {
    await connectDatabase();
    
    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Hash password function
    const hashPassword = async (password: string) => {
      const salt = await bcrypt.genSalt(12);
      return bcrypt.hash(password, salt);
    };

    // Sample Students
    const students = [
      {
        email: 'student1@jecrc.ac.in',
        password: await hashPassword('password123'),
        role: 'student',
        profile: {
          firstName: 'Rajesh',
          lastName: 'Kumar',
          phone: '+91-9876543210',
          address: 'Jaipur, Rajasthan',
          dateOfBirth: new Date('2002-03-15')
        },
        studentDetails: {
          rollNumber: 'CS2021001',
          course: 'Computer Science',
          department: 'Computer Science & Engineering',
          semester: 6,
          batch: '2021-2025',
          admissionYear: 2021,
          feeStatus: 'paid',
          totalFees: 120000,
          paidFees: 120000
        },
        preferences: {
          language: 'en',
          notifications: true,
          theme: 'light'
        },
        isActive: true,
        lastLogin: new Date()
      },
      {
        email: 'student2@jecrc.ac.in',
        password: await hashPassword('password123'),
        role: 'student',
        profile: {
          firstName: 'Priya',
          lastName: 'Sharma',
          phone: '+91-9876543211',
          address: 'Jodhpur, Rajasthan',
          dateOfBirth: new Date('2003-07-22')
        },
        studentDetails: {
          rollNumber: 'EC2022015',
          course: 'Electronics & Communication',
          department: 'Electronics & Communication Engineering',
          semester: 4,
          batch: '2022-2026',
          admissionYear: 2022,
          feeStatus: 'pending',
          totalFees: 115000,
          paidFees: 85000
        },
        preferences: {
          language: 'hi',
          notifications: true,
          theme: 'light'
        },
        isActive: true,
        lastLogin: new Date()
      },
      {
        email: 'student3@jecrc.ac.in',
        password: await hashPassword('password123'),
        role: 'student',
        profile: {
          firstName: 'Amit',
          lastName: 'Gupta',
          phone: '+91-9876543212',
          address: 'Udaipur, Rajasthan',
          dateOfBirth: new Date('2001-11-08')
        },
        studentDetails: {
          rollNumber: 'ME2020025',
          course: 'Mechanical Engineering',
          department: 'Mechanical Engineering',
          semester: 8,
          batch: '2020-2024',
          admissionYear: 2020,
          feeStatus: 'overdue',
          totalFees: 110000,
          paidFees: 75000
        },
        preferences: {
          language: 'en',
          notifications: false,
          theme: 'dark'
        },
        isActive: true,
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    // Sample Teachers
    const teachers = [
      {
        email: 'teacher1@jecrc.ac.in',
        password: await hashPassword('teacher123'),
        role: 'teacher',
        profile: {
          firstName: 'Dr. Sunita',
          lastName: 'Agarwal',
          phone: '+91-9876543213',
          address: 'Faculty Housing, JECRC University',
          dateOfBirth: new Date('1985-05-12')
        },
        teacherDetails: {
          employeeId: 'JECRC-CSE-001',
          department: 'Computer Science & Engineering',
          subjects: ['Data Structures', 'Algorithms', 'Database Management'],
          designation: 'Associate Professor',
          experience: 8
        },
        preferences: {
          language: 'en',
          notifications: true,
          theme: 'light'
        },
        isActive: true,
        lastLogin: new Date()
      },
      {
        email: 'teacher2@jecrc.ac.in',
        password: await hashPassword('teacher123'),
        role: 'teacher',
        profile: {
          firstName: 'Prof. Vikram',
          lastName: 'Singh',
          phone: '+91-9876543214',
          address: 'Malviya Nagar, Jaipur',
          dateOfBirth: new Date('1978-09-25')
        },
        teacherDetails: {
          employeeId: 'JECRC-ECE-002',
          department: 'Electronics & Communication Engineering',
          subjects: ['Digital Electronics', 'Communication Systems', 'Signal Processing'],
          designation: 'Professor',
          experience: 15
        },
        preferences: {
          language: 'hi',
          notifications: true,
          theme: 'light'
        },
        isActive: true,
        lastLogin: new Date()
      },
      {
        email: 'teacher3@jecrc.ac.in',
        password: await hashPassword('teacher123'),
        role: 'teacher',
        profile: {
          firstName: 'Dr. Meera',
          lastName: 'Joshi',
          phone: '+91-9876543215',
          address: 'C-Scheme, Jaipur',
          dateOfBirth: new Date('1982-01-18')
        },
        teacherDetails: {
          employeeId: 'JECRC-ME-003',
          department: 'Mechanical Engineering',
          subjects: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer'],
          designation: 'Assistant Professor',
          experience: 6
        },
        preferences: {
          language: 'en',
          notifications: true,
          theme: 'dark'
        },
        isActive: true,
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    // Sample Principals
    const principals = [
      {
        email: 'principal@jecrc.ac.in',
        password: await hashPassword('principal123'),
        role: 'principal',
        profile: {
          firstName: 'Dr. Arjun',
          lastName: 'Malhotra',
          phone: '+91-9876543216',
          address: 'Principal Residence, JECRC University',
          dateOfBirth: new Date('1970-12-03')
        },
        principalDetails: {
          employeeId: 'JECRC-PRIN-001',
          startDate: new Date('2020-07-01'),
          qualification: ['Ph.D. in Computer Science', 'M.Tech in Software Engineering', 'B.Tech in Computer Science']
        },
        preferences: {
          language: 'en',
          notifications: true,
          theme: 'light'
        },
        isActive: true,
        lastLogin: new Date()
      },
      {
        email: 'vp@jecrc.ac.in',
        password: await hashPassword('principal123'),
        role: 'principal',
        profile: {
          firstName: 'Dr. Kavita',
          lastName: 'Verma',
          phone: '+91-9876543217',
          address: 'Administrative Block, JECRC University',
          dateOfBirth: new Date('1975-04-20')
        },
        principalDetails: {
          employeeId: 'JECRC-VP-001',
          startDate: new Date('2019-01-15'),
          qualification: ['Ph.D. in Electronics Engineering', 'M.Tech in VLSI Design', 'B.Tech in Electronics']
        },
        preferences: {
          language: 'hi',
          notifications: true,
          theme: 'light'
        },
        isActive: true,
        lastLogin: new Date()
      }
    ];

    // Insert all users
    const allUsers = [...students, ...teachers, ...principals];
    
    for (const userData of allUsers) {
      const user = new User(userData);
      await user.save();
      logger.info(`Created ${userData.role}: ${userData.email}`);
    }

    logger.info('\n=== SEEDING COMPLETE ===');
    logger.info(`✅ Created ${students.length} students`);
    logger.info(`✅ Created ${teachers.length} teachers`);
    logger.info(`✅ Created ${principals.length} principals`);
    logger.info(`✅ Total users: ${allUsers.length}`);
    
    logger.info('\n=== LOGIN CREDENTIALS ===');
    logger.info('🎓 STUDENTS:');
    students.forEach(student => {
      logger.info(`   Email: ${student.email} | Password: password123`);
    });
    
    logger.info('\n👨‍🏫 TEACHERS:');
    teachers.forEach(teacher => {
      logger.info(`   Email: ${teacher.email} | Password: teacher123`);
    });
    
    logger.info('\n🎯 PRINCIPALS:');
    principals.forEach(principal => {
      logger.info(`   Email: ${principal.email} | Password: principal123`);
    });

  } catch (error) {
    logger.error('Error seeding users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('\n📱 Ready to test frontend at http://localhost:3000');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedUsers();
}

export default seedUsers;