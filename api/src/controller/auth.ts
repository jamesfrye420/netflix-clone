import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Response, Request, NextFunction } from 'express';

import { errorHandler, ErrorType } from '../utils/errorHandler';

import User from '../models/user';
import { RequestBody } from 'src/middleware/is-auth';

interface Signin {
  email: string;
  password: string;
}

interface Signup extends Signin {
  firstName: string;
  photoURL: string;
}

export const postSignin = async (req: Request<{}, {}, Signin, {}>, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  // checking for errors in the user input, if error found, return status code of 422
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: ErrorType = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let loadedUser;

    loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      const error: ErrorType = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isEqual) {
      const error: ErrorType = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      'secret',
      { expiresIn: '24d' }
    );
    return res
      .status(200)
      .json({ message: 'login successful', token: token, userId: loadedUser._id.toString(), User: loadedUser });
  } catch (error) {
    console.log(error);

    errorHandler(error, next);
  }
};

export const putSignup = async (req: Request<{}, {}, Signup, {}>, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error: ErrorType = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const firstName = req.body.firstName;
    const email = req.body.email;
    const password = req.body.password;
    const photoURL = req.body.photoURL;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error: ErrorType = new Error('email already exists');
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      firstName,
      email,
      password: hashedPassword,
      photoURL: `images/users/${photoURL}.png`,
    });
    const savedUser = await user.save();
    if (!savedUser) {
      const error: ErrorType = new Error('A user with this email could not be created.');
      throw error;
    }
    const token = jwt.sign(
      {
        email: savedUser.email,
        userId: savedUser._id.toString(),
      },
      'secret',
      { expiresIn: '24d' }
    );

    return res.status(201).json({ message: 'user created', token, userId: savedUser._id.toString(), User: savedUser });
  } catch (error) {
    errorHandler(error, next);
  }
};

export const getUser = async (req: RequestBody, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'not authorized' });
  }
  try {
    const user = await User.findById(req.userId);
    if (!User) {
      const error: ErrorType = new Error('user not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Is Authenticted', userId: req.userId, User: user });
  } catch (error) {
    errorHandler(error, next);
  }
};
