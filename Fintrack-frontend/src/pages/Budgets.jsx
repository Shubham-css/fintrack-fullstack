import { useState, useEffect } from 'react';
import { Target, AlertCircle, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Food',
    amount: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetRes, txRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/transactions')
      ]);
      setBudgets(budgetRes.data);
      setTransactions(txRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/budgets', formData);
      
      setBudgets((prev) => {
        const exists = prev.find(b => b.category === response.data.category);
        if (exists) {
          return prev.map(b => b.category === response.data.category ? response.data : b);
        }
        return [...prev, response.data];
      });

      resetForm();
      
      // 👈 NEW: Send the walkie-talkie signal to the Topbar!
      window.dispatchEvent(new Event('financial-data-changed'));
      
    } catch (error) {
      console.error("Failed to set budget", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget limit?")) {
      try {
        await api.delete(`/budgets/${id}`);
        setBudgets(budgets.filter(b => b.id !== id));
        
        // 👈 NEW: Send the walkie-talkie signal to the Topbar!
        window.dispatchEvent(new Event('financial-data-changed'));
        
      } catch (error) {
        console.error("Failed to delete budget", error);
      }
    }
  };

  const handleEdit = (budget) => {
    setIsEditing(true);
    setFormData({
      category: budget.category,
      amount: budget.amount
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({ category: 'Food', amount: '' });
  };

  const getBudgetProgress = (budget) => {
    const spent = transactions
      .filter(tx => tx.type === 'EXPENSE' && tx.category === budget.category)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const percentage = (spent / budget.amount) * 100;
    const isExceeded = spent > budget.amount;

    return { spent, percentage, isExceeded };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textMain">Budget Management</h1>
        <p className="text-textMuted text-sm">Set category limits and track your spending.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Form */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine lg:col-span-1 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{isEditing ? 'Update Budget' : 'Set a Budget'}</h2>
            {isEditing && (
              <button onClick={resetForm} className="text-textMuted hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSetBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                disabled={isEditing}
                className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Monthly Limit ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-borderLine focus:ring-2 focus:ring-primary/50 outline-none" 
                placeholder="500.00" 
              />
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 mt-4">
              <Target size={20} /> {isEditing ? 'Save Changes' : 'Save Budget'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Budget Cards */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-textMuted p-6">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="bg-card p-8 rounded-2xl border border-borderLine text-center text-textMuted shadow-sm">
              No budgets set yet. Create one on the left!
            </div>
          ) : (
            budgets.map((budget) => {
              const { spent, percentage, isExceeded } = getBudgetProgress(budget);
              const barWidth = percentage > 100 ? 100 : percentage;

              return (
                <div key={budget.id} className="bg-card p-6 rounded-2xl shadow-sm border border-borderLine group relative overflow-hidden">
                  
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(budget)}
                      className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors shadow-sm"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(budget.id)}
                      className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mb-2 pr-20">
                    <div>
                      <h3 className="text-lg font-bold text-textMain">{budget.category}</h3>
                      <p className="text-sm text-textMuted">
                        Spent {formatCurrency(spent)} of {formatCurrency(budget.amount)}
                      </p>
                    </div>
                    
                    {isExceeded ? (
                      <div className="flex items-center text-red-500 text-sm font-medium gap-1">
                        <AlertCircle size={16} /> Budget Exceeded!
                      </div>
                    ) : (
                      <div className="flex items-center text-primary text-sm font-medium gap-1">
                        <CheckCircle2 size={16} /> On Track
                      </div>
                    )}
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-3 mt-4 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${isExceeded ? 'bg-red-500' : 'bg-primary'}`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}