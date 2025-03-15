import { Router } from 'express';

const gpxRouter = Router();

gpxRouter.get('/', (req, res): any => {
  return res.send('Welcome to GPX app');
});

export default gpxRouter;
