import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  subject: string;
  teacher: mongoose.Types.ObjectId;
  course: string;
  semester: number;
  section?: string;
  assignedTo: mongoose.Types.ObjectId[];
  dueDate: Date;
  maxMarks: number;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  submissions: {
    student: mongoose.Types.ObjectId;
    submittedAt: Date;
    files: {
      name: string;
      url: string;
      type: string;
    }[];
    remarks?: string;
    marks?: number;
    gradedAt?: Date;
    gradedBy?: mongoose.Types.ObjectId;
    status: 'submitted' | 'graded' | 'late' | 'pending';
  }[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  section: String,
  assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, required: true },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  submissions: [{
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date, required: true },
    files: [{
      name: String,
      url: String,
      type: String
    }],
    remarks: String,
    marks: Number,
    gradedAt: Date,
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['submitted', 'graded', 'late', 'pending'],
      default: 'submitted'
    }
  }],
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
}, {
  timestamps: true
});

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  schedule: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: mongoose.Types.ObjectId;
  markedAt: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'excused'],
    required: true 
  },
  markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  markedAt: { type: Date, required: true },
  remarks: String,
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per student per schedule per date
AttendanceSchema.index({ student: 1, schedule: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);