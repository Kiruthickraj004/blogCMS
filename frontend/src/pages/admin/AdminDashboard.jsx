import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/pending-blogs', { params: { per_page: 5 } }).then((r) => setPending(r.data.data || []));
  }, []);

  if (!stats) return <p className="text-slate-500">Loading dashboard...</p>;

  const cards = [
    { label: 'Total users', value: stats.users.total, href: '/admin/users' },
    { label: 'Published blogs', value: stats.blogs.published, href: '/blogs' },
    { label: 'Pending review', value: stats.blogs.pending, href: '/admin/pending' },
    { label: 'Total likes', value: stats.engagement.total_likes, href: '/admin/stats' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Admin dashboard</h1>
      <p className="mt-1 text-slate-500">Platform overview and moderation queue</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.href} className="card hover:border-brand-200">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-700">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 card">
        <h2 className="font-semibold">Pending approval</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {pending.length === 0 ? (
            <li className="py-4 text-sm text-slate-500">No pending blogs</li>
          ) : (
            pending.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3">
                <span>{b.title}</span>
                <span className="text-xs text-slate-500">{b.author?.name}</span>
              </li>
            ))
          )}
        </ul>
        <Link to="/admin/pending" className="mt-4 inline-block text-sm text-brand-600">
          View all →
        </Link>
      </div>
    </div>
  );
}
