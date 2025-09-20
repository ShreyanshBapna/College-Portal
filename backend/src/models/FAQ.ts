import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  language: string;
  keywords: string[];
  category: string;
  isActive: boolean;
  accessCount: number;
  createdBy?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'hi', 'raj'],
    default: 'en'
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: true,
    enum: [
      'general',
      'academics',
      'admissions',
      'fees',
      'scholarships',
      'facilities',
      'placements',
      'events',
      'library',
      'hostel',
      'transport',
      'contact'
    ],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accessCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better search performance
FAQSchema.index({ language: 1, category: 1 });
FAQSchema.index({ keywords: 1 });
FAQSchema.index({ isActive: 1 });
FAQSchema.index({ accessCount: -1 });
FAQSchema.index({ 
  question: 'text', 
  answer: 'text', 
  keywords: 'text' 
}, {
  weights: {
    question: 10,
    keywords: 5,
    answer: 1
  }
});

// Middleware to update lastUpdated field
FAQSchema.pre('save', function(this: IFAQ, next: any) {
  this.lastUpdated = new Date();
  next();
});

// Method to increment access count
FAQSchema.methods.incrementAccessCount = function(this: IFAQ) {
  this.accessCount += 1;
  return this.save();
};

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);