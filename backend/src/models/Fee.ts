import mongoose, { Document, Schema } from 'mongoose';

export interface IFeeStructure extends Document {
  course: string;
  semester: number;
  academicYear: string;
  feeComponents: {
    tuitionFee: number;
    laboratoryFee: number;
    libraryFee: number;
    sportsFee: number;
    developmentFee: number;
    examinationFee: number;
    hostelFee?: number;
    transportFee?: number;
    otherFees?: {
      name: string;
      amount: number;
    }[];
  };
  totalFee: number;
  dueDates: {
    installment1: Date;
    installment2?: Date;
    installment3?: Date;
    finalDate: Date;
  };
  scholarshipEligible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeeStructureSchema = new Schema<IFeeStructure>({
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
  feeComponents: {
    tuitionFee: { type: Number, required: true },
    laboratoryFee: { type: Number, required: true },
    libraryFee: { type: Number, required: true },
    sportsFee: { type: Number, required: true },
    developmentFee: { type: Number, required: true },
    examinationFee: { type: Number, required: true },
    hostelFee: Number,
    transportFee: Number,
    otherFees: [{
      name: String,
      amount: Number
    }]
  },
  totalFee: { type: Number, required: true },
  dueDates: {
    installment1: { type: Date, required: true },
    installment2: Date,
    installment3: Date,
    finalDate: { type: Date, required: true }
  },
  scholarshipEligible: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const FeeStructure = mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);

export interface IFeePayment extends Document {
  student: mongoose.Types.ObjectId;
  feeStructure: mongoose.Types.ObjectId;
  paymentDetails: {
    amount: number;
    paymentMethod: 'cash' | 'card' | 'upi' | 'netbanking' | 'cheque';
    transactionId?: string;
    paymentDate: Date;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
  };
  installmentNumber: number;
  remarks?: string;
  processedBy: mongoose.Types.ObjectId;
  receiptNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeePaymentSchema = new Schema<IFeePayment>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  feeStructure: { type: Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
  paymentDetails: {
    amount: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ['cash', 'card', 'upi', 'netbanking', 'cheque'],
      required: true 
    },
    transactionId: String,
    paymentDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  installmentNumber: { type: Number, required: true },
  remarks: String,
  processedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiptNumber: { type: String, required: true, unique: true },
}, {
  timestamps: true
});

export const FeePayment = mongoose.model<IFeePayment>('FeePayment', FeePaymentSchema);