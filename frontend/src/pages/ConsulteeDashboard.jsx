import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const STATUS_COLORS = {
  accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Accepted' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', dot: 'bg-red-400', label: 'Rejected' },
  pending:  { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Pending Expert' },
  pending_admin: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30', dot: 'bg-orange-400', label: 'Awaiting Payment' },
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
          <div className="space-y-4">
            {bookings.map((booking) => {
              const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
              return (
                <div
                  key={booking._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                        👤
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg leading-tight">
                          {booking.expertId?.name || 'Expert'}
                        </p>
                        <p className="text-white/40 text-sm">{booking.expertId?.email || ''}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/60">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {booking.time}
                      </span>
                    </div>

                    {/* Status & Action */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-widest font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label || booking.status}
                      </span>
                      {booking.transactionId && (
                        <p className="text-[10px] text-white/30 font-mono tracking-wider">UTI: {booking.transactionId}</p>
                      )}
                      
                      {booking.status === 'accepted' && (
                        <Link
                          to={`/call/${booking.meetingLink || 'demo-room'}`}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-900/30"
                        >
                          Join Call
                        </Link>
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
