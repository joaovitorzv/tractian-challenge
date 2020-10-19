import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  propietary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager'
  },
  unitAvailability: {
    available: {
      type: Number,
      default: 0
    },
    inUse: {
      type: Number,
      default: 0
    },
    underMaintenance: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  actives: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Active'
    }
  ]
});

export default mongoose.model('UnitSchema', UnitSchema);