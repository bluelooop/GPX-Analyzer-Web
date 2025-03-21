import express from 'express';
import apiRouter from './apps/routes';
import { loadConfigurations } from './configurations';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const server: express.Application = express();

loadConfigurations();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
};

server.use(cors(corsOptions));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// Specify all routes
server.use('/api', apiRouter);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('http://localhost:3000/api');
});
