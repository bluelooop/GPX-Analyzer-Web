import { Router } from 'express';
import gpxRouter from './gpx/views';
import authRouter from './auth/views';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/gpx', gpxRouter);
