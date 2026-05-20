import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AuthorDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/author/stats').then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Author dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Published</p>
          <p className="text-2xl font-bold">{stats.blogs.published}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.blogs.pending}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Subscribers</p>
          <p className="text-2xl font-bold">{stats.engagement.subscribers}</p>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <Link to="/author/new" className="btn-primary">
          Write new post
        </Link>
        <Link to="/author/blogs" className="btn-secondary">
          Manage posts
        </Link>
      </div>
      <div className="mt-10 card">
        <h2 className="font-semibold">Top performing posts</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {stats.recent_performance?.map((b) => (
            <li key={b.id} className="flex justify-between">
              <span>{b.title}</span>
              <span className="text-slate-500">{b.views_count} views</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
