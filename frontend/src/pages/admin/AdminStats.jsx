import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p className="text-slate-500">Loading analytics...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Platform analytics</h1>
      <p className="text-sm text-slate-500">Cached stats refresh every 5 minutes</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Users by role</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Admins: {stats.users.admins}</li>
            <li>Authors: {stats.users.authors}</li>
            <li>Viewers: {stats.users.viewers}</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold">Blog pipeline</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Published: {stats.blogs.published}</li>
            <li>Pending: {stats.blogs.pending}</li>
            <li>Drafts: {stats.blogs.draft}</li>
            <li>Rejected: {stats.blogs.rejected}</li>
          </ul>
        </div>
        <div className="card lg:col-span-2">
          <h2 className="font-semibold">Top categories</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {stats.top_categories?.map((c) => (
              <span
                key={c.id}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{ backgroundColor: `${c.color}15`, color: c.color }}
              >
                {c.name} ({c.blogs_count})
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold">Engagement</h2>
          <p className="mt-4 text-3xl font-bold text-brand-700">{stats.engagement.total_views}</p>
          <p className="text-sm text-slate-500">Total page views</p>
          <p className="mt-4 text-2xl font-bold">{stats.engagement.total_likes}</p>
          <p className="text-sm text-slate-500">Total likes</p>
        </div>
      </div>
    </div>
  );
}
