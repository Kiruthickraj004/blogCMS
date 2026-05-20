import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/public/Home';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingBlogs from './pages/admin/PendingBlogs';
import UserManagement from './pages/admin/UserManagement';
import AdminStats from './pages/admin/AdminStats';
import AuthorDashboard from './pages/author/AuthorDashboard';
import MyBlogs from './pages/author/MyBlogs';
import BlogEditor from './pages/author/BlogEditor';
import ViewerDashboard from './pages/viewer/ViewerDashboard';
import LikedBlogs from './pages/viewer/LikedBlogs';
import Subscriptions from './pages/viewer/Subscriptions';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="blogs/:slug" element={<BlogDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute roles={['admin', 'author', 'viewer']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/pending" element={<ProtectedRoute roles={['admin']}><PendingBlogs /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="admin/stats" element={<ProtectedRoute roles={['admin']}><AdminStats /></ProtectedRoute>} />
        <Route path="author" element={<ProtectedRoute roles={['author', 'admin']}><AuthorDashboard /></ProtectedRoute>} />
        <Route path="author/blogs" element={<ProtectedRoute roles={['author', 'admin']}><MyBlogs /></ProtectedRoute>} />
        <Route path="author/new" element={<ProtectedRoute roles={['author', 'admin']}><BlogEditor /></ProtectedRoute>} />
        <Route path="author/edit/:id" element={<ProtectedRoute roles={['author', 'admin']}><BlogEditor /></ProtectedRoute>} />
        <Route path="viewer" element={<ProtectedRoute roles={['viewer']}><ViewerDashboard /></ProtectedRoute>} />
        <Route path="viewer/liked" element={<ProtectedRoute roles={['viewer', 'author', 'admin']}><LikedBlogs /></ProtectedRoute>} />
        <Route path="viewer/subscriptions" element={<ProtectedRoute roles={['viewer', 'author', 'admin']}><Subscriptions /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
