import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'expert') {
        navigate('/expert-dashboard');
      } else {
        navigate('/consultee-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 glass-card p-10 rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -z-10 rounded-full"></div>
      <h2 className="text-3xl font-semibold text-center mb-8 text-white">Welcome Back</h2>
      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
          <input 
            type="email" 
            required 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
          <input 
            type="password" 
            required 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition mt-4">Login</button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Don't have an account? <Link to="/register" className="text-white hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
