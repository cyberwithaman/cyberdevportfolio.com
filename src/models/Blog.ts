import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: Date;
  category: string;
  status: 'published' | 'draft';
  image: {
    url: string;
    filename: string;
    contentType: string;
    isGoogleImage?: boolean;
  };
  tags: string[];
  createdBy: string; // Reference to admin user
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    isGoogleImage: { type: Boolean, default: false }
  },
  tags: [{ type: String }],
  createdBy: { type: String, default: 'admin' } // Default to admin
}, {
  timestamps: true
});

// Create text indexes for search functionality
BlogSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  category: 'text',
  tags: 'text'
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema); 