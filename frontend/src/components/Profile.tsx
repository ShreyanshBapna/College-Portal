import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Shield, 
  Award, 
  BookOpen,
  GraduationCap,
  Building,
  Clock,
  Settings,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, changePassword, ProfileData } from '../services/profileApi';

interface ProfileProps {
  userRole: 'student' | 'teacher' | 'principal';
  profileData?: ProfileData;
  onUpdateProfile?: (updatedData: ProfileData) => void;
  className?: string;
}

const Profile: React.FC<ProfileProps> = ({
  userRole,
  profileData,
  onUpdateProfile,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'security'>('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Default profile data based on role
  const getDefaultProfileData = (): ProfileData => {
    const baseData = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@jecrc.ac.in',
      phone: '+91 98765 43210',
      address: '123 Main Street, Jaipur, Rajasthan, India',
      dateOfBirth: '1995-05-15',
      joinedDate: '2022-07-01',
      role: userRole,
      profileImage: '',
      bio: 'Passionate about education and technology.',
      languages: ['English', 'Hindi', 'Rajasthani']
    };

    switch (userRole) {
      case 'student':
        return {
          ...baseData,
          firstName: 'Priya',
          lastName: 'Sharma',
          studentId: 'JE2022001',
          department: 'Computer Science',
          course: 'B.Tech CSE',
          semester: 6,
          achievements: ['Dean\'s List 2023', 'Best Project Award', 'Hackathon Winner'],
          skills: ['Java', 'React', 'Python', 'Machine Learning'],
          emergencyContact: {
            name: 'Rajesh Sharma',
            relation: 'Father',
            phone: '+91 98765 12345'
          }
        };
      
      case 'teacher':
        return {
          ...baseData,
          firstName: 'Dr. Amit',
          lastName: 'Patel',
          employeeId: 'JE-T-2019-045',
          department: 'Computer Science',
          subjects: ['Data Structures', 'Algorithms', 'Database Management'],
          specialization: 'Machine Learning',
          qualification: ['Ph.D. in Computer Science', 'M.Tech CSE', 'B.Tech CSE'],
          experience: 8,
          achievements: ['Best Teacher Award 2023', 'Research Excellence Award', 'IEEE Member'],
          skills: ['Machine Learning', 'Data Science', 'Python', 'Research'],
        };
      
      case 'principal':
        return {
          ...baseData,
          firstName: 'Dr. Sunita',
          lastName: 'Agarwal',
          employeeId: 'JE-P-2015-001',
          department: 'Administration',
          specialization: 'Educational Leadership',
          qualification: ['Ph.D. in Management', 'M.B.A.', 'M.Tech'],
          experience: 15,
          achievements: ['Excellence in Leadership Award', 'Educational Innovation Award'],
          skills: ['Leadership', 'Strategic Planning', 'Educational Management'],
        };
      
      default:
        return baseData;
    }
  };

  const currentProfile = profileData || getDefaultProfileData();

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({ ...currentProfile });
  };

  const handleSaveClick = () => {
    if (editedData) {
      onUpdateProfile?.(editedData);
      setIsEditing(false);
      setEditedData(null);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Here you would typically call an API to update the password
    console.log('Password update requested');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password updated successfully!');
  };

  const renderPersonalTab = () => {
    const data = isEditing ? editedData! : currentProfile;
    
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                `${data.firstName[0]}${data.lastName[0]}`
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {data.firstName} {data.lastName}
                </h1>
                <p className="text-lg text-gray-600 capitalize">{data.role}</p>
                {data.department && (
                  <p className="text-sm text-gray-500">{data.department} Department</p>
                )}
              </div>
              
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Basic Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900">{data.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900">{data.lastName}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900">{data.email}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900">{data.phone}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Date of Birth</span>
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-900">{new Date(data.dateOfBirth).toLocaleDateString()}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Joined Date</span>
              </label>
              <p className="text-gray-900">{new Date(data.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Address</span>
            </label>
            {isEditing ? (
              <textarea
                value={data.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{data.address}</p>
            )}
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={data.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{data.bio || 'No bio available'}</p>
            )}
          </div>
        </Card>

        {/* Emergency Contact (for students) */}
        {data.role === 'student' && data.emergencyContact && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Emergency Contact</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-gray-900">{data.emergencyContact.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                <p className="text-gray-900">{data.emergencyContact.relation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <p className="text-gray-900">{data.emergencyContact.phone}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderAcademicTab = () => {
    const data = isEditing ? editedData! : currentProfile;
    
    return (
      <div className="space-y-6">
        {/* Academic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Academic Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.studentId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">{data.studentId}</p>
              </div>
            )}
            
            {data.employeeId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">{data.employeeId}</p>
              </div>
            )}
            
            {data.department && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>Department</span>
                </label>
                <p className="text-gray-900">{data.department}</p>
              </div>
            )}
            
            {data.course && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <p className="text-gray-900">{data.course}</p>
              </div>
            )}
            
            {data.semester && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                <p className="text-gray-900">{data.semester}</p>
              </div>
            )}
            
            {data.specialization && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <p className="text-gray-900">{data.specialization}</p>
              </div>
            )}
            
            {data.experience && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <p className="text-gray-900">{data.experience} years</p>
              </div>
            )}
          </div>
        </Card>

        {/* Subjects/Qualifications */}
        {(data.subjects || data.qualification) && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{data.subjects ? 'Subjects Teaching' : 'Qualifications'}</span>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {(data.subjects || data.qualification)?.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </h3>
            <ul className="space-y-2">
              {data.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900">{achievement}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {data.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderSecurityTab = () => {
    return (
      <div className="space-y-6">
        {/* Change Password */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </h3>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm new password"
              />
            </div>
            
            <button
              onClick={handlePasswordSubmit}
              disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Security Settings</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Enable 2FA
              </button>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Login Notifications</h4>
                <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Session Management</h4>
                <p className="text-sm text-gray-500">Manage your active sessions</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                End All Sessions
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className={`h-full w-full max-w-7xl mx-auto ${className}`}>
      <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Content - Takes 2/3 space on large screens */}
        <div className="flex-1 lg:w-2/3 min-h-0">
          <Card className="h-full">
            <div className="h-full flex flex-col p-6">
              {/* Tab Navigation */}
              <div className="flex-shrink-0 mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('personal')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'personal'
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Personal Info
                    </button>
                    <button
                      onClick={() => setActiveTab('academic')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'academic'
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Academic Info
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'security'
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Security
                    </button>
                  </nav>
                </div>
              </div>
      
              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'personal' && renderPersonalTab()}
                  {activeTab === 'academic' && renderAcademicTab()}
                  {activeTab === 'security' && renderSecurityTab()}
                </motion.div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Takes 1/3 space on large screens, collapses below on mobile */}
        <div className="lg:w-1/3 flex-shrink-0">
          <Card className="h-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-semibold text-indigo-600">95%</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                {currentProfile.role === 'student' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Semester</span>
                      <span className="text-sm font-semibold text-emerald-600">{currentProfile.semester || 'N/A'}</span>
                    </div>
                  </div>
                )}
                
                {(currentProfile.role === 'teacher' || currentProfile.role === 'principal') && (
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="text-sm font-semibold text-violet-600">{currentProfile.experience || 0} years</span>
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-semibold text-amber-600">
                      {new Date(currentProfile.joinedDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Settings</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Achievements</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;