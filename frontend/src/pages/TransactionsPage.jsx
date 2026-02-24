import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { exportCSV } from '../utils/export';

const defaultForm = {
  type: 'expense',
  amount: '',
  source: '',
  category: '',
  paymentMethod: '',
  date: new Date().toISOString().slice(0, 10),
  notes: ''
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const { data } = await api.get('/transactions', { params: { search, category } });
    setTransactions(data);
  };

  useEffect(() => {
    fetchData();
  }, [search, category]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (editingId) await api.put(`/transactions/${editingId}`, payload);
    else await api.post('/transactions', payload);
    setForm(defaultForm);
    setEditingId(null);
    fetchData();
  };

  const categories = useMemo(() => [...new Set(transactions.map((t) => t.category))], [transactions]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <form onSubmit={submit} className="card grid md:grid-cols-3 gap-2">
        <select className="border p-2 rounded" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="income">Income</option><option value="expense">Expense</option></select>
        <input className="border p-2 rounded" placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Source (for income)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Payment method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
        <input className="border p-2 rounded" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input className="border p-2 rounded md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="bg-indigo-600 text-white rounded px-3">{editingId ? 'Update' : 'Add'} Transaction</button>
      </form>

      <div className="card flex flex-wrap gap-2 items-center">
        <input className="border p-2 rounded" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="bg-emerald-600 text-white px-3 py-2 rounded" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th /></tr></thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-t">
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td className="space-x-2">
                  <button className="text-indigo-600" onClick={() => { setForm({ ...t, date: t.date.slice(0, 10) }); setEditingId(t._id); }}>Edit</button>
                  <button className="text-red-600" onClick={async () => { await api.delete(`/transactions/${t._id}`); fetchData(); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
