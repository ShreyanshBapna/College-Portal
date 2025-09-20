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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'principal'], required: true },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    phone: String,
    address: String,
    dateOfBirth: Date,
  },
  studentDetails: {
    rollNumber: String,
    course: String,
    semester: Number,
    batch: String,
    admissionYear: Number,
    feeStatus: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    totalFees: { type: Number, default: 0 },
    paidFees: { type: Number, default: 0 },
  },
  teacherDetails: {
    employeeId: String,
    department: String,
    subjects: [String],
    qualification: String,
    experience: Number,
    joiningDate: Date,
  },
  principalDetails: {
    employeeId: String,
    joiningDate: Date,
    previousExperience: String,
  },
  preferences: {
    language: { type: String, enum: ['en', 'hi', 'raj'], default: 'en' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);