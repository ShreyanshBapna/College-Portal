import mongoose, { Document, Schema } from 'mongoose';

export interface IChatSession extends Document {
  sessionId?: string;
  userId?: string;
  language: string;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  lastActivity: Date;
  messageCount: number;
  feedback?: string;
  rating?: number;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema: Schema = new Schema({
  sessionId: {
    type: String,
    unique: true,
    sparse: true
  },
  userId: {
    type: String,
    default: null
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'hi', 'raj'],
    default: 'en'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
ChatSessionSchema.index({ language: 1 });
ChatSessionSchema.index({ isActive: 1 });
ChatSessionSchema.index({ startTime: -1 });
ChatSessionSchema.index({ userId: 1 });

// Auto-generate sessionId if not provided
ChatSessionSchema.pre('save', function(this: IChatSession, next: any) {
  if (!this.sessionId) {
    this.sessionId = (this._id as any).toString();
  }
  next();
});

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);