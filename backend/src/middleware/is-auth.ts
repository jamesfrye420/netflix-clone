import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorHandler, ErrorType } from '../utils/errorHandler';

export interface RequestBody extends Request {
  userId?: string;
}

interface jwtPayload {
  email: string;
  userId: string;
}

export const isAuth = async (req: RequestBody, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: ErrorType = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret') as jwtPayload;
  } catch (err) {
    err.statusCode = 500;
    return errorHandler(err, next);
  }
  if (!decodedToken) {
    const error: ErrorType = new Error('Not authenticated.');
    error.statusCode = 401;
    return errorHandler(error, next);
  }
  req.userId = decodedToken.userId;
  next();
};
