import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';

export default function Topbar() {
  const { logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-card border-b border-borderLine flex items-center justify-between px-6 z-10">
      <div className="flex items-center bg-background rounded-full px-4 py-2 border border-borderLine w-64">
        <Search size={18} className="text-textMuted mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-textMuted hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          U
        </div>
        <button 
          onClick={logout}
          className="text-textMuted hover:text-red-500 transition-colors ml-4"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}