import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, PieChart, Wallet } from 'lucide-react';
import clsx from 'clsx'; // Make sure you installed this: npm install clsx

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
  ];

  return (
    <aside className="w-64 bg-card border-r border-borderLine hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-borderLine text-primary">
        <Wallet size={24} className="mr-2" />
        <span className="text-xl font-bold text-textMain">FinTrack</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-textMuted hover:bg-gray-50 hover:text-textMain"
              )
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}