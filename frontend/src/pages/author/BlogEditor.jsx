import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    featured_image: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get('/my-blogs').then((r) => {
      const blog = (r.data.data || []).find((b) => String(b.id) === String(id));
      if (blog) {
        setForm({
          title: blog.title,
          excerpt: blog.excerpt || '',
          content: blog.content,
          category_id: blog.category_id || '',
          featured_image: blog.featured_image || '',
          status: blog.status === 'pending' ? 'draft' : blog.status,
        });
      }
    });
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, category_id: form.category_id || null };
      if (id) {
        await api.put(`/blogs/${id}`, payload);
        toast.success('Blog updated');
      } else {
        await api.post('/blogs', payload);
        toast.success('Blog created');
      }
      navigate('/author/blogs');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">{id ? 'Edit post' : 'New post'}</h1>
      <form onSubmit={save} className="mt-8 space-y-4">
        <input
          className="input-field"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Short excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <select
          className="input-field"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          className="input-field"
          placeholder="Featured image URL (optional)"
          value={form.featured_image}
          onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
        />
        <textarea
          className="input-field min-h-[280px] font-mono text-sm"
          placeholder="HTML content"
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <select
          className="input-field max-w-xs"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="draft">Save as draft</option>
        </select>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
