import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicLayout() {
  const { user } = useAuth();
  const dash = user ? { admin: '/admin', author: '/author', viewer: '/viewer' }[user.role] : '/login';

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-xl font-bold text-brand-700">
            BlogCMS
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/blogs" className="text-slate-600 hover:text-brand-600">
              Articles
            </Link>
            {user ? (
              <Link to={dash} className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-brand-600">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
