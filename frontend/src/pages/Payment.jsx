import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [utrNumber, setUtrNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 5) {
      setError('Please enter a valid UTR Number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await api.put(`/api/bookings/${id}/pay`, { utrNumber }, config);
      navigate('/consultee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment details');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 flex justify-center items-center">
      <div className="glass-card rounded-2xl p-8 max-w-lg w-full bg-white/5 border border-white/10 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Complete Payment</h1>
        <p className="text-white/60 mb-8">Scan the QR code below to pay the session fee, then enter your UTR number.</p>
        
        <div className="bg-white p-4 rounded-xl inline-block mb-8 shadow-2xl shadow-blue-500/20">
          {/* Mock QR Code */}
          <div className="w-48 h-48 bg-gray-200 border-4 border-white flex flex-col items-center justify-center p-2 relative">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-600 m-2"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600 m-2"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600 m-2"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-600 m-2"></div>
            <p className="font-bold text-gray-800 tracking-widest text-xl">Consultify</p>
            <p className="text-xs text-gray-500 mt-1">Admin UPI</p>
            <div className="w-24 h-24 mt-2 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs opacity-75 whitespace-nowrap">SCAN ME</span>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl text-sm mb-4 border border-red-500/30">{error}</div>}

        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">UTR / Transaction Number</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. 123456789012"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Confirm Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
