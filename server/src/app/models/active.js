import mongoose from 'mongoose';

const ActiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String },
  propietary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  status: {
    type: String,
    default: 'available'
  },
  model: {
    name: { type: String },
    image: { type: String },
    description: { type: String },
  }
});

export default mongoose.model('ActiveSchema', ActiveSchema);