import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return navigate('/login');
        
        const { data } = await api.get(`/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        if (data.status !== 'pending' && data.status !== 'accepted') {
          // If already paid or cancelled, we still just show it or let it expire normally
        }
        
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, navigate]);

  useEffect(() => {
    if (loading || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isExpired]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (isExpired) return;
    
    if (!utrNumber || utrNumber.length < 5) {
      setError('Please enter a valid UTR Number');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await api.put(`/api/bookings/${id}/pay`, { utrNumber }, config);
      navigate('/consultee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment details');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-[#08080A]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex justify-center items-center bg-[#08080A]">
        <div className="bg-[#12131A]/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-10 max-w-md w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Session Expired</h1>
          <p className="text-white/50 mb-8 leading-relaxed">The active payment window has closed. Your booking is still saved safely on your dashboard. You can retry paying anytime.</p>
          <button onClick={() => navigate('/consultee-dashboard')} className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const price = booking?.expertId?.pricingPerSession || 0;
  // Dynamic UPI URI
  const upiUrl = `upi://pay?pa=nitinkoundal2005@oksbi&pn=Consultify Admin&am=${price}&cu=INR`;

  return (
    <div className="min-h-screen bg-[#08080A] pt-32 px-4 pb-20 relative overflow-hidden">
      {/* Background aesthetic */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="max-w-4xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Col: Summary */}
        <div className="space-y-6">
          <div className="bg-[#12131A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden h-full flex flex-col">
             <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>
             
             {booking && (
               <div className="flex-1 space-y-6">
                 <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center text-xl font-bold text-blue-400">
                      {booking.expertId?.profilePicture ? (
                        <img src={booking.expertId.profilePicture} alt="Expert" className="w-full h-full object-cover" />
                      ) : (
                        booking.expertId?.name?.charAt(0) || 'E'
                      )}
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Expert</p>
                      <p className="text-white font-semibold text-lg">{booking.expertId?.name || 'Unknown Expert'}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Date</p>
                      <p className="text-white font-medium">{booking.date}</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Time</p>
                      <p className="text-white font-medium">{booking.time}</p>
                   </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <p className="text-white/60">Total Amount</p>
                    <p className="text-emerald-400 font-bold text-3xl">₹{price}</p>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right Col: Payment */}
        <div>
          <div className="bg-gradient-to-b from-[#1C1F2A] to-[#12131A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Timer Banner */}
            <div className="absolute top-0 left-0 right-0 py-2 bg-red-500/10 border-b border-red-500/20 text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-red-400 text-xs font-bold tracking-widest">EXPIRES IN <span className="font-mono">{formatTime(timeLeft)}</span></p>
            </div>

            <div className="mt-10 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
              <p className="text-white/50 text-sm mb-8">Scan dynamic QR code to securely pay Admin.</p>
              
              <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative">
                <QRCodeSVG 
                  value={upiUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 border border-red-500/20">{error}</div>}

              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-2">UTR / Transaction Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 123456789012"
                    className="w-full bg-[#08080A]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono text-sm"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting || isExpired}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 tracking-wide text-sm"
                >
                  {submitting ? 'Verifying...' : 'Confirm Submission'}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
