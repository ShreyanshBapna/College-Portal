import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Save,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
  status?: 'present' | 'absent' | 'late';
}

interface Course {
  id: string;
  name: string;
  code: string;
}

// Mock data
const mockStudents: Student[] = [
  { id: '1', name: 'Arjun Sharma', rollNumber: '21CS001' },
  { id: '2', name: 'Priya Patel', rollNumber: '21CS002' },
  { id: '3', name: 'Rahul Gupta', rollNumber: '21CS003' },
  { id: '4', name: 'Sneha Singh', rollNumber: '21CS004' },
  { id: '5', name: 'Amit Kumar', rollNumber: '21CS005' },
  { id: '6', name: 'Kavya Joshi', rollNumber: '21CS006' },
  { id: '7', name: 'Rohit Agarwal', rollNumber: '21CS007' },
  { id: '8', name: 'Pooja Sharma', rollNumber: '21CS008' },
];

const mockCourses: Course[] = [
  { id: 'CS101', name: 'Computer Science Fundamentals', code: 'CS101' },
  { id: 'CS102', name: 'Data Structures & Algorithms', code: 'CS102' },
  { id: 'CS103', name: 'Web Development', code: 'CS103' },
];

const LiveAttendance: React.FC = () => {
  const { markAttendance } = useSocket();
  const [selectedCourse, setSelectedCourse] = useState<Course>(mockCourses[0]);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );

    // Send real-time update
    markAttendance(studentId, selectedCourse.id, status);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    
    // You could also emit a batch update event here
  };

  const getAttendanceStats = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const notMarked = students.filter(s => !s.status).length;
    
    return { present, absent, notMarked, total: students.length };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Live Attendance
          </h1>
          <p className="text-gray-600 mt-1">Mark attendance in real-time</p>
        </div>
        
        <motion.button
          onClick={handleSaveAttendance}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Attendance
            </div>
          )}
        </motion.button>
      </div>

      {/* Course Selection & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse.id}
            onChange={(e) => {
              const course = mockCourses.find(c => c.id === e.target.value);
              if (course) setSelectedCourse(course);
            }}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {mockCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Present</p>
                <p className="text-2xl font-bold text-green-700">{stats.present}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border border-red-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Not Marked</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.notMarked}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search students by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Students ({filteredStudents.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{student.name}</h4>
                      <p className="text-sm text-gray-500">{student.rollNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => handleAttendanceChange(student.id, 'present')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        student.status === 'present'
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Present
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleAttendanceChange(student.id, 'absent')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        student.status === 'absent'
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Absent
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveAttendance;