const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: {
    required: true,
    type: String
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  creator: {
    required: true,
    type: String,
  }
});

export default mongoose.model('Image', ImageSchema);