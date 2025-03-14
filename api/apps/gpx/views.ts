import { Router } from 'express';

const gpxRouter = Router();

gpxRouter.get('/', (_, res) => {
  res.send('Welcome to GPX app');
});

export default gpxRouter;
