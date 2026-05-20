import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import BlogCard from '../../components/BlogCard';

export default function ViewerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/viewer/dashboard').then((r) => setData(r.data));
  }, []);

  if (!data) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Your reading hub</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card">
          <p className="text-sm text-slate-500">Liked articles</p>
          <p className="text-2xl font-bold">{data.stats.liked_blogs}</p>
          <Link to="/viewer/liked" className="mt-2 text-sm text-brand-600">
            View liked →
          </Link>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Subscriptions</p>
          <p className="text-2xl font-bold">{data.stats.subscriptions}</p>
          <Link to="/viewer/subscriptions" className="mt-2 text-sm text-brand-600">
            Manage →
          </Link>
        </div>
      </div>
      <section className="mt-10">
        <h2 className="font-semibold">Suggested for you</h2>
        <p className="text-sm text-slate-500">Based on your likes and subscriptions</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.suggestions?.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      </section>
      {data.recent_from_subscriptions?.length > 0 && (
        <section className="mt-10">
          <h2 className="font-semibold">From authors you follow</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {data.recent_from_subscriptions.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
