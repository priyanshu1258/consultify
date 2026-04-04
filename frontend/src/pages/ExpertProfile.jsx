import { useState, useEffect } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const ExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!expert) return;
    
    if (!expert.availabilitySlots || expert.availabilitySlots.length === 0) {
      if (date || time) setAvailabilityError('This expert has not configured availability yet.');
      return;
    }

    setAvailabilityError('');

    if (date) {
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const slotForDay = expert.availabilitySlots.find(s => s.day === dayOfWeek);

      if (!slotForDay) {
        setAvailabilityError(`Expert is not available on ${dayOfWeek}s.`);
        return;
      }

      if (time) {
        if (time < slotForDay.startTime || time > slotForDay.endTime) {
          setAvailabilityError(`Expert is only available between ${slotForDay.startTime} and ${slotForDay.endTime} on ${dayOfWeek}s.`);
        }
      }
    }
  }, [date, time, expert]);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const { data } = await api.get(`/api/users/experts/${id}`);
        setExpert(data);
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
      const { data } = await api.post('/api/bookings', { expertId: id, date, time }, config);
      setSuccess('Booking request sent. Redirecting to payment...');
      setTimeout(() => {
        navigate(`/payment/${data._id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book session');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !expert) return <div className="text-red-500">{error || 'Expert not found'}</div>;

  return (
    <div className="min-h-screen bg-[#08080A] pt-32 px-4 pb-20 relative overflow-hidden">
      {/* Background aesthetic */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start antialiased">
        
        {/* LEFT COLUMN: Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#12131A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] pointer-events-none rounded-full" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-[#1C1F2A] to-[#252836] border border-white/10 flex items-center justify-center font-bold text-orange-400 text-5xl overflow-hidden flex-shrink-0 shadow-2xl relative">
                {expert.profilePicture ? (
                   <img src={expert.profilePicture} alt={expert.name} className="w-full h-full object-cover" />
                ) : (
                   expert.name.charAt(0).toUpperCase()
                )}
                <div className="absolute bottom-[-10px] right-[-10px] w-12 h-12 bg-[#08080A] rounded-full flex items-center justify-center blur-[2px]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-4 border-[#12131A] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-2">Verified Expert</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">{expert.name}</h1>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <span className="text-emerald-400 font-bold text-lg">₹{expert.pricingPerSession || 0}</span>
                  <span className="text-white/40 text-xs">/ session</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-white/20" /> About
              </h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed whitespace-pre-wrap pl-8 border-l border-white/10">
                {expert.bio || 'This expert has not provided a biography yet.'}
              </p>

              <h2 className="text-lg font-semibold text-white mt-10 mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-white/20" /> Expertise
              </h2>
              <div className="flex flex-wrap gap-2 pl-8">
                {expert.skills && expert.skills.length > 0 ? expert.skills.map(skill => (
                   <span key={skill} className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-white/80 bg-white/5 border border-white/10 shadow-sm">
                     {skill}
                   </span>
                )) : (
                   <span className="text-white/30 text-sm italic">No specific skills listed.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-[#1C1F2A] to-[#12131A] border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl sticky top-32">
            <h2 className="text-2xl font-bold text-white mb-2">Book Session</h2>
            
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400/90 text-[11px] uppercase tracking-widest font-semibold px-3 py-2 rounded-lg mb-6 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><polyline points="12 6 12 12 16 14" strokeWidth="2"/></svg>
               Session Limit: 1 Hour
            </div>

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">✓</div>
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Availability Widget */}
            {expert.availabilitySlots && expert.availabilitySlots.length > 0 ? (
              <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-3">Available Slots</p>
                <div className="space-y-2">
                  {expert.availabilitySlots.map(slot => (
                    <div key={slot.day} className="flex justify-between items-center text-xs">
                      <span className="text-white/80 font-medium">{slot.day}</span>
                      <span className="text-white/50 bg-black/20 px-2 py-0.5 rounded">{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs">
                This expert has not configured availability slots yet.
              </div>
            )}

            <form onSubmit={handleBookSession} className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-2 mt-2">Select Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#08080A]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.6] [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-white/40 mb-2">Select Time</label>
                <input 
                  type="time" 
                  required 
                  className="w-full bg-[#08080A]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.6] [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                />
              </div>

              {/* Price Summary Line */}
              <div className="flex items-center justify-between py-4 border-t border-b border-white/5 my-6">
                 <span className="text-white/50 text-sm font-medium">Total Cost:</span>
                 <span className="text-white font-bold text-lg">₹{expert.pricingPerSession || 0}</span>
              </div>
              
              {availabilityError && (
                <div className="text-red-400 text-[11px] font-medium bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 mt-2 mb-4">
                  {availabilityError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={!!availabilityError || !date || !time || (!expert.availabilitySlots || expert.availabilitySlots.length === 0)}
                className="w-full relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white p-4 rounded-xl font-semibold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>Request Booking</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpertProfile;
