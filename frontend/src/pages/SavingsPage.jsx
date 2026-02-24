import { useEffect, useState } from 'react';
import api from '../api/client';

const SavingsPage = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '' });
  const [contrib, setContrib] = useState({});

  const loadGoals = () => api.get('/savings-goals').then((res) => setGoals(res.data));
  useEffect(() => { loadGoals(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Savings Goals</h1>
      <form
        className="card grid md:grid-cols-4 gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await api.post('/savings-goals', { ...form, targetAmount: Number(form.targetAmount) });
          setForm({ title: '', targetAmount: '', deadline: '' });
          loadGoals();
        }}
      >
        <input className="border p-2 rounded" placeholder="Goal title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="border p-2 rounded" type="number" placeholder="Target amount" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required />
        <input className="border p-2 rounded" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        <button className="bg-indigo-600 text-white rounded">Create Goal</button>
      </form>

      {goals.map((goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        return (
          <div key={goal._id} className="card">
            <div className="flex justify-between">
              <h3 className="font-semibold">{goal.title}</h3>
              <button className="text-red-500" onClick={async () => { await api.delete(`/savings-goals/${goal._id}`); loadGoals(); }}>Delete</button>
            </div>
            <p className="text-sm">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</p>
            <div className="w-full bg-slate-300 h-3 rounded mt-2"><div className="bg-green-500 h-3 rounded" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
            <div className="mt-2 flex gap-2">
              <input className="border p-1 rounded" type="number" placeholder="Contribution" value={contrib[goal._id] || ''} onChange={(e) => setContrib({ ...contrib, [goal._id]: e.target.value })} />
              <button
                className="bg-emerald-600 text-white px-3 rounded"
                onClick={async () => {
                  await api.post(`/savings-goals/${goal._id}/contribute`, { amount: Number(contrib[goal._id] || 0) });
                  setContrib({ ...contrib, [goal._id]: '' });
                  loadGoals();
                }}
              >
                Add
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavingsPage;
