import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, formData);
      } else {
        await api.post('/transactions', formData);
      }
      
      fetchTransactions();
      resetForm();
      
      // 👈 NEW: Send the walkie-talkie signal to the Topbar!
      window.dispatchEvent(new Event('financial-data-changed'));
      
    } catch (error) {
      console.error("Failed to save transaction", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
        
        // 👈 NEW: Send the walkie-talkie signal to the Topbar!
        window.dispatchEvent(new Event('financial-data-changed'));
        
      } catch (error) {
        console.error("Failed to delete transaction", error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      amount: '',
      type: 'EXPENSE',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textMain">Transactions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORM SECTION */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine lg:col-span-1 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Edit Transaction' : 'Add New'}</h2>
            {editingId && (
              <button onClick={resetForm} className="text-textMuted hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Amount</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="Food">Food</option>
                  <option value="Salary">Salary</option>
                  <option value="Transport">Transport</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
              {editingId ? 'Update Transaction' : <><Plus size={20} /> Add Transaction</>}
            </button>
          </form>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine lg:col-span-2">
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
              <select 
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none appearance-none bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="INCOME">Income Only</option>
                <option value="EXPENSE">Expense Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-borderLine text-textMuted text-sm">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-textMuted">Loading data...</td></tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-textMuted">No transactions found.</td></tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-borderLine/50 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 font-medium text-textMain">{tx.title}</td>
                      <td className="py-4 text-textMuted">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">{tx.category}</span>
                      </td>
                      <td className="py-4 text-textMuted text-sm">{formatDate(tx.date)}</td>
                      <td className={`py-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-primary' : 'text-red-500'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(tx)} 
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(tx.id)} 
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}