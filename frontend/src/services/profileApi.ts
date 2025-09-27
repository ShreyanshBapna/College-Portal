import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  joinedDate: string;
  role: 'student' | 'teacher' | 'principal';
  profileImage?: string;
  
  // Role-specific fields
  studentId?: string;
  employeeId?: string;
  department?: string;
  course?: string;
  semester?: number;
  subjects?: string[];
  specialization?: string;
  qualification?: string[];
  experience?: number;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  
  // Additional info
  bio?: string;
  achievements?: string[];
  skills?: string[];
  languages?: string[];
}

// Get user profile
export const getUserProfile = async (token: string): Promise<ProfileData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

// Update user profile
export const updateUserProfile = async (token: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/profile`, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Upload profile image
export const uploadProfileImage = async (token: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await axios.post(`${API_BASE_URL}/api/profile/image`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

// Change password
export const changePassword = async (token: string, passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/api/profile/password`, passwordData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};