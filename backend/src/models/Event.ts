import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'academic' | 'cultural' | 'sports' | 'workshop' | 'seminar' | 'exam' | 'holiday';
  startDate: Date;
  endDate: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  participants: {
    registered: mongoose.Types.ObjectId[];
    attended: mongoose.Types.ObjectId[];
    maxCapacity?: number;
  };
  registrationRequired: boolean;
  registrationDeadline?: Date;
  fees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['academic', 'cultural', 'sports', 'workshop', 'seminar', 'exam', 'holiday'],
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: {
    registered: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attended: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxCapacity: Number,
  },
  registrationRequired: { type: Boolean, default: false },
  registrationDeadline: Date,
  fees: Number,
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
}, {
  timestamps: true
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);

export interface ISchedule extends Document {
  type: 'class' | 'exam' | 'meeting' | 'event';
  title: string;
  subject?: string;
  teacher?: mongoose.Types.ObjectId;
  course: string;
  semester: number;
  section?: string;
  classroom: string;
  startTime: Date;
  endTime: Date;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  recurrenceEnd?: Date;
  exceptions?: Date[]; // Dates when this schedule doesn't apply
  attendees: mongoose.Types.ObjectId[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  type: { 
    type: String, 
    enum: ['class', 'exam', 'meeting', 'event'],
    required: true 
  },
  title: { type: String, required: true },
  subject: String,
  teacher: { type: Schema.Types.ObjectId, ref: 'User' },
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  section: String,
  classroom: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true },
  isRecurring: { type: Boolean, default: true },
  recurrencePattern: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly'
  },
  recurrenceEnd: Date,
  exceptions: [Date],
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

export const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema);