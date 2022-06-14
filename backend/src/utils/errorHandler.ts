import { NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export interface ErrorType extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

export const errorHandler = (err: any, next: NextFunction) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};
