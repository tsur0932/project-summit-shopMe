import React, { useEffect, useMemo, useState } from "react";
import "./supplier.css";
import { supplierApi } from "./api";


export default function Root() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    producerInfo: "",
    stockCount: "",
    categoryId: "",
  });

  const isValid = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      String(form.price).trim() !== "" &&
      String(form.stockCount).trim() !== "" &&
      String(form.categoryId).trim() !== ""
    );
  }, [form]);


  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await supplierApi.getAllProducts();
      const list = res?.data ?? res ?? [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadAll();
  }, []);


  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", price: "", description: "", producerInfo: "", stockCount: "", categoryId: "" });
  };


  const onEdit = (p) => {
    setEditingId(p.id ?? p.productId);
    setForm({
      name: p.name ?? "",
      price: p.price ?? "",
      description: p.description ?? "",
      producerInfo: p.producerInfo ?? "",
      stockCount: p.stockCount ?? p.stock_count ?? "",
      categoryId: p.categoryId ?? (p.category?.categoryId ?? ""),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    setError("");
    try {
      await supplierApi.deleteProduct(id);
      await loadAll();
    } catch (e) {
      setError(e.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description || null,
      producerInfo: form.producerInfo || null,
      stockCount: Number(form.stockCount),
      category: { categoryId: Number(form.categoryId) },
    };


    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await supplierApi.updateProduct(editingId, payload);
      } else {
        await supplierApi.addProduct(payload);
      }
      resetForm();
      await loadAll();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="supplier-wrap">
      <header className="supplier-header">
        <h1>Supplier Dashboard</h1>
        <p>Manage your products</p>
      </header>


      <section className="supplier-content">
        <div className="form-card">
          <h2 className="section-title">{editingId ? "Update Product" : "Add New Product"}</h2>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={onSubmit} className="product-form">
            <div className="row">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Apple"
                  required
                />
              </label>
              <label>
                <span>Price</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 15.00"
                  required
                />
              </label>
            </div>


            <div className="row">
              <label>
                <span>Stock Count</span>
                <input
                  type="number"
                  value={form.stockCount}
                  onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
                  placeholder="e.g. 50"
                  required
                />
              </label>
              <label>
                <span>Category ID</span>
                <input
                  type="number"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  placeholder="e.g. 1 for Fruits, 2 for Vegetables"
                  required
                />
              </label>
            </div>


            <div className="row">
              <label className="col">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description"
                />
              </label>
            </div>


            <div className="row">
              <label className="col">
                <span>Producer Info</span>
                <input
                  type="text"
                  value={form.producerInfo}
                  onChange={(e) => setForm({ ...form, producerInfo: e.target.value })}
                  placeholder="e.g. Imported"
                />
              </label>
            </div>


            <div className="actions">
              <button type="submit" className="btn primary" disabled={!isValid || loading}>
                {editingId ? "Update" : "Add Product"}
              </button>
              {editingId && (
                <button type="button" className="btn ghost" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>


        <div className="list-card">
          <div className="list-header">
            <h2 className="section-title">All Products</h2>
            <button className="btn ghost" onClick={loadAll} disabled={loading}>
              Refresh
            </button>
          </div>


          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products || []).map((p) => (
                  <tr key={p.id ?? p.productId}>
                    <td>{p.id ?? p.productId}</td>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.stockCount ?? p.stock_count}</td>
                    <td>{p.categoryId ?? (p.category?.categoryId ?? "-")}</td>
                    <td>{p.status}</td>
                    <td className="row-actions">
                      <button className="btn small" onClick={() => onEdit(p)}>Edit</button>
                      <button className="btn danger small" onClick={() => onDelete(p.id ?? p.productId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

