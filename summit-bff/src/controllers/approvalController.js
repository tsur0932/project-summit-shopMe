import { ApprovalService } from '../services/approvalService.js';


export const approvalController = {
  async getPending(_req, res, next) {
    try {
      const r = await ApprovalService.getPending();
      res.json(r);
    } catch (e) { next(e); }
  },


  async getRequestById(req, res, next) {
    try {
      const r = await ApprovalService.getRequestById(req.params.requestId);
      res.json(r);
    } catch (e) { next(e); }
  },


  async getRequestByProductId(req, res, next) {
    try {
      const r = await ApprovalService.getRequestByProductId(req.params.productId);
      res.json(r);
    } catch (e) { next(e); }
  },


  async createRequest(req, res, next) {
    try {
      const r = await ApprovalService.createRequest(req.params.productId, req.body?.supplierId);
      res.status(201).json(r);
    } catch (e) { next(e); }
  },


  async approve(req, res, next) {
    try {
      const r = await ApprovalService.approve(req.params.productId, req.body?.stewardId);
      res.json(r);
    } catch (e) { next(e); }
  },


  async reject(req, res, next) {
    try {
      const r = await ApprovalService.reject(req.params.productId, req.body?.stewardId, req.body?.reason);
      res.json(r);
    } catch (e) { next(e); }
  },


  async getAudit(req, res, next) {
    try {
      const r = await ApprovalService.getAudit(req.params.productId);
      res.json(r);
    } catch (e) { next(e); }
  },
};






