import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    // Simple email validation regex
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true,
  },
  whatsapp: {
    type: Boolean,
    default: false,
  },
  emailSubscribed: {
    type: Boolean,
    default: true,
  },
  phoneSubscribed: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  updateHistory: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      fields: [String],
      action: String
    }
  ]
});

export default mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema); 