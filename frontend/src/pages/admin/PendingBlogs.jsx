import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

export default function PendingBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [reason, setReason] = useState({});

  const load = () => api.get('/admin/pending-blogs').then((r) => setBlogs(r.data.data || []));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.post(`/admin/blogs/${id}/approve`);
    toast.success('Blog approved');
    load();
  };

  const reject = async (id) => {
    const rejection_reason = reason[id];
    if (!rejection_reason?.trim()) return toast.error('Enter a rejection reason');
    await api.post(`/admin/blogs/${id}/reject`, { rejection_reason });
    toast.success('Blog rejected — author emailed');
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Pending review</h1>
      <div className="mt-8 space-y-6">
        {blogs.map((b) => (
          <div key={b.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{b.title}</h2>
                <p className="text-sm text-slate-500">
                  {b.author?.name} · {b.category?.name}
                </p>
                <StatusBadge status={b.status} />
              </div>
              <button type="button" onClick={() => approve(b.id)} className="btn-primary">
                Approve
              </button>
            </div>
            <div className="prose prose-sm mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: b.content?.slice(0, 500) + '...' }} />
            <div className="mt-4 flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Rejection reason (required to reject)"
                value={reason[b.id] || ''}
                onChange={(e) => setReason({ ...reason, [b.id]: e.target.value })}
              />
              <button type="button" onClick={() => reject(b.id)} className="btn-danger">
                Reject
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-slate-500">Queue is empty.</p>}
      </div>
    </div>
  );
}
