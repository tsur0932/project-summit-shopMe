import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ApprovalApi } from '../api/bffApprovalApi';


export default function PendingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');


  useEffect(() => {
    let mounted = true;
    setLoading(true);
    ApprovalApi.getPending()
      .then((data) => {
        if (mounted) setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);


  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((x) =>
      String(x.productId).includes(q) ||
      (x.supplierId || '').toLowerCase().includes(q) ||
      (x.status || '').toLowerCase().includes(q)
    );
  }, [items, query]);


  if (loading) return <div className="card">Loading pending approvals…</div>;
  if (error) return <div className="card error">{error}</div>;


  return (
    <div className="card">
      <div className="card-header">
        <h2>Pending Approvals</h2>
        <input
          className="input"
          placeholder="Search by product id or supplier"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td>{r.productId}</td>
              <td>{r.supplierId}</td>
              <td><span className={`badge ${r.status?.toLowerCase()}`}>{r.status}</span></td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>
                <Link to={`/products/${r.productId}`} className="btn">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="empty">No pending requests.</div>
      )}
    </div>
  );
}






