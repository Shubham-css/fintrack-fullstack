import { Outlet } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2 text-primary">
        <Wallet size={40} />
        <h1 className="text-3xl font-bold text-textMain">FinTrack</h1>
      </div>
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-sm border border-borderLine">
        <Outlet />
      </div>
    </div>
  );
}