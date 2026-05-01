import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },

    dueDate: Date,
  },
  { timestamps: true },
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
