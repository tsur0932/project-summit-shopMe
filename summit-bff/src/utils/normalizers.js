export function normalizeCategory(c) {
  if (!c) return c;
  return {
    id: c.categoryId ?? c.category_id ?? c.id,
    name: c.name,
  };
}


export function normalizeProduct(p) {
  if (!p) return p;
  return {
    id: p.productId ?? p.product_id ?? p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    producerInfo: p.producerInfo ?? p.producer_info,
    stock_count: p.stockCount ?? p.stock_count,
    status: p.status,
    categoryId: p.category?.categoryId ?? p.category_id ?? p.categoryId,
    approved: p.approved,
  };
}






