import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  unitsCreated: {
    type: Number,
    default: 0
  },
  actives: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager'
  }
});

export default mongoose.model('Company', CompanySchema);