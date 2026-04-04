import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const STATUS_COLORS = {
  confirmed: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  payment_submitted: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', dot: 'bg-red-400' },
  pending:  { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
};

const JoinSessionButton = ({ booking }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      if (!booking.date || !booking.time) return;
      const sessionDate = new Date(`${booking.date}T${booking.time}`);
      const now = new Date();
      const diffMs = sessionDate - now;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins <= 15) {
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [booking.date, booking.time]);

  if (enabled) {
    return (
      <Link
        to={`/call/${booking.meetingLink || 'demo-room'}`}
        className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-400/50 text-center tracking-wide group"
      >
        <span className="flex items-center justify-center gap-2">
           <svg className="w-5 h-5 animate-pulse group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
           Join Video Session
        </span>
      </Link>
    );
  } else {
    return (
      <button
        disabled
        className="w-full bg-[#1A1C23] border border-white/10 text-white/40 px-4 py-3 rounded-xl text-sm font-medium cursor-not-allowed flex items-center justify-between"
        title="Link will be active 15 mins before session"
      >
        <span>Join Video Session</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-white/30">Wait</span>
      </button>
    );
  }
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-white/50 text-sm font-medium uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-white mt-0.5">{value}</p>
    </div>
  </div>
);

const ConsulteeDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return navigate('/login');
    if (userInfo.role === 'expert') return navigate('/expert-dashboard');
    setUser(userInfo);
    fetchBookings(userInfo);
  }, [navigate]);

  const fetchBookings = async (userInfo) => {
    try {
      const { data } = await api.get('/api/bookings', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'accepted').length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Consultee Portal</p>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-blue-400">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
        </div>
        <Link
          to="/experts"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Book a Session
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Sessions" value={stats.total} icon="📋" color="bg-blue-500/20" />
        <StatCard label="Upcoming" value={stats.upcoming} icon="✅" color="bg-emerald-500/20" />
        <StatCard label="Awaiting Confirmation" value={stats.pending} icon="⏳" color="bg-amber-500/20" />
      </div>

      {/* Bookings */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white/90 mb-6">Your Sessions</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="text-6xl mb-2">🗓️</div>
            <p className="text-white/60 text-lg font-medium">No sessions booked yet</p>
            <p className="text-white/30 text-sm max-w-xs">Browse our experts and book your first consultation session.</p>
            <Link to="/experts" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all">
              Find an Expert
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
              return (
                <div
                  key={booking._id}
                  className="relative group overflow-hidden bg-[#121318]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1"
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="flex flex-col gap-6 h-full relative z-10 flex-grow">
                    {/* Header: Expert Info & Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A1C23] to-[#22252E] border border-white/10 flex items-center justify-center text-xl flex-shrink-0 shadow-inner overflow-hidden relative">
                           <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
                           👤
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg tracking-tight">
                            {booking.expertId?.name || 'Expert'}
                          </p>
                          <p className="text-white/40 text-xs mt-0.5 max-w-[120px] truncate" title={booking.expertId?.email}>
                            {booking.expertId?.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`flex-shrink-0 inline-flex flex-col items-end gap-1`}>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide uppercase border ${sc.bg} ${sc.text} ${sc.border} shadow-sm backdrop-blur-md`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${booking.status === 'pending' || booking.status === 'payment_submitted' ? 'animate-pulse' : ''}`} />
                          {booking.status.replace('_', ' ')}
                        </span>
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/5"></div>

                    {/* Date & Time Info */}
                    <div className="flex flex-row items-center gap-4 text-sm bg-white/[0.02] p-3 rounded-2xl border border-white/[0.02]">
                      <div className="flex items-center gap-3 flex-1 flex-col sm:flex-row justify-center sm:justify-start">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-white/80 font-medium tracking-wide text-xs sm:text-sm">{booking.date}</span>
                      </div>
                      
                      <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                      <div className="flex items-center gap-3 flex-1 flex-col sm:flex-row justify-center sm:justify-start">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-white/80 font-medium tracking-wide text-xs sm:text-sm">{booking.time}</span>
                      </div>
                    </div>

                    {/* Action Area (Bottom) */}
                    <div className="mt-auto pt-2 flex justify-end w-full">
                      {(booking.status === 'confirmed' || booking.status === 'accepted') ? (
                        <div className="w-full">
                           <JoinSessionButton booking={booking} />
                        </div>
                      ) : (
                        <div className="w-full py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-white/40 text-xs font-semibold uppercase tracking-widest">
                           {booking.status === 'pending' ? 'Awaiting Confirmation' : booking.status === 'payment_submitted' ? 'Payment Verifying' : 'No Actions Available'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsulteeDashboard;
