import { useEffect, useState } from 'react';
import api from '../../api/client';
import BlogCard from '../../components/BlogCard';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/blogs', { params: { category: category || undefined, search: search || undefined } })
      .then((r) => setBlogs(r.data.data || []))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">All articles</h1>
      <div className="mt-6 flex flex-wrap gap-4">
        <input
          type="search"
          placeholder="Search posts..."
          className="input-field max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field max-w-xs" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name} ({c.blogs_count})
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="mt-10 text-slate-500">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
}
