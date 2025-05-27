import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IProject extends Document {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  imageUrl?: string;
  githubUrl?: string;
  delay?: number;
  features: string[];
  category: string;
  tags?: string[];
  status: string;
  date: string;
  featured: boolean;
}

const ProjectSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  longDescription: {
    type: String,
    required: false,
    default: '',
  },
  technologies: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  githubUrl: {
    type: String,
    default: '',
  },
  delay: {
    type: Number,
    default: 0.1,
  },
  features: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: true,
    default: 'Cyber-Security',
  },
  status: {
    type: String,
    enum: ['Active', 'In Progress', 'On Hold', 'Completed'],
    default: 'Active',
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0],
  },
  featured: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Middleware to create slug from title if not provided
ProjectSchema.pre('save', function(next) {
  const doc = this as unknown as IProject;
  if (!doc.slug) {
    doc.slug = slugify(doc.title, { lower: true, strict: true });
  }
  next();
});

// Delete the model if it exists to prevent OverwriteModelError during hot reload in development
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project; 