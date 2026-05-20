import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
  return (
    <article className="card group flex flex-col transition hover:shadow-md">
      {blog.featured_image && (
        <img
          src={blog.featured_image}
          alt=""
          className="mb-4 h-40 w-full rounded-lg object-cover"
        />
      )}
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        {blog.category && (
          <span
            className="badge"
            style={{ backgroundColor: `${blog.category.color}20`, color: blog.category.color }}
          >
            {blog.category.name}
          </span>
        )}
        <span>{blog.author?.name}</span>
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-brand-600">
        <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-2">{blog.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{blog.likes_count ?? 0} likes</span>
        <span>{blog.views_count ?? 0} views</span>
      </div>
    </article>
  );
}
