import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'SUBSCRIPTION NAME IS REQUIRED'],
    trim: true,
    minLength: 2,
    maxLength: 100
  },
  price: {
    type: Number,
    required: [true, 'SUBSCRIPTION PRICE IS REQUIRED'],
    min: [0, 'PRICE MUST BE GREATER THAN 0']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP'],
    default: 'USD'
  },
  frequency: {
    type: String,
    required: [true, 'SUBSCRIPTION FREQUENCY IS REQUIRED'],
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  category: {
    type: String,
    enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'START DATE MUST BE IN PAST'
    }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'RENEWAL DATE MUST BE AFTER START DATE'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, {
  timestamps: true
});

subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }
  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;