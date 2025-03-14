import { Router } from 'express';
import gpxRouter from './apps/gpx/views';

export const apiRouter = Router();

apiRouter.use('/gpx', gpxRouter);
