import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 🧮 1. Calculate KPI Totals
  const totalIncome = transactions
    .filter(tx => tx.type === 'INCOME')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // 📈 2. Generate Chart Data (Running Balance over time)
  const generateChartData = () => {
    if (transactions.length === 0) return [];

    // Sort transactions from oldest to newest
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let runningBalance = 0;
    const dataMap = {}; 

    // Aggregate balance by month
    sorted.forEach(tx => {
      const date = new Date(tx.date);
      // Format as "Jan 26"
      const monthYear = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });

      if (tx.type === 'INCOME') runningBalance += tx.amount;
      if (tx.type === 'EXPENSE') runningBalance -= tx.amount;

      // Overwrite with the latest balance for that month
      dataMap[monthYear] = runningBalance;
    });

    // Convert our map into the array format Recharts expects
    return Object.keys(dataMap).map(key => ({
      name: key,
      balance: dataMap[key]
    }));
  };

  const chartData = generateChartData();

  if (loading) {
    return <div className="p-8 text-textMuted text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Dashboard Overview</h1>
        <p className="text-textMuted text-sm">Welcome back! Here is your real-time financial summary.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Balance Card */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-textMuted">Total Balance</p>
            <p className={`text-2xl font-bold ${totalBalance < 0 ? 'text-red-500' : 'text-textMain'}`}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-500">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-textMuted">Total Income</p>
            <p className="text-2xl font-bold text-textMain">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine flex items-center gap-4">
          <div className="p-4 bg-red-50 rounded-full text-red-500">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-textMuted">Total Expenses</p>
            <p className="text-2xl font-bold text-textMain">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine h-96 flex flex-col">
        <h2 className="text-lg font-bold mb-6">Balance History</h2>
        
        {chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-textMuted">
            Add some transactions to see your history chart!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280' }} 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), "Balance"]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}