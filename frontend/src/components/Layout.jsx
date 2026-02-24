import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = user?.darkMode;

  return (
    <div className={isDark ? 'dark min-h-screen text-slate-100 bg-slate-950' : 'min-h-screen text-slate-900 bg-slate-100'}>
      <nav className="p-4 bg-indigo-600 text-white flex gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/savings">Savings</Link>
          <Link to="/profile">Profile</Link>
        </div>
        {user && (
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-indigo-800 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </nav>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
