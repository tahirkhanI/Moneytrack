import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ mode = 'login' }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form, mode === 'login' ? 'login' : 'register');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={submit} className="card w-full max-w-md space-y-3">
        <h1 className="text-2xl font-bold">{mode === 'login' ? 'Login' : 'Create account'}</h1>
        {mode === 'register' && (
          <input className="w-full border p-2 rounded" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">{mode === 'login' ? 'Login' : 'Register'}</button>
        <p className="text-sm">
          {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
          <Link className="text-indigo-600" to={mode === 'login' ? '/register' : '/login'}>
            {mode === 'login' ? 'Register' : 'Login'}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
