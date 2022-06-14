import { Router } from 'express';
import { body } from 'express-validator';
import { isAuth } from '../middleware/is-auth';

import { getUser, postSignin, putSignup } from '../controller/auth';

const router = Router();

// post: /auth/signin
router.post(
  '/signin',
  [body('email').isEmail().withMessage('enter valid email').trim(), body('password').trim().notEmpty()],
  postSignin
);

// put: /auth/signup
router.put(
  '/signup',
  [
    body('email').isEmail().withMessage('enter valid email').trim(),

    body('password').trim().notEmpty(),
    body('firstName').trim().notEmpty(),
  ],
  putSignup
);

//get: /auth/user
router.get('/user', isAuth, getUser);

export default router;
