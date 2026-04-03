import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // Step 1: User Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consultee');
  
  // Expert Details
  const [bio, setBio] = useState('');
  const [pricingPerSession, setPricingPerSession] = useState(0);
  const [skills, setSkills] = useState('');
  
  // Step 2: OTP Verification
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !mobile || !email || !password) {
      return setError('Please fill all required fields');
    }
    
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setPreviewUrl(data.previewUrl);
      setOtpStep(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP');

    setLoading(true);
    setError('');
    try {
      const payload = { 
        firstName, lastName, mobile, email, password, role, otp,
        ...(role === 'expert' && { 
          bio, 
          pricingPerSession: Number(pricingPerSession), 
          skills: skills.split(',').map(s => s.trim()) 
        }) 
      };
      const { data } = await axios.post('http://localhost:5000/api/auth/register', payload);
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.role === 'expert') {
        navigate('/expert-dashboard');
      } else {
        navigate('/consultee-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 glass-card p-10 rounded-3xl relative overflow-hidden mb-20">
       <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/20 blur-[50px] -z-10 rounded-full"></div>
      
      {!otpStep ? (
        <>
          <h2 className="text-3xl font-semibold text-center mb-8 text-white">Create an Account</h2>
          {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-sm">{error}</div>}
          
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">First Name</label>
                <input 
                  type="text" required 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                  value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Last Name</label>
                <input 
                  type="text" required 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                  value={lastName} onChange={(e) => setLastName(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Mobile</label>
                <input 
                  type="tel" required 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                  value={mobile} onChange={(e) => setMobile(e.target.value)} 
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                <input 
                  type="email" required 
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
              <input 
                type="password" required 
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">I want to...</label>
              <select 
                className="w-full p-3 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                value={role} onChange={(e) => setRole(e.target.value)}
              >
                <option value="consultee">Get Advice (Consultee)</option>
                <option value="expert">Give Advice (Expert)</option>
              </select>
            </div>

            {role === 'expert' && (
              <div className="space-y-5 p-5 border border-white/10 rounded-xl bg-white/5 mt-4">
                <h3 className="text-white font-medium mb-1">Expert Details</h3>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Professional Bio</label>
                  <textarea 
                    required 
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                    rows="2"
                    value={bio} onChange={(e) => setBio(e.target.value)} 
                    placeholder="Tell us about your expertise..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Skills (comma separated)</label>
                    <input 
                      type="text" required 
                      className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                      value={skills} onChange={(e) => setSkills(e.target.value)} 
                      placeholder="e.g. React, Node, DevOps"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Rate per session ($)</label>
                    <input 
                      type="number" required min="0" step="1"
                      className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors" 
                      value={pricingPerSession} onChange={(e) => setPricingPerSession(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition mt-6 disabled:opacity-70">
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account? <Link to="/login" className="text-white hover:underline">Login</Link>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-semibold text-center mb-2 text-white">Verify Email</h2>
          <p className="text-center text-white/60 mb-8 text-sm">We've sent a 6-digit OTP to <br/><b className="text-white">{email}</b></p>
          
          {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-sm">{error}</div>}
          
          <form onSubmit={handleVerifyAndRegister} className="space-y-6">
            <div>
               {previewUrl ? (
                 <div className="text-xs text-blue-300/90 mb-4 bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 text-center flex flex-col gap-2">
                   <p className="font-semibold text-white">Your verification email has been sent! ✉️</p>
                   <a href={previewUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white py-2 px-4 rounded-lg inline-block w-max mx-auto hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 font-medium">
                     Open Email Inbox
                   </a>
                 </div>
               ) : (
                 <p className="text-xs text-amber-300/80 mb-3 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-center">
                   (Check the backend terminal/console for the OTP code)
                 </p>
               )}
              <label className="block text-sm font-medium text-white/70 mb-2 text-center">Enter OTP</label>
              <input 
                type="text" required maxLength={6}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-pink-500 transition-colors text-center text-2xl tracking-widest font-mono" 
                value={otp} onChange={(e) => setOtp(e.target.value)} 
                placeholder="------"
              />
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition disabled:opacity-70">
              {loading ? 'Verifying...' : 'Verify & Sign Up'}
            </button>
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setOtpStep(false)} className="text-white/50 hover:text-white text-sm">
                Back to edit details
              </button>
              <button type="button" onClick={handleSendOtp} disabled={loading} className="text-pink-400 hover:text-pink-300 text-sm transition-colors disabled:opacity-50 font-medium">
                Resend OTP
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;
