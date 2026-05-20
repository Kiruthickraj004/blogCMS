import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import BlogCard from '../../components/BlogCard';

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get('/blogs', { params: { per_page: 6, sort: 'popular' } }).then((r) => setBlogs(r.data.data || []));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-indigo-600 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Publish, review, and discover great stories
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            A role-based blog CMS with Laravel Sanctum, SMTP notifications, and personalized reader feeds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/blogs" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700">
              Explore articles
            </Link>
            <Link to="/register" className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white">
              Get started
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold">Trending posts</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
