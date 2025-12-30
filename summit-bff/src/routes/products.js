import express from 'express';
import { productsController } from '../controllers/productController.js';
import { authenticate, requireRole } from '../middleware/auth.js';


const router = express.Router();

router.get('/', authenticate, requireRole(['customer']), productsController.getAll);

router.get('/categories', authenticate, requireRole(['customer']), productsController.getCategories);

router.post('/supplier', authenticate, requireRole(['supplier']), productsController.addSupplier);

router.put('/supplier/:productId', authenticate, requireRole(['supplier']), productsController.updateSupplier);

router.delete('/supplier/:productId', authenticate, requireRole(['supplier']), productsController.deleteSupplier);

router.get('/categories/:categoryId/products', authenticate, requireRole(['customer']), productsController.getByCategory);

router.get('/search', authenticate, requireRole(['customer']), productsController.search);

router.get('/:productId', authenticate, requireRole(['customer']), productsController.getById);


export default router;