import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from './Card';

const QuickAuthTest: React.FC = () => {
  const { login } = useAuth();

  const mockLogin = (role: 'student' | 'teacher' | 'principal') => {
    // Create mock authentication
    const mockUser = {
      _id: `mock-${role}-id`,
      email: `${role}@test.com`,
      role,
      profile: {
        firstName: role === 'student' ? 'Dr. Sunita' : role === 'teacher' ? 'Dr. Sunita' : 'Dr. Sunita',
        lastName: 'Agarwal',
        avatar: undefined,
        phone: '+91 98765 43210',
        address: 'JECRC Foundation, Jaipur',
        dateOfBirth: new Date('1990-01-01')
      },
      studentDetails: role === 'student' ? {
        rollNumber: '2023BTech001',
        course: 'B.Tech Computer Science',
        department: 'Computer Science',
        semester: 6,
        batch: '2021-2025',
        admissionYear: 2021,
        feeStatus: 'paid' as const,
        totalFees: 150000,
        paidFees: 120000
      } : undefined,
      teacherDetails: role === 'teacher' ? {
        employeeId: 'EMP001',
        department: 'Computer Science',
        subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
        designation: 'Assistant Professor',
        experience: 5
      } : undefined,
      principalDetails: role === 'principal' ? {
        employeeId: 'PRIN001',
        startDate: new Date('2020-01-01'),
        qualification: ['Ph.D. Computer Science', 'M.Tech CSE']
      } : undefined,
      preferences: {
        language: 'english',
        notifications: true,
        theme: 'light'
      },
      isActive: true,
      lastLogin: new Date()
    };

    const mockToken = `mock-token-${role}-${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Reload the page to trigger auth context update
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quick Auth Test</h1>
            <p className="text-gray-600 mt-2">Choose a role to test the dashboard</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => mockLogin('student')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login as Student
            </button>
            
            <button
              onClick={() => mockLogin('teacher')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Login as Teacher
            </button>
            
            <button
              onClick={() => mockLogin('principal')}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Login as Principal
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            This is a test interface to quickly access different dashboard views
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickAuthTest;