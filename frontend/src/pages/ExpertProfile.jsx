import { useState, useEffect } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';

const ExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const { data } = await api.get(`/api/users/experts/${id}`);
        setExpert(data);
        const rewRes = await api.get(`/api/users/experts/${id}/reviews`);
        setReviews(rewRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch expert profile');
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  const handleBookSession = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      await api.post('/api/bookings', { expertId: id, date, time, transactionId }, config);
      setSuccess('Booking request sent successfully and is pending admin payment verification!');
      setDate('');
      setTime('');
      setTransactionId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book session');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#08080A] flex justify-center items-center">
      <p className="text-white/50 animate-pulse text-lg tracking-widest font-mono">LOADING...</p>
    </div>
  );
  if (error || !expert) return (
    <div className="min-h-screen bg-[#08080A] flex justify-center items-center">
      <div className="text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">{error || 'Expert not found'}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080A] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Soft Arc Glow Component */}
      <div className="absolute top-0 right-1/4 -translate-y-1/4 w-[800px] h-[800px] pointer-events-none z-0">
          <svg viewBox="0 0 800 800" className="w-full h-full opacity-30 blur-[80px]">
            <circle cx="400" cy="400" r="300" fill="transparent" stroke="#ea580c" strokeWidth="60" />
            <circle cx="400" cy="400" r="200" fill="#c2410c" opacity="0.3" filter="blur(40px)" />
          </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F1014]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.05))' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(15,16,20,0.9))' }} />
            </div>
            
            <div className="p-8 pt-0">
              <div className="flex items-end gap-6 -mt-12 mb-8 pb-8 border-b border-white/5">
                <div className="relative w-28 h-28 rounded-2xl border-4 border-[#0F1014] shadow-[0_0_25px_rgba(249,115,22,0.2)] bg-[#0F1014] shrink-0">
                  <Avatar user={expert} className="rounded-xl overflow-hidden" />
                  <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-orange-400 text-xs font-semibold shadow-lg z-10">Verified</span>
                </div>
                
                <div className="pb-1 w-full flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{expert.name}</h1>
                    <div className="mt-2 flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-0.5 rounded-md border border-yellow-500/20 w-max">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                      <span className="text-yellow-400 text-sm font-bold">{expert.rating ? expert.rating.toFixed(1) : 'New'}</span>
                      {expert.reviewCount > 0 && <span className="text-yellow-400/50 text-xs font-medium ml-1">({expert.reviewCount} reviews)</span>}
                    </div>
                  </div>
                  <p className="text-orange-400/90 font-semibold text-lg mt-1 tracking-wide">₹{expert.pricingPerSession || 0} <span className="text-white/30 font-normal text-sm">/ session</span></p>
                </div>
              </div>

              <h2 className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase mb-4 pl-1">About</h2>
              <p className="text-white/70 whitespace-pre-wrap leading-relaxed text-[15px] p-5 bg-white/[0.02] rounded-2xl border border-white/[0.04]">{expert.bio || 'No bio provided for this expert.'}</p>

              <h2 className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase mt-8 mb-4 pl-1">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2.5">
                {expert.skills?.map(skill => (
                  <span key={skill} className="bg-white/5 border border-white/10 text-white/80 px-3.5 py-1.5 rounded-full text-sm tracking-wide">
                    {skill}
                  </span>
                ))}
              </div>

              {reviews && reviews.length > 0 && (
                <div className="mt-12 border-t border-white/5 pt-8">
                  <h2 className="text-xs font-bold text-white/40 tracking-[0.2em] uppercase mb-6 pl-1">Public Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map(rev => (
                      <div key={rev._id} className="p-6 bg-white/[0.02] rounded-2xl border border-white/[0.04] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {rev.consulteeId?.profilePicture ? (
                              <img src={rev.consulteeId.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm border border-orange-500/20">
                                {rev.consulteeId?.name?.charAt(0) || 'C'}
                              </div>
                            )}
                            <span className="text-sm font-medium text-white">{rev.consulteeId?.name || 'Anonymous User'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
                            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
                            <span className="text-yellow-400 text-xs font-bold">{rev.feedback.rating}/5</span>
                          </div>
                        </div>
                        {rev.feedback.comment && <p className="text-white/60 text-sm leading-relaxed">{rev.feedback.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#0F1014]/90 backdrop-blur-xl p-8 border border-white/[0.08] shadow-2xl rounded-3xl sticky top-32">
            <h2 className="text-xl font-medium text-white mb-6">Book a Session</h2>
            
            {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg mb-6 text-sm tracking-wide">{success}</div>}
            
            <form onSubmit={handleBookSession} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/50 tracking-wide mb-1.5">Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full p-3.5 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 focus:bg-[#1A1C23] focus:ring-1 focus:ring-orange-500/20 transition-all text-sm [color-scheme:dark]" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 tracking-wide mb-1.5">Time</label>
                <input 
                  type="time" 
                  required 
                  className="w-full p-3.5 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 focus:bg-[#1A1C23] focus:ring-1 focus:ring-orange-500/20 transition-all text-sm [color-scheme:dark]" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                />
              </div>

              {/* Payment Section */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-white/80 font-medium text-sm mb-4">Complete Payment to Book</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center mb-4">
                  {/* Dynamic UPI QR Code UI */}
                  <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=ffffff&color=ea580c&data=${encodeURIComponent(`upi://pay?pa=priyanshuattri05@okaxis&pn=ConsultifyPayment&am=${expert.pricingPerSession || 0}&cu=INR`)}`} alt="Payment QR" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <p className="text-white/40 text-xs mt-3 text-center w-full">Scan with any UPI app to pay ₹{expert.pricingPerSession || 0}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 tracking-wide mb-1.5">Transaction ID / UTI</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter UTI after payment"
                    className="w-full p-3.5 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 focus:bg-[#1A1C23] focus:ring-1 focus:ring-orange-500/20 transition-all text-sm placeholder:text-white/20" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/50 text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all mt-4 text-sm tracking-wide"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
