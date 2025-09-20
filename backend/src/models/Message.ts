import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sessionId: string;
  content: string;
  language: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  metadata?: {
    confidence?: number;
    intent?: string;
    entities?: any[];
    processingTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'hi', 'raj'],
    default: 'en'
  },
  sender: {
    type: String,
    required: true,
    enum: ['user', 'bot']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  metadata: {
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    intent: {
      type: String
    },
    entities: [{
      type: Schema.Types.Mixed
    }],
    processingTime: {
      type: Number // in milliseconds
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
MessageSchema.index({ sessionId: 1, timestamp: -1 });
MessageSchema.index({ language: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ timestamp: -1 });
MessageSchema.index({ 'metadata.intent': 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);