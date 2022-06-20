import { Router } from 'express';

import { isAuth } from '../middleware/is-auth';

import { getBrowseContent, getTMDBConfig, patchUpdateWatchLater } from '../controller/content';

const router = Router();

//get: /content/configuration
router.get('/configuration', getTMDBConfig);

//patch /content/movies/updateWatchlist
router.patch('/:slug/updateWatchlist/:id', isAuth, patchUpdateWatchLater);

//get: /content/movies
router.get('/:slug', getBrowseContent);

export default router;
