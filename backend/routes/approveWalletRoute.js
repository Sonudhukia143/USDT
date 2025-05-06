import { Router } from 'express';
import approoveWallet from '../controllers/approoveWallet.js';

const router = Router();

router.post('/', approoveWallet);

export default router;