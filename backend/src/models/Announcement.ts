import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'fee' | 'holiday' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: ('student' | 'teacher' | 'principal' | 'all')[];
  targetCourses?: string[];
  targetSemesters?: number[];
  author: mongoose.Types.ObjectId;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  isActive: boolean;
  publishAt?: Date;
  expiresAt?: Date;
  views: number;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['general', 'academic', 'event', 'fee', 'holiday', 'urgent'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  targetAudience: [{ 
    type: String, 
    enum: ['student', 'teacher', 'principal', 'all'],
    required: true 
  }],
  targetCourses: [String],
  targetSemesters: [Number],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isActive: { type: Boolean, default: true },
  publishAt: Date,
  expiresAt: Date,
  views: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true
});

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);