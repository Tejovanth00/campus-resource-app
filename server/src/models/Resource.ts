// Sushma - Resource model
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['equipment', 'approval-based', 'recreational'],
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  checkedOutAt: {
    type: Date,
    default: null,
  },
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;