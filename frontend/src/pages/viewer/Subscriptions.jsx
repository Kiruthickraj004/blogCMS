import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function Subscriptions() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    api.get('/subscriptions').then((r) => setAuthors(r.data.authors || []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Your subscriptions</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {authors.map((a) => (
          <div key={a.id} className="card">
            <h2 className="font-semibold">{a.name}</h2>
            <p className="text-sm text-slate-500">{a.blogs_count} published posts · {a.subscribers_count} subscribers</p>
            <Link to={`/blogs?author_id=${a.id}`} className="mt-3 text-sm text-brand-600">
              View posts →
            </Link>
          </div>
        ))}
        {authors.length === 0 && (
          <p className="text-slate-500">Subscribe to authors from any blog post page.</p>
        )}
      </div>
    </div>
  );
}
