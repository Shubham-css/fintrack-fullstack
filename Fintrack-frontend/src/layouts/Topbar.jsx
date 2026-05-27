import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, Settings, CreditCard, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ transactions: [], budgets: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 'welcome', text: "Welcome to FinTrack!", time: "Just now", unread: true }
  ]);

  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👈 UPDATED: The Notification Logic now listens for changes!
  useEffect(() => {
    const checkBudgetAlerts = async () => {
      try {
        const [budgetRes, txRes] = await Promise.all([
          api.get('/budgets'),
          api.get('/transactions')
        ]);
        
        const budgets = budgetRes.data;
        const transactions = txRes.data;
        let newAlerts = [];

        budgets.forEach(budget => {
          const spent = transactions
            .filter(tx => tx.type === 'EXPENSE' && tx.category === budget.category)
            .reduce((acc, curr) => acc + curr.amount, 0);

          if (spent > budget.amount) {
            newAlerts.push({
              id: `alert-${budget.id}`,
              text: `⚠️ You exceeded your ${budget.category} budget by ${formatCurrency(spent - budget.amount)}!`,
              time: "Just now",
              unread: true // Always marks as unread when a fresh violation happens
            });
          }
        });

        // Update notifications state
        setNotifications(prev => {
          const nonAlerts = prev.filter(n => !n.id.toString().startsWith('alert-'));
          return [...newAlerts, ...nonAlerts];
        });

      } catch (error) {
        console.error("Failed to fetch notification data", error);
      }
    };

    // 1. Check once when the component first loads
    checkBudgetAlerts();

    // 2. 👈 The Walkie-Talkie Listener: Listen for changes from other pages!
    window.addEventListener('financial-data-changed', checkBudgetAlerts);

    // Cleanup listener on unmount
    return () => window.removeEventListener('financial-data-changed', checkBudgetAlerts);
  }, []); 

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ transactions: [], budgets: [] });
      setShowSearchResults(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get(`/search?query=${searchQuery}`);
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('fintrack_token');
    navigate('/');
    window.location.reload(); 
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);
  const hasResults = searchResults.transactions.length > 0 || searchResults.budgets.length > 0;

  return (
    <header className="h-20 bg-white border-b border-borderLine flex items-center justify-between px-8 sticky top-0 z-40">
      
      <div className="flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search transactions or budgets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.length >= 2) setShowSearchResults(true); }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all"
          />
        </div>

        {showSearchResults && (
          <div className="absolute top-full mt-2 w-full bg-white border border-borderLine rounded-2xl shadow-lg py-2 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
            {isSearching ? (
              <div className="px-4 py-3 text-sm text-textMuted text-center">Searching...</div>
            ) : !hasResults ? (
              <div className="px-4 py-3 text-sm text-textMuted text-center">No results found for "{searchQuery}"</div>
            ) : (
              <>
                {searchResults.transactions.length > 0 && (
                  <div>
                    <div className="px-4 py-1 text-xs font-bold text-textMuted uppercase tracking-wider bg-gray-50">Transactions</div>
                    {searchResults.transactions.map(tx => (
                      <div key={tx.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0" onClick={() => {navigate('/transactions'); setShowSearchResults(false);}}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <CreditCard size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-textMain">{tx.title}</p>
                            <p className="text-xs text-textMuted">{tx.category}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.budgets.length > 0 && (
                  <div>
                    <div className="px-4 py-1 mt-2 text-xs font-bold text-textMuted uppercase tracking-wider bg-gray-50">Budgets</div>
                    {searchResults.budgets.map(b => (
                      <div key={b.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center" onClick={() => {navigate('/budgets'); setShowSearchResults(false);}}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <Target size={16} />
                          </div>
                          <p className="text-sm font-medium text-textMain">{b.category} Budget</p>
                        </div>
                        <span className="text-sm font-bold text-textMain">{formatCurrency(b.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowSearchResults(false); }}
            className="p-2 text-textMuted hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={22} />
            {hasUnread && <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-borderLine rounded-2xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-textMain">Notifications</h3>
                {hasUnread && (
                  <button onClick={markAllRead} className="text-xs text-primary cursor-pointer hover:underline font-medium">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-4 text-center text-sm text-textMuted">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`px-4 py-3 transition-colors border-b border-gray-50 ${notif.unread ? 'bg-blue-50/30' : 'bg-white'}`}>
                      <p className={`text-sm ${notif.unread ? 'font-semibold text-textMain' : 'text-textMuted'}`}>{notif.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowSearchResults(false); }}
            className="flex items-center gap-3 p-1 pr-3 border border-transparent hover:border-gray-200 rounded-full transition-colors"
          >
            <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold">J</div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-borderLine rounded-2xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="font-bold text-textMain">John Doe</p>
                <p className="text-xs text-textMuted">john@example.com</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-textMain hover:bg-gray-50 flex items-center gap-2">
                <Settings size={16} /> Settings
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}