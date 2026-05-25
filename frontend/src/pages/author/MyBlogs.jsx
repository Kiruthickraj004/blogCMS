import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function MyBlogs() {
  const { isAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);

  const load = () =>
    api.get('/my-blogs', { params: { all: isAdmin ? 1 : undefined } }).then((r) => setBlogs(r.data.data || []));

  useEffect(() => {
    load();
  }, [isAdmin]);

  const submit = async (id) => {
    await api.post(`/blogs/${id}/submit`);
    toast.success('Submitted for admin review');
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this blog?')) return;
    await api.delete(`/blogs/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{isAdmin ? 'All blogs' : 'My blogs'}</h1>
        <Link to="/author/new" className="btn-primary">
          New post
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {blogs.map((b) => (
          <div key={b.id} className="card flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">{b.title}</h2>
              <StatusBadge status={b.status} />
              <p className="mt-1 text-xs text-slate-500">{b.likes_count} likes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {!isAdmin && (
                <>
                  <Link to={`/author/edit/${b.id}`} className="btn-secondary text-sm">
                    Edit
                  </Link>
                  {['draft', 'rejected'].includes(b.status) && (
                    <button type="button" className="btn-primary text-sm" onClick={() => submit(b.id)}>
                      Submit for review
                    </button>
                  )}
                </>
              )}
              <button type="button" className="btn-danger text-sm" onClick={() => remove(b.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
