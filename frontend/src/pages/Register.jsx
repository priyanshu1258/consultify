import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consultee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 glass-card p-10 rounded-3xl relative overflow-hidden">
       <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/20 blur-[50px] -z-10 rounded-full"></div>
      <h2 className="text-3xl font-semibold text-center mb-8 text-white">Create an Account</h2>
      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
          <input 
            type="text" 
            required 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
          <input 
            type="email" 
            required 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
          <input 
            type="password" 
            required 
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">I want to...</label>
          <select 
            className="w-full p-3 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="consultee">Get Advice (Consultee)</option>
            <option value="expert">Give Advice (Expert)</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition mt-4">Sign Up</button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account? <Link to="/login" className="text-white hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default Register;
