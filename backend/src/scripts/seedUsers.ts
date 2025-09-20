import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';
import { logger } from '../utils/logger';

// Sample user data
const sampleUsers = [
  // Students
  {
    email: 'student1@jecrc.ac.in',
    password: 'student123',
    role: 'student',
    profile: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      phone: '+91-9876543210',
      address: 'Jaipur, Rajasthan',
      dateOfBirth: new Date('2002-05-15')
    },
    studentDetails: {
      rollNumber: 'JU20BCA001',
      course: 'Bachelor of Computer Applications',
      department: 'Computer Science',
      semester: 6,
      batch: '2020-2023',
      admissionYear: 2020,
      feeStatus: 'paid',
      totalFees: 180000,
      paidFees: 180000
    },
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light'
    },
    isActive: true
  },
  {
    email: 'student2@jecrc.ac.in',
    password: 'student123',
    role: 'student',
    profile: {
      firstName: 'Priya',
      lastName: 'Agarwal',
      phone: '+91-9876543211',
      address: 'Jodhpur, Rajasthan',
      dateOfBirth: new Date('2003-08-22')
    },
    studentDetails: {
      rollNumber: 'JU21BTech002',
      course: 'Bachelor of Technology',
      department: 'Information Technology',
      semester: 4,
      batch: '2021-2025',
      admissionYear: 2021,
      feeStatus: 'pending',
      totalFees: 250000,
      paidFees: 200000
    },
    preferences: {
      language: 'hi',
      notifications: true,
      theme: 'light'
    },
    isActive: true
  },
  {
    email: 'student3@jecrc.ac.in',
    password: 'student123',
    role: 'student',
    profile: {
      firstName: 'Rahul',
      lastName: 'Meena',
      phone: '+91-9876543212',
      address: 'Udaipur, Rajasthan',
      dateOfBirth: new Date('2001-12-10')
    },
    studentDetails: {
      rollNumber: 'JU20MBA003',
      course: 'Master of Business Administration',
      department: 'Management',
      semester: 4,
      batch: '2020-2022',
      admissionYear: 2020,
      feeStatus: 'overdue',
      totalFees: 300000,
      paidFees: 150000
    },
    preferences: {
      language: 'raj',
      notifications: false,
      theme: 'dark'
    },
    isActive: true
  },

  // Teachers
  {
    email: 'teacher1@jecrc.ac.in',
    password: 'teacher123',
    role: 'teacher',
    profile: {
      firstName: 'Dr. Sunita',
      lastName: 'Gupta',
      phone: '+91-9876543213',
      address: 'Jaipur, Rajasthan',
      dateOfBirth: new Date('1985-03-20')
    },
    teacherDetails: {
      employeeId: 'JECRC001',
      department: 'Computer Science',
      subjects: ['Data Structures', 'Algorithms', 'Database Management'],
      designation: 'Associate Professor',
      experience: 12
    },
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light'
    },
    isActive: true
  },
  {
    email: 'teacher2@jecrc.ac.in',
    password: 'teacher123',
    role: 'teacher',
    profile: {
      firstName: 'Prof. Rajesh',
      lastName: 'Kumar',
      phone: '+91-9876543214',
      address: 'Jaipur, Rajasthan',
      dateOfBirth: new Date('1980-07-08')
    },
    teacherDetails: {
      employeeId: 'JECRC002',
      department: 'Information Technology',
      subjects: ['Web Development', 'Software Engineering', 'Mobile App Development'],
      designation: 'Professor',
      experience: 18
    },
    preferences: {
      language: 'hi',
      notifications: true,
      theme: 'light'
    },
    isActive: true
  },
  {
    email: 'teacher3@jecrc.ac.in',
    password: 'teacher123',
    role: 'teacher',
    profile: {
      firstName: 'Dr. Kavita',
      lastName: 'Sharma',
      phone: '+91-9876543215',
      address: 'Jaipur, Rajasthan',
      dateOfBirth: new Date('1975-11-25')
    },
    teacherDetails: {
      employeeId: 'JECRC003',
      department: 'Management',
      subjects: ['Marketing Management', 'Human Resource Management', 'Financial Management'],
      designation: 'Head of Department',
      experience: 20
    },
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'dark'
    },
    isActive: true
  },

  // Principals
  {
    email: 'principal@jecrc.ac.in',
    password: 'principal123',
    role: 'principal',
    profile: {
      firstName: 'Dr. Anil',
      lastName: 'Joshi',
      phone: '+91-9876543216',
      address: 'Jaipur, Rajasthan',
      dateOfBirth: new Date('1965-04-12')
    },
    principalDetails: {
      employeeId: 'JECRC_PRIN_001',
      startDate: new Date('2018-01-01'),
      qualification: ['PhD in Computer Science', 'M.Tech in Information Technology', 'B.Tech in Computer Engineering']
    },
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light'
    },
    isActive: true
  },
  {
    email: 'viceprincipal@jecrc.ac.in',
    password: 'principal123',
    role: 'principal',
    profile: {
      firstName: 'Dr. Meera',
      lastName: 'Singh',
      phone: '+91-9876543217',
      address: 'Jaipur, Rajasthan',
      dateOfBirth: new Date('1970-09-18')
    },
    principalDetails: {
      employeeId: 'JECRC_VP_001',
      startDate: new Date('2019-07-01'),
      qualification: ['PhD in Management', 'MBA in Operations', 'B.Com']
    },
    preferences: {
      language: 'hi',
      notifications: true,
      theme: 'light'
    },
    isActive: true
  }
];

async function seedUsers() {
  try {
    console.log('🌱 Starting user seeding process...');
    
    // Connect to database
    await connectDatabase();
    console.log('✅ Connected to database');

    // Clear existing users (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    // Insert users
    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Successfully seeded ${insertedUsers.length} users`);

    // Log credentials for testing
    console.log('\n📝 Test Credentials:');
    console.log('='.repeat(50));
    
    console.log('\n👨‍🎓 STUDENTS:');
    sampleUsers.filter(u => u.role === 'student').forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password} | Name: ${user.profile.firstName} ${user.profile.lastName}`);
    });
    
    console.log('\n👩‍🏫 TEACHERS:');
    sampleUsers.filter(u => u.role === 'teacher').forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password} | Name: ${user.profile.firstName} ${user.profile.lastName}`);
    });
    
    console.log('\n👔 PRINCIPALS:');
    sampleUsers.filter(u => u.role === 'principal').forEach(user => {
      console.log(`Email: ${user.email} | Password: ${user.password} | Name: ${user.profile.firstName} ${user.profile.lastName}`);
    });

    console.log('\n🎉 User seeding completed successfully!');
    console.log('You can now login with any of the above credentials to test the frontend.');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    logger.error('User seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedUsers();
}

export { seedUsers };