import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function BlogDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get(`/blogs/${slug}`).then((r) => {
      setBlog(r.data.blog);
      setLiked(r.data.liked);
    });
  }, [slug]);

  const toggleLike = async () => {
    if (!user) return toast.error('Sign in to like posts');
    const { data } = await api.post(`/blogs/${blog.id}/like`);
    setLiked(data.liked);
    toast.success(data.liked ? 'Liked!' : 'Like removed');
  };

  const toggleSubscribe = async () => {
    if (!user) return toast.error('Sign in to subscribe');
    const { data } = await api.post(`/authors/${blog.author.id}/subscribe`);
    setSubscribed(data.subscribed);
    toast.success(data.subscribed ? 'Subscribed!' : 'Unsubscribed');
  };

  if (!blog) return <p className="p-10 text-center text-slate-500">Loading...</p>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      {blog.category && (
        <span className="badge" style={{ backgroundColor: `${blog.category.color}20`, color: blog.category.color }}>
          {blog.category.name}
        </span>
      )}
      <h1 className="mt-4 font-display text-4xl font-bold">{blog.title}</h1>
      <p className="mt-2 text-slate-500">
        By {blog.author?.name} · {blog.views_count} views · {blog.likes_count} likes
      </p>
      <div className="prose prose-slate mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      {user && (
        <div className="mt-10 flex gap-3">
          <button type="button" onClick={toggleLike} className={liked ? 'btn-danger' : 'btn-primary'}>
            {liked ? 'Unlike' : 'Like'}
          </button>
          <button type="button" onClick={toggleSubscribe} className="btn-secondary">
            {subscribed ? 'Unsubscribe' : 'Subscribe to author'}
          </button>
        </div>
      )}
    </article>
  );
}
