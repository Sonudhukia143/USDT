import { Router } from 'express';
import saveWallet from '../controllers/saveWallet.js';

const router = Router();

router.post('/', saveWallet);

export default router;