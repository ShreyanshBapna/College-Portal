import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
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
    course: string;
    semester: number;
    batch: string;
    admissionYear: number;
    feeStatus: 'paid' | 'pending' | 'overdue';
    totalFees: number;
    paidFees: number;
  };
  teacherDetails?: {
    employeeId: string;
    department: string;
    subjects: string[];
    qualification: string;
    experience: number;
    joiningDate: Date;
  };
  principalDetails?: {
    employeeId: string;
    joiningDate: Date;
    previousExperience: string;
  };
  preferences: {
    language: 'en' | 'hi' | 'raj';
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: { 
    type: String, 
    enum: {
      values: ['student', 'teacher', 'principal'],
      message: 'Role must be either student, teacher, or principal'
    },
    required: [true, 'User role is required']
  },
  profile: {
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'],
      trim: true
    },
    avatar: String,
    phone: {
      type: String,
      validate: {
        validator: function(phone: string) {
          return !phone || /^\d{10}$/.test(phone.replace(/\D/g, ''));
        },
        message: 'Phone number must be 10 digits'
      }
    },
    address: String,
    dateOfBirth: Date,
  },
  studentDetails: {
    rollNumber: {
      type: String,
      validate: {
        validator: function(this: IUser, rollNumber: string) {
          return this.role !== 'student' || (rollNumber && rollNumber.trim().length > 0);
        },
        message: 'Roll number is required for students'
      }
    },
    course: String,
    semester: {
      type: Number,
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8']
    },
    batch: String,
    admissionYear: {
      type: Number,
      min: [2020, 'Admission year must be 2020 or later'],
      max: [new Date().getFullYear(), 'Admission year cannot be in the future']
    },
    feeStatus: { 
      type: String, 
      enum: {
        values: ['paid', 'pending', 'overdue'],
        message: 'Fee status must be paid, pending, or overdue'
      },
      default: 'pending' 
    },
    totalFees: { type: Number, default: 0, min: [0, 'Total fees cannot be negative'] },
    paidFees: { type: Number, default: 0, min: [0, 'Paid fees cannot be negative'] },
  },
  teacherDetails: {
    employeeId: {
      type: String,
      validate: {
        validator: function(this: IUser, employeeId: string) {
          return this.role !== 'teacher' || (employeeId && employeeId.trim().length > 0);
        },
        message: 'Employee ID is required for teachers'
      }
    },
    department: {
      type: String,
      validate: {
        validator: function(this: IUser, department: string) {
          return this.role !== 'teacher' || (department && department.trim().length > 0);
        },
        message: 'Department is required for teachers'
      }
    },
    subjects: [String],
    qualification: String,
    experience: { type: Number, min: [0, 'Experience cannot be negative'] },
    joiningDate: Date,
  },
  principalDetails: {
    employeeId: {
      type: String,
      validate: {
        validator: function(this: IUser, employeeId: string) {
          return this.role !== 'principal' || (employeeId && employeeId.trim().length > 0);
        },
        message: 'Employee ID is required for principals'
      }
    },
    joiningDate: Date,
    previousExperience: String,
  },
  preferences: {
    language: { 
      type: String, 
      enum: {
        values: ['en', 'hi', 'raj'],
        message: 'Language must be en, hi, or raj'
      },
      default: 'en' 
    },
    notifications: { type: Boolean, default: true },
    theme: { 
      type: String, 
      enum: {
        values: ['light', 'dark'],
        message: 'Theme must be light or dark'
      },
      default: 'light' 
    },
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, {
  timestamps: true
});

// Pre-save validation to ensure data consistency
UserSchema.pre('save', function(this: IUser, next) {
  try {
    // Ensure role-specific details are present
    if (this.role === 'student' && !this.studentDetails) {
      this.studentDetails = {
        rollNumber: '',
        course: '',
        semester: 1,
        batch: '',
        admissionYear: new Date().getFullYear(),
        feeStatus: 'pending',
        totalFees: 0,
        paidFees: 0
      };
    }
    
    if (this.role === 'teacher' && !this.teacherDetails) {
      this.teacherDetails = {
        employeeId: '',
        department: '',
        subjects: [],
        qualification: '',
        experience: 0,
        joiningDate: new Date()
      };
    }
    
    if (this.role === 'principal' && !this.principalDetails) {
      this.principalDetails = {
        employeeId: '',
        joiningDate: new Date(),
        previousExperience: ''
      };
    }
    
    // Validate paid fees don't exceed total fees
    if (this.studentDetails && this.studentDetails.paidFees > this.studentDetails.totalFees) {
      throw new Error('Paid fees cannot exceed total fees');
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);