import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import Image from '../models/image';
import Manager from '../models/manager';

const conn = mongoose.connection;

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos')
})

export default {
  show: async (req, res) => {
    const manager_id = req.headers.manager_id
    const { filename } = req.params;

    try {
      await Manager.findById(manager_id);
    } catch (err) {
      return res.status(401).json({ message: 'Only authorized users can upload images' });
    }

    console.log(filename)
    gfs.files.findOne({ filename: filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          message: 'File not exists',
        });
      }

      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          message: 'Not an image'
        });
      }
    });
  }
}