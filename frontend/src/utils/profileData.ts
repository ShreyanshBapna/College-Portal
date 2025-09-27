import { ProfileData } from '../services/profileApi';

// Sample profile data for different user roles
export const studentProfileData: ProfileData = {
  id: 'STU-001',
  firstName: 'Priya',
  lastName: 'Sharma',
  email: 'priya.sharma@jecrc.ac.in',
  phone: '+91 98765 43210',
  address: '123 Gandhi Nagar, Jaipur, Rajasthan 302015, India',
  dateOfBirth: '2002-08-15',
  joinedDate: '2022-07-01',
  role: 'student',
  profileImage: '',
  bio: 'Computer Science student passionate about web development and AI. Love coding and solving complex problems.',
  languages: ['English', 'Hindi', 'Rajasthani'],
  studentId: 'JE2022001',
  department: 'Computer Science and Engineering',
  course: 'B.Tech CSE',
  semester: 6,
  achievements: [
    'Dean\'s List 2023',
    'Best Student Project Award - Web Development',
    'Hackathon Winner - TechFest 2023',
    'Academic Excellence Award',
    'Code Sprint Champion'
  ],
  skills: [
    'Java',
    'React.js',
    'Python',
    'Machine Learning',
    'Data Structures',
    'Algorithms',
    'Web Development',
    'Database Design'
  ],
  emergencyContact: {
    name: 'Rajesh Sharma',
    relation: 'Father',
    phone: '+91 98765 12345'
  }
};

export const teacherProfileData: ProfileData = {
  id: 'TEA-001',
  firstName: 'Dr. Amit',
  lastName: 'Patel',
  email: 'amit.patel@jecrc.ac.in',
  phone: '+91 98765 67890',
  address: '456 University Colony, Jaipur, Rajasthan 302017, India',
  dateOfBirth: '1985-03-22',
  joinedDate: '2019-08-15',
  role: 'teacher',
  profileImage: '',
  bio: 'Associate Professor with expertise in Machine Learning and Data Science. Research interests include AI, deep learning, and their applications in real-world problems.',
  languages: ['English', 'Hindi', 'Gujarati'],
  employeeId: 'JE-T-2019-045',
  department: 'Computer Science and Engineering',
  subjects: [
    'Data Structures and Algorithms',
    'Machine Learning',
    'Database Management Systems',
    'Artificial Intelligence',
    'Software Engineering'
  ],
  specialization: 'Machine Learning and Artificial Intelligence',
  qualification: [
    'Ph.D. in Computer Science - IIT Delhi (2018)',
    'M.Tech Computer Science - NIT Jaipur (2012)',
    'B.Tech Computer Engineering - Rajasthan University (2010)'
  ],
  experience: 8,
  achievements: [
    'Best Teacher Award 2023',
    'Research Excellence Award 2022',
    'IEEE Member',
    'Published 25+ research papers in international journals',
    'Guided 50+ student projects',
    'Outstanding Faculty Award'
  ],
  skills: [
    'Machine Learning',
    'Deep Learning',
    'Python',
    'R Programming',
    'Data Science',
    'Research Methodology',
    'Academic Writing',
    'Statistical Analysis'
  ]
};

export const principalProfileData: ProfileData = {
  id: 'PRI-001',
  firstName: 'Dr. Sunita',
  lastName: 'Agarwal',
  email: 'sunita.agarwal@jecrc.ac.in',
  phone: '+91 98765 11111',
  address: '789 Education Hub, Jaipur, Rajasthan 302020, India',
  dateOfBirth: '1975-11-10',
  joinedDate: '2015-06-01',
  role: 'principal',
  profileImage: '',
  bio: 'Visionary educational leader with over 15 years of experience in academic administration and strategic planning. Committed to fostering innovation and excellence in higher education.',
  languages: ['English', 'Hindi', 'Sanskrit'],
  employeeId: 'JE-P-2015-001',
  department: 'Administration',
  specialization: 'Educational Leadership and Management',
  qualification: [
    'Ph.D. in Educational Management - Rajasthan University (2008)',
    'M.B.A. in Human Resource Management - IGNOU (2005)',
    'M.Tech Computer Science - RTU (2000)',
    'B.Tech Electronics - Rajasthan University (1998)'
  ],
  experience: 20,
  achievements: [
    'Excellence in Educational Leadership Award 2023',
    'Educational Innovation Award 2022',
    'Women in Leadership Recognition',
    'NAAC A+ Grade Achievement for Institution',
    'Best Principal Award - Rajasthan Education Board',
    'Digital Transformation Leader'
  ],
  skills: [
    'Educational Leadership',
    'Strategic Planning',
    'Institution Management',
    'Policy Development',
    'Stakeholder Management',
    'Digital Transformation',
    'Quality Assurance',
    'Team Building'
  ]
};

// Utility functions for profile management
export const getProfileByRole = (role: 'student' | 'teacher' | 'principal'): ProfileData => {
  switch (role) {
    case 'student':
      return studentProfileData;
    case 'teacher':
      return teacherProfileData;
    case 'principal':
      return principalProfileData;
    default:
      return studentProfileData;
  }
};

export const updateProfile = async (profileData: ProfileData): Promise<ProfileData> => {
  // In a real application, this would make an API call to update the profile
  console.log('Updating profile:', profileData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return updated profile data
  return {
    ...profileData,
    // Add updated timestamp or any server-side modifications
  };
};

export const validateProfileData = (profileData: Partial<ProfileData>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!profileData.firstName || profileData.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }
  
  if (!profileData.lastName || profileData.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }
  
  if (!profileData.email || !profileData.email.includes('@')) {
    errors.push('Please enter a valid email address');
  }
  
  if (!profileData.phone || profileData.phone.length < 10) {
    errors.push('Please enter a valid phone number');
  }
  
  if (!profileData.dateOfBirth) {
    errors.push('Date of birth is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Function to format profile data for display
export const formatProfileData = (profileData: ProfileData) => {
  return {
    ...profileData,
    fullName: `${profileData.firstName} ${profileData.lastName}`,
    age: new Date().getFullYear() - new Date(profileData.dateOfBirth).getFullYear(),
    yearsOfService: profileData.role !== 'student' 
      ? new Date().getFullYear() - new Date(profileData.joinedDate).getFullYear()
      : undefined,
    displayRole: profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)
  };
};

// Function to get profile statistics
export const getProfileStats = (profileData: ProfileData) => {
  const stats = [];
  
  if (profileData.achievements) {
    stats.push({
      label: 'Achievements',
      value: profileData.achievements.length,
      icon: '🏆'
    });
  }
  
  if (profileData.skills) {
    stats.push({
      label: 'Skills',
      value: profileData.skills.length,
      icon: '💡'
    });
  }
  
  if (profileData.languages) {
    stats.push({
      label: 'Languages',
      value: profileData.languages.length,
      icon: '🌐'
    });
  }
  
  if (profileData.subjects) {
    stats.push({
      label: 'Subjects',
      value: profileData.subjects.length,
      icon: '📚'
    });
  }
  
  if (profileData.qualification) {
    stats.push({
      label: 'Qualifications',
      value: profileData.qualification.length,
      icon: '🎓'
    });
  }
  
  if (profileData.experience) {
    stats.push({
      label: 'Experience',
      value: `${profileData.experience} years`,
      icon: '⏰'
    });
  }
  
  return stats;
};