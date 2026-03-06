import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

export default function PlatformApprovals() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.apiRequest('/super-admin/tenants');
        if (!cancelled) setTenants(res.tenants || []);
      } catch (e) {
        if (!cancelled) setError('Failed to load tenants');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const approve = async (id) => {
    try {
      await api.apiRequest(`/super-admin/tenants/${id}`, { method: 'PATCH', body: { status: 'ACTIVE' } });
      setTenants(t => t.map(x => x.id === id ? { ...x, status: 'ACTIVE' } : x));
    } catch (e) {
      alert('Failed to approve tenant');
    }
  };

  if (loading) return <div className="p-6">Loading pending tenants...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const pending = tenants.filter(t => (t.status || '').toUpperCase() === 'PENDING');

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold mb-4">Pending Tenant Approvals</h3>
      {pending.length === 0 ? (
        <div className="text-gray-500 italic">No pending tenant requests</div>
      ) : (
        <div className="space-y-4">
          {pending.map(t => (
            <div key={t.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold">{t.name}</div>
                <div className="text-sm text-gray-500">{t.slug}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => approve(t.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

