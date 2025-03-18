import { NextFunction, Request, Response } from 'express';

export const routeProviderTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header is required' });
  }

  // Check if the header follows Bearer token format
  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization format. Use Bearer token' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  next();
};
