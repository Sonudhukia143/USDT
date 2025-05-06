import { Router } from 'express';
import logApproval from '../controllers/logApproval.js';

const router = Router();

router.post('/', logApproval);

export default router;