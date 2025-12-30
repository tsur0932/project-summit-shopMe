import { productService } from '../services/productService.js';


export const productsController = {
  async getAll(req, res, next) {
    try {
      const list = await productService.getAllProducts();
      res.json({ data: list });
    } catch (err) { next(err); }
  },


  async getCategories(_req, res, next) {
    try {
      const categories = await productService.getCategories();
      res.json({ data: categories });
    } catch (err) { next(err); }
  },


  async addSupplier(req, res, next) {
    console.log('addSupplier called');
    try {
      const auth = req.headers['authorization'] ? { Authorization: req.headers['authorization'] } : {};
      const created = await productService.addSupplierProduct(req.body, auth);
      res.status(201).json({ data: created });
    } catch (err) { next(err); }
  },

//   async addSupplier(req, res, next) {
//   try {
//     const auth = req.headers['authorization']
//       ? { Authorization: req.headers['authorization'] }
//       : {};

//     // req.body.product might be a string if frontend sent it correctly
//     let product;

//     if (req.body.product) {
//       try {
//         product = JSON.parse(req.body.product);
//       } catch (err) {
//         console.error("Failed to parse product JSON", req.body.product);
//         throw new Error("Invalid JSON in 'product' field");
//       }
//     } else {
//       throw new Error("Product field missing in request");
//     }

//     const imageFile = req.file || null;

//     const created = await productService.addSupplierProduct(product, imageFile, auth);

//     res.status(201).json({ data: created });
//   } catch (err) {
//     next(err);
//   }
// },

  async updateSupplier(req, res, next) {
    try {
      const { productId } = req.params;
      const auth = req.headers['authorization'] ? { Authorization: req.headers['authorization'] } : {};
      const updated = await productService.updateSupplierProduct(productId, req.body, auth);
      res.json({ data: updated });
    } catch (err) { next(err); }
  },


  async deleteSupplier(req, res, next) {
    try {
      const { productId } = req.params;
      const auth = req.headers['authorization'] ? { Authorization: req.headers['authorization'] } : {};
      await productService.deleteSupplierProduct(productId, auth);
      res.status(204).end();
    } catch (err) { next(err); }
  },


  async getByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const list = await productService.getProductsByCategory(categoryId);
      res.json({ data: list });
    } catch (err) { next(err); }
  },


  async search(req, res, next) {
    try {
      const { productName } = req.query;
      if (!productName || String(productName).trim() === '') {
        return res.status(400).json({ error: 'productName query is required' });
      }
      const list = await productService.searchProducts(productName);
      res.json({ data: list });
    } catch (err) { next(err); }
  },


  async getById(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(productId);
      res.json({ data: product });
    } catch (err) { next(err); }
  },
};






