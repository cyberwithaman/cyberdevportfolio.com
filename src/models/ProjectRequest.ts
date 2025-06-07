import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectRequest extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  date: string;
  status: 'new' | 'in-progress' | 'approved' | 'rejected';
}

const ProjectRequestSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'approved', 'rejected'],
    default: 'new',
  }
}, {
  timestamps: true,
});

// Delete the model if it exists to prevent OverwriteModelError during hot reload in development
const ProjectRequest = mongoose.models.ProjectRequest || mongoose.model<IProjectRequest>('ProjectRequest', ProjectRequestSchema);

export default ProjectRequest; 