import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { ApprovalApi } from '../api/bffApprovalApi';


export default function RequestDetail() {
  const { productId } = useParams();
  const history = useHistory();
  const [request, setRequest] = useState(null);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);


  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      ApprovalApi.getRequestByProductId(productId),
      ApprovalApi.getAudit(productId)
    ])
      .then(([req, logs]) => {
        setRequest(req);
        setAudit(Array.isArray(logs) ? logs : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId]);


  useEffect(() => { load(); }, [load]);


  const approve = async () => {
    const stewardId = prompt('Enter Steward/Admin ID to confirm approval');
    if (!stewardId) return;
    try {
      setBusy(true);
      await ApprovalApi.approve(productId, stewardId);
      await load();
      alert('Approved');
    } catch (e) {
      alert(e.message || 'Approval failed');
    } finally { setBusy(false); }
  };


  const reject = async () => {
    const stewardId = prompt('Enter Steward/Admin ID');
    if (!stewardId) return;
    const reason = prompt('Enter rejection reason');
    if (!reason) return;
    try {
      setBusy(true);
      await ApprovalApi.reject(productId, stewardId, reason);
      await load();
      alert('Rejected');
    } catch (e) {
      alert(e.message || 'Rejection failed');
    } finally { setBusy(false); }
  };


  if (loading) return <div className="card">Loading…</div>;
  if (error) return <div className="card error">{error}</div>;
  if (!request) return <div className="card">No request found.</div>;


  const isPending = (request.status || '').toUpperCase() === 'PENDING';


  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-header">
          <h2>Product {productId}</h2>
          <Link to="/" className="btn">Back</Link>
        </div>
        <div className="detail">
          <div><strong>Status:</strong> <span className={`badge ${request.status?.toLowerCase()}`}>{request.status}</span></div>
          <div><strong>Supplier:</strong> {request.supplierId}</div>
          <div><strong>Steward:</strong> {request.stewardId || '-'}</div>
          <div><strong>Reason:</strong> {request.reason || '-'}</div>
          <div><strong>Created:</strong> {new Date(request.createdAt).toLocaleString()}</div>
          <div><strong>Updated:</strong> {new Date(request.updatedAt).toLocaleString()}</div>
        </div>
        <div className="actions">
          <button className="btn primary" disabled={!isPending || busy} onClick={approve}>Approve</button>
          <button className="btn danger" disabled={!isPending || busy} onClick={reject}>Reject</button>
        </div>
      </div>


      <div className="card">
        <div className="card-header">
          <h3>Audit Trail</h3>
        </div>
        <ul className="audit">
          {audit.map((log) => (
            <li key={log.id}>
              <div className="audit-line">
                <span className={`badge ${log.action?.toLowerCase()}`}>{log.action}</span>
                <span>by {log.actorId}</span>
                <span>on {new Date(log.createdAt).toLocaleString()}</span>
              </div>
              {log.details && <div className="muted">{log.details}</div>}
            </li>
          ))}
          {audit.length === 0 && <li className="muted">No audit logs.</li>}
        </ul>
      </div>
    </div>
  );
}






