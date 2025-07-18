import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1: import this

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ Step 2: initialize it

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/'); // ✅ Step 3: redirect after success
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#16161d]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 p-8 rounded shadow-md w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src="/lovable-uploads/21ca0443-32f3-4f4b-a21c-bec7c180b4f7.png" alt="Logo" className="h-12 w-12 object-contain mb-2" />
          <h1 className="text-3xl font-brand text-[#0f7969] text-center">Lead Stream Pro</h1>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#16161d] dark:text-white">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded border-[#0f7969] focus:border-[#3182ce] focus:ring-0 focus:outline-none bg-white dark:bg-zinc-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#16161d] dark:text-white">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded border-[#0f7969] focus:border-[#3182ce] focus:ring-0 focus:outline-none bg-white dark:bg-zinc-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-[#0f7969] text-white py-2 rounded hover:bg-[#0f7969]/90 transition">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
