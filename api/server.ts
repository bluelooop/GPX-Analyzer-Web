import express from 'express';
import { apiRouter } from './apps/routes';

const server: express.Application = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Specify all routes
server.use('/api', apiRouter);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
