import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

/* ─── Tiny SVG Area Chart ─── */
const AreaChart = ({ color = '#8B5CF6', points = [], height = 80 }) => {
  const w = 300, h = height;
  const max = Math.max(...points, 1);
  const coords = points.map((v, i) => [
    (i / (points.length - 1)) * w,
    h - (v / max) * (h - 10),
  ]);
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c[0]},${c[1]}`).join(' ');
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#','')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

/* ─── Donut / Gauge ─── */
const Donut = ({ pct = 75, color = '#8B5CF6', size = 120, label = '' }) => {
  const r = 44, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="12"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{pct}%</text>
      {label && <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">{label}</text>}
    </svg>
  );
};

/* ─── Sidebar Nav Item ─── */
const NavItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
      active
        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
    }`}
  >
    <span className="text-base">{icon}</span>
    {label}
  </button>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value, change, color, chart }) => (
  <div
    className="rounded-2xl p-5 flex flex-col justify-between"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        <span style={{ color }}>■</span>
      </div>
    </div>
    {chart && <AreaChart color={color} points={chart} height={50} />}
  </div>
);

/* ─── Mini Booking Row ─── */
const BookingRow = ({ booking, onAccept, onReject, updating }) => {
  const isLoading = updating === booking._id;
  const statusColors = {
    pending: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    accepted: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    rejected: 'text-red-300 bg-red-500/15 border-red-500/30',
  };
  const sc = statusColors[booking.status] || statusColors.pending;
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7C3AED33,#A855F733)', border: '1px solid rgba(168,85,247,0.2)' }}
        >
          👤
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{booking.consulteeId?.name || 'Client'}</p>
          <p className="text-white/30 text-xs">{booking.date} · {booking.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-0.5 rounded-full text-xs border ${sc}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
        {booking.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept(booking._id)}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-50"
            >
              {isLoading ? '…' : 'Accept'}
            </button>
            <button
              onClick={() => onReject(booking._id)}
              disabled={isLoading}
              className="px-3 py-1 rounded-lg text-xs font-medium border border-red-500/30 text-red-300 hover:bg-red-500/15 transition-all disabled:opacity-50"
            >
              {isLoading ? '…' : 'Decline'}
            </button>
          </>
        )}
        {booking.status === 'accepted' && (
          <Link
            to={`/call/${booking.meetingLink || 'demo-room'}`}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
          >
            Start Call
          </Link>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════
   EXPERT DASHBOARD
══════════════════════════════════ */
export default function ExpertDashboard() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return navigate('/login');
    if (userInfo.role !== 'expert') return navigate('/consultee-dashboard');
    setUser(userInfo);
    fetchBookings(userInfo);
  }, [navigate]);

  const fetchBookings = async (info) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${info.token}` },
      });
      setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchBookings(user);
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const logout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };
  const acceptRate = stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0;
  const pendingRate = stats.total ? Math.round((stats.pending / stats.total) * 100) : 0;

  // fake sparkline data seeded from real counts
  const sparkVisibility = [2, stats.pending + 1, 3, stats.accepted + 2, 5, stats.total + 1, stats.accepted + 3, 8];
  const sparkRevenue    = [1, 3, 2, stats.accepted + 1, 4, stats.total + 2, 6, stats.accepted + 4];

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: '#0D0B14',
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 80% 10%, rgba(124,58,237,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 20% 80%, rgba(168,85,247,0.12) 0%, transparent 55%),
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 40px 40px, 40px 40px',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* ─── Sidebar ─── */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 pt-6 pb-8 px-3"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)', minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="px-4 mb-8 mt-2">
          <span className="text-xl font-bold text-white tracking-tight">
            Consultify<span style={{ color: '#A855F7' }}>.</span>
          </span>
        </div>

        {/* Nav */}
        <div className="space-y-1 flex-1">
          <p className="text-white/20 text-[10px] uppercase tracking-widest px-4 mb-2">Main</p>
          <NavItem icon="⊞" label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
          <NavItem icon="◈" label="Sessions" active={activeNav === 'sessions'} onClick={() => setActiveNav('sessions')} />
          <NavItem icon="◉" label="Earnings" active={activeNav === 'earnings'} onClick={() => setActiveNav('earnings')} />
          <NavItem icon="⚙" label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />

          <p className="text-white/20 text-[10px] uppercase tracking-widest px-4 mt-6 mb-2">Account</p>
          <NavItem icon="◎" label="Profile" active={activeNav === 'profile'} onClick={() => setActiveNav('profile')} />
          <NavItem icon="→" label="Sign Out" onClick={logout} />
        </div>

        {/* Expert badge */}
        <div
          className="mt-6 mx-1 rounded-2xl p-4"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))', border: '1px solid rgba(168,85,247,0.25)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/40 flex items-center justify-center text-lg mb-3">🧑‍💼</div>
          <p className="text-white text-sm font-semibold leading-tight">{user?.name || 'Expert'}</p>
          <p className="text-purple-300/60 text-xs mt-0.5">Expert Account</p>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <p className="text-white/30 text-xs">Pages / <span className="text-white/60">Dashboard</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)', color: '#C084FC' }}
            >
              Expert Mode
            </div>
            <button
              onClick={logout}
              className="md:hidden text-white/40 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good day, <span style={{ color: '#C084FC' }}>{user?.name?.split(' ')[0] || 'Expert'}</span> 👋
            </h1>
            <p className="text-white/30 text-sm mt-0.5">Here's what's happening with your sessions today.</p>
          </div>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Requests" value={stats.total} change={12} color="#8B5CF6" chart={sparkVisibility} />
            <StatCard label="Accepted" value={stats.accepted} change={8}  color="#10B981" chart={sparkRevenue} />
            <StatCard label="Pending" value={stats.pending} color="#F59E0B" />
            <StatCard label="Rejected" value={stats.rejected} color="#EF4444" />
          </div>

          {/* Middle charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Visibility / Session Activity */}
            <div
              className="lg:col-span-2 rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-white font-semibold text-sm">Session Activity</p>
                  <p className="text-white/30 text-xs">Bookings trend analysis</p>
                </div>
                <span className="text-white/20 text-xs border border-white/10 px-2 py-0.5 rounded-full">This month</span>
              </div>
              <div className="mt-4">
                <AreaChart color="#8B5CF6" points={[...sparkVisibility, ...sparkRevenue.slice(0, 4)]} height={120} />
              </div>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />Requests
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />Accepted
                </div>
              </div>
            </div>

            {/* Acceptance Rate donut + User count */}
            <div className="flex flex-col gap-4">
              <div
                className="rounded-2xl p-5 flex flex-col items-center justify-center flex-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Acceptance Rate</p>
                <Donut pct={acceptRate} color="#8B5CF6" size={110} label="of all requests" />
              </div>

              <div
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Pending Rate</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white text-sm opacity-60 mb-1">{stats.pending} session{stats.pending !== 1 ? 's' : ''} waiting</p>
                    <div className="w-full h-2 rounded-full bg-white/10 mt-2" style={{ width: 120 }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pendingRate}%`, background: 'linear-gradient(to right,#F59E0B,#EF4444)' }}
                      />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{pendingRate}<span className="text-white/30 text-lg">%</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-semibold text-sm">Session Requests</p>
                <p className="text-white/30 text-xs">Manage all incoming bookings</p>
              </div>
              <div className="flex gap-2">
                {['All', 'Pending', 'Accepted'].map(f => (
                  <button
                    key={f}
                    className="text-xs px-3 py-1 rounded-full text-white/50 border border-white/10 hover:text-white hover:border-purple-500/40 transition-all"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div
                  className="w-7 h-7 rounded-full border-4 animate-spin"
                  style={{ borderColor: 'rgba(168,85,247,0.2)', borderTopColor: '#A855F7' }}
                />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-3">📭</p>
                <p className="text-white/40 text-sm">No session requests yet.</p>
                <p className="text-white/20 text-xs mt-1">Clients will appear here when they book with you.</p>
              </div>
            ) : (
              <div>
                {bookings.map(b => (
                  <BookingRow
                    key={b._id}
                    booking={b}
                    onAccept={(id) => updateStatus(id, 'accepted')}
                    onReject={(id) => updateStatus(id, 'rejected')}
                    updating={updating}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
