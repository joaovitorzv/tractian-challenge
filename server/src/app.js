import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import routes from './routes'

class App {
  constructor() {
    this.app = express();
    this.server = mongoose;

    this.middlwares();
    this.database();
    this.routes();
  }

  database() {
    this.server.connect(
      process.env.MONGO_ATLAS_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
      .then(() => console.log('> Connected to mongoDB'))
      .catch(err => console.log(err));
  }

  middlwares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use(routes);
  }

}

export default new App().app;