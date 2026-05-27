import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Budgets from '../pages/Budgets';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
      </Route>
    </Routes>
  );
}