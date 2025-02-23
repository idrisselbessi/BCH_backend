import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import { notFoundError, errorHandler } from './middlewares/error-handler.js';

// routes 
import userRoutes from "./routes/UserRoutes.js"; 



const app = express();
const port = process.env.PORT || 3337;
const databaseName = 'bouchaddakh_DB';
const db_url = "mongodb://127.0.0.1:27017";


mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`${db_url}/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/img', express.static('public/images'));

  // routes call
  app.use("/api/users", userRoutes);




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});