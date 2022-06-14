import { Router } from 'express';
import { getMiscData } from '../controller/faqs';

const router = Router();

router.get('/authPage', getMiscData);

export default router;
