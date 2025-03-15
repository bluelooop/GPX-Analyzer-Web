import { Router } from 'express';
import gpxRouter from './gpx/views';

export const apiRouter = Router();

apiRouter.use('/gpx', gpxRouter);
