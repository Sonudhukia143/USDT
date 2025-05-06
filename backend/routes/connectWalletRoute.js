import { Router } from 'express';
import connectWallet from '../controllers/connectWallet.js';

const router = Router();

router.post('/', connectWallet);

export default router;