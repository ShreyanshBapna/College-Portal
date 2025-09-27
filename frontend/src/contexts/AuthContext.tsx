import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  _id: string;
  email: string;
  role: 'student' | 'teacher' | 'principal';
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
  };
  studentDetails?: {
    rollNumber: string;
    course?: string;
    department?: string;
    semester?: number;
    batch?: string;
    admissionYear?: number;
    feeStatus?: 'paid' | 'pending' | 'overdue';
    totalFees?: number;
    paidFees?: number;
  };
  teacherDetails?: {
    employeeId: string;
    department: string;
    subjects?: string[];
    designation?: string;
    experience?: number;
  };
  principalDetails?: {
    employeeId: string;
    startDate?: Date;
    qualification?: string[];
  };
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
  isActive?: boolean;
  lastLogin?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'principal';
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  studentDetails?: {
    rollNumber: string;
    class: string;
    section: string;
    department: string;
    semester: number;
    admissionYear: number;
  };
  teacherDetails?: {
    employeeId: string;
    department: string;
    designation: string;
    subjects: string[];
    experience: number;
  };
  principalDetails?: {
    employeeId: string;
    qualification: string[];
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email?.trim(), password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Login failed (${response.status})`);
      }

      const data = await response.json();
      
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during login');
      }
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Transform the data to match backend schema exactly
      const { firstName, lastName, phoneNumber, dateOfBirth, address, ...rest } = userData;
      
      const transformedData = {
        ...rest,
        profile: {
          firstName: firstName?.trim() || '',
          lastName: lastName?.trim() || '',
          phone: phoneNumber?.trim() || '',
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
          address: address && (address.street || address.city || address.state || address.pincode) 
            ? `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.pincode || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
            : undefined
        },
        // Ensure role-specific details are properly formatted
        ...(rest.studentDetails && {
          studentDetails: {
            ...rest.studentDetails,
            rollNumber: rest.studentDetails.rollNumber?.trim() || '',
            class: rest.studentDetails.class?.trim() || '',
            section: rest.studentDetails.section?.trim() || '',
            department: rest.studentDetails.department?.trim() || '',
            semester: Number(rest.studentDetails.semester) || 1,
            admissionYear: Number(rest.studentDetails.admissionYear) || new Date().getFullYear()
          }
        }),
        ...(rest.teacherDetails && {
          teacherDetails: {
            ...rest.teacherDetails,
            employeeId: rest.teacherDetails.employeeId?.trim() || '',
            department: rest.teacherDetails.department?.trim() || '',
            designation: rest.teacherDetails.designation?.trim() || '',
            subjects: Array.isArray(rest.teacherDetails.subjects) ? rest.teacherDetails.subjects : [],
            experience: Number(rest.teacherDetails.experience) || 0
          }
        }),
        ...(rest.principalDetails && {
          principalDetails: {
            ...rest.principalDetails,
            employeeId: rest.principalDetails.employeeId?.trim() || '',
            qualification: Array.isArray(rest.principalDetails.qualification) ? rest.principalDetails.qualification : []
          }
        })
      };

      console.log('Sending registration data:', transformedData);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Registration failed (${response.status})`);
      }

      const data = await response.json();
      
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      setToken(data.token);
      setUser(data.user);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during registration');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};