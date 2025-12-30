import { cartService } from '../services/cartService.js';


export const cartController = {
  // async create(req, res, next) {
  //   try {
  //     const userId = req.user.id || {};
  //     if (!userId || String(userId).trim() === '') return res.status(400).json({ error: 'userId is required' });
  //     const cart = await cartService.createCart(userId);
  //     res.status(201).json({ data: cart });
  //   } catch (err) { next(err); }
  // },
  async create(req, res, next) {
  try {
    let { userId } = req.body;
    if (userId === "me") {
      userId = req.user.id;  // replace "me" with actual user ID
    }
    const cart = await cartService.createCart(userId);
    res.json({ data: cart });
  } catch (err) { next(err); }
},


  async getById(req, res, next) {
    try {
      const { cartId } = req.params;
      const cart = await cartService.getCartById(cartId);
      res.json({ data: cart });
    } catch (err) { next(err); }
  },


  async getByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const cart = await cartService.getCartByUserId(userId);
      res.json({ data: cart });
    } catch (err) { next(err); }
  },

  async getMyCart(req, res, next) {
    try {
      const userId = req.user.id;
      const cart = await cartService.getCartByUserId(userId);
      res.json({ data: cart });
    } catch (err) { next(err); }
  },

  // For now, details is the same as getById; could enrich with product data if needed
  async getDetails(req, res, next) {
    try {
      const { cartId } = req.params;
      const cart = await cartService.getCartById(cartId);
      res.json({ data: cart });
    } catch (err) { next(err); }
  },


  async addItem(req, res, next) {
    try {
      const { cartId } = req.params;
      const { productId, quantity } = req.body || {};
      if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity are required' });
      const updated = await cartService.addItem(cartId, { productId, quantity });
      res.json({ data: updated });
    } catch (err) { next(err); }
  },


  async removeItem(req, res, next) {
    try {
      const { cartId, itemId } = req.params;
      const updated = await cartService.removeItem(cartId, itemId);
      res.json({ data: updated });
    } catch (err) { next(err); }
  },


  async clear(req, res, next) {
    try {
      const { cartId } = req.params;
      await cartService.clearItems(cartId);
      res.status(204).end();
    } catch (err) { next(err); }
  },
};




