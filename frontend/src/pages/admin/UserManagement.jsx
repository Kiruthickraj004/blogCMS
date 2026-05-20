import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = () =>
    api.get('/admin/users', { params: { role: roleFilter || undefined, search: search || undefined } }).then((r) =>
      setUsers(r.data.data || [])
    );

  useEffect(() => {
    load();
  }, [roleFilter, search]);

  const updateUser = async (id, payload) => {
    await api.patch(`/admin/users/${id}`, payload);
    toast.success('User updated');
    load();
  };

  const removeUser = async (id) => {
    if (!confirm('Remove this user? They will receive an email notification.')) return;
    await api.delete(`/admin/users/${id}`);
    toast.success('User removed');
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">User management</h1>
      <div className="mt-6 flex flex-wrap gap-4">
        <input
          className="input-field max-w-xs"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field max-w-xs" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="author">Author</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Blogs</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border px-2 py-1 text-xs"
                    value={u.role}
                    onChange={(e) => updateUser(u.id, { role: e.target.value })}
                  >
                    <option value="admin">admin</option>
                    <option value="author">author</option>
                    <option value="viewer">viewer</option>
                  </select>
                </td>
                <td className="px-4 py-3">{u.blogs_count}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className={`text-xs font-medium ${u.is_active ? 'text-emerald-600' : 'text-red-600'}`}
                    onClick={() => updateUser(u.id, { is_active: !u.is_active })}
                  >
                    {u.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="text-xs text-red-600" onClick={() => removeUser(u.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
