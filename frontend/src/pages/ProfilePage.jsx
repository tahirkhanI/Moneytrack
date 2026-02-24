import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 0);
  const [darkMode, setDarkMode] = useState(user?.darkMode || false);

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/auth/profile', { name, monthlyBudget: Number(monthlyBudget), darkMode });
    setUser(data);
  };

  return (
    <form onSubmit={submit} className="card max-w-lg space-y-3">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <input className="border p-2 rounded w-full" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 rounded w-full" type="number" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} /> Enable dark mode
      </label>
      <button className="bg-indigo-600 text-white px-3 py-2 rounded">Save Profile</button>
    </form>
  );
};

export default ProfilePage;
