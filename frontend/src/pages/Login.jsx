import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
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
    <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center pt-24 pb-12 relative overflow-hidden">
      
      {/* Background Soft Arc Glow Component */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0">
          <svg viewBox="0 0 800 800" className="w-full h-full opacity-40 blur-[80px]">
            <circle cx="400" cy="400" r="300" fill="transparent" stroke="#ea580c" strokeWidth="60" />
            <circle cx="400" cy="400" r="200" fill="#c2410c" opacity="0.3" filter="blur(40px)" />
          </svg>
      </div>

      <div className="w-full max-w-md bg-[#0F1014]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl p-10 rounded-3xl relative z-10 flex flex-col">
        <h2 className="text-2xl font-medium text-white mb-2">Welcome Back</h2>
        <p className="text-white/40 text-sm mb-8">Please enter your details to sign in.</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/50 tracking-wide">Email address</label>
            <input 
              type="email" 
              required 
              className="w-full p-3.5 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 focus:bg-[#1A1C23] focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-white/10 md:placeholder:text-white/20 text-sm" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-white/50 tracking-wide">Password</label>
            </div>
            <input 
              type="password" 
              required 
              className="w-full p-3.5 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 focus:bg-[#1A1C23] focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-white/10 md:placeholder:text-white/20 text-sm tracking-widest" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/50 text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all mt-4 text-sm tracking-wide">
            Login in
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-white/40">
          New to Consultify? <Link to="/register" className="text-white hover:text-orange-400 font-medium transition-colors underline decoration-white/30 underline-offset-4">Create a new account here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
