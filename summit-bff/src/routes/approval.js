import express from 'express';
import { approvalController } from '../controllers/approvalController.js';
import { authenticate, requireRole } from '../middleware/auth.js';


const router = express.Router();


router.get('/products/pending', authenticate, requireRole(['admin']), approvalController.getPending);


router.get('/requests/:requestId', authenticate, requireRole(['admin']), approvalController.getRequestById);


router.get('/products/:productId/request', authenticate, requireRole(['admin']), approvalController.getRequestByProductId);


router.post('/products/:productId/request', authenticate, requireRole(['admin']), approvalController.createRequest);


router.post('/products/:productId/approve', authenticate, requireRole(['admin']), approvalController.approve);


router.post('/products/:productId/reject', authenticate, requireRole(['admin']), approvalController.reject);


router.get('/products/:productId/audit', authenticate, requireRole(['admin']), approvalController.getAudit);


export default router;