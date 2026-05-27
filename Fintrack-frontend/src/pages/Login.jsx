import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-borderLine focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-borderLine focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primaryHover text-white font-semibold py-3 rounded-xl transition-colors mt-6"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}