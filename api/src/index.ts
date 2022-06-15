import path from 'path';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import https from 'https';

import authPageRoutes from './routes/faq';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';

config();

const app = express();

app.use(bodyParser.json());
app.use(compression());

const privateKey = fs.readFileSync('server.key');

const certificate = fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

app.use('/images', express.static(path.join(__dirname, '..', 'images')));

app.use(
  cors({
    origin: '*',
  })
);

//To get the faq, jumbotron and other asset data of the signin and signup page => /authPage/
app.use(authPageRoutes);
// for user signin, sign out and getting user data
app.use('/auth', authRoutes);
//  to get page content
app.use('/content', contentRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    https.createServer({ key: privateKey, cert: certificate }, app).listen(8080, () => {
      console.log('Server started on localhost 8080');
    });
  })
  .catch((error) => console.log(error));
