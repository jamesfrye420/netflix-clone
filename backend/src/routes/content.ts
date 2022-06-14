import { Router } from 'express';

// import { isAuth } from '../middleware/is-auth';

import { getBrowseContent, getTMDBConfig } from '../controller/content';

const router = Router();

//get: /content/configuration
router.get('/configuration', getTMDBConfig);

//get: /content/movies
router.get('/:slug', getBrowseContent);

export default router;
