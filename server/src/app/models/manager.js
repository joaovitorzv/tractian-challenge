import mongoose from 'mongoose';

const ManagerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  ]
});

export default mongoose.model('Manager', ManagerSchema);