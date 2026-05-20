import { useEffect, useState } from 'react';
import api from '../../api/client';
import BlogCard from '../../components/BlogCard';

export default function LikedBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get('/liked-blogs').then((r) => setBlogs(r.data.data || []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Liked articles</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b) => (
          <BlogCard key={b.id} blog={b} />
        ))}
        {blogs.length === 0 && <p className="text-slate-500">No liked posts yet.</p>}
      </div>
    </div>
  );
}
