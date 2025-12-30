import express from 'express';
import { cartController } from '../controllers/cartController.js';
import { authenticate, requireRole } from '../middleware/auth.js';


const router = express.Router();


// Customer-only cart endpoints
router.post('/my', authenticate, requireRole(['customer']), cartController.create);
router.get('/user/:userId', authenticate, requireRole(['customer']), cartController.getMyCart);
router.get('/my', authenticate, requireRole(['customer']), cartController.getMyCart);
router.get('/:cartId', authenticate, requireRole(['customer']), cartController.getById);
router.get('/:cartId/details', authenticate, requireRole(['customer']), cartController.getDetails);
router.post('/:cartId/items', authenticate, requireRole(['customer']), cartController.addItem);
router.delete('/:cartId/items/:itemId', authenticate, requireRole(['customer']), cartController.removeItem);
router.delete('/:cartId/items', authenticate, requireRole(['customer']), cartController.clear);


export default router;






