import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { exportPDF } from '../utils/export';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#14b8a6'];

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/analytics/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  const budget = user?.monthlyBudget || 0;
  const spentPercentage = budget ? (data.totalExpenses / budget) * 100 : 0;
  const warning = spentPercentage >= 100 ? 'Budget exceeded!' : spentPercentage >= 75 ? 'Budget warning: above 75%' : 'Budget healthy';

  const pieData = Object.entries(data.byCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Finance Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><p>Total Income</p><h2 className="text-2xl font-bold text-green-600">${data.totalIncome.toFixed(2)}</h2></div>
        <div className="card"><p>Total Expenses</p><h2 className="text-2xl font-bold text-red-600">${data.totalExpenses.toFixed(2)}</h2></div>
        <div className="card"><p>Net Balance</p><h2 className="text-2xl font-bold">${data.netBalance.toFixed(2)}</h2></div>
      </div>

      <div className="card">
        <p className="font-semibold">Monthly Budget Progress</p>
        <div className="w-full bg-slate-300 rounded h-3 mt-2">
          <div className={`h-3 rounded ${spentPercentage >= 100 ? 'bg-red-500' : spentPercentage >= 75 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(spentPercentage, 100)}%` }} />
        </div>
        <p className="text-sm mt-2">{warning} ({spentPercentage.toFixed(1)}%)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card h-72">
          <p className="font-semibold">Income vs Expenses Trend</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#22c55e" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card h-72">
          <p className="font-semibold">Expense Categories</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm">Top spending category: <span className="font-bold">{data.topSpendingCategory}</span></p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Recent Transactions</p>
          <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => exportPDF(data)}>Export PDF</button>
        </div>
        <ul className="mt-2 space-y-1">
          {data.recentTransactions.map((t) => (
            <li key={t._id} className="flex justify-between border-b py-1 text-sm">
              <span>{t.category} ({t.type})</span><span>${t.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
