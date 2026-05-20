import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

export default function Sidebar() {
  const { user, isAdmin, isAuthor, isViewer, logout } = useAuth();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/pending', label: 'Pending Review' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stats', label: 'Analytics' },
    { to: '/author/blogs', label: 'All Blogs' },
  ];

  const authorLinks = [
    { to: '/author', label: 'Dashboard', end: true },
    { to: '/author/blogs', label: 'My Blogs' },
    { to: '/author/new', label: 'Write Post' },
  ];

  const viewerLinks = [
    { to: '/viewer', label: 'Dashboard', end: true },
    { to: '/viewer/liked', label: 'Liked' },
    { to: '/viewer/subscriptions', label: 'Subscriptions' },
    { to: '/blogs', label: 'Browse' },
  ];

  const links = isAdmin ? adminLinks : isAuthor ? authorLinks : isViewer ? viewerLinks : [];

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-6">
        <p className="font-display text-lg font-bold text-brand-700">BlogCMS</p>
        <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
        <span className="mt-2 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-700">
          {user?.role}
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <NavLink to="/" className={linkClass} end>
          Public Home
        </NavLink>
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} end={item.end}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <button type="button" onClick={logout} className="btn-secondary w-full text-sm">
          Sign out
        </button>
      </div>
    </aside>
  );
}
