import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-6">
        <h1 className="text-sm font-medium text-slate-500">Blog Management System</h1>
        <Link to="/blogs" className="text-sm text-brand-600 hover:text-brand-700">
          Browse posts →
        </Link>
        {user && (
          <span className="text-sm text-slate-600">
            Signed in as <strong>{user.name}</strong>
          </span>
        )}
      </div>
    </header>
  );
}
