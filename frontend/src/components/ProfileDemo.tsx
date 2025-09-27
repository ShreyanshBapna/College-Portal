import React from 'react';
import Profile from './Profile';
import { getProfileByRole } from '../utils/profileData';
import { useAuth } from '../contexts/AuthContext';

const ProfileDemo: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  const handleUpdateProfile = async (updatedData: any) => {
    console.log('Profile updated:', updatedData);
    // Here you would typically update the profile via API
    try {
      // await updateProfile(updatedData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">
            This is a demo of the Profile component with proper layout and data from utils.
          </p>
        </div>
        
        <Profile
          userRole={userRole}
          profileData={getProfileByRole(userRole)}
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    </div>
  );
};

export default ProfileDemo;