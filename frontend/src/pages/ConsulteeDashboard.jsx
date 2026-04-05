import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '../components/Avatar';

/* ─── SVG Icon set (no emojis) ─────────────────────────────── */
const Icon = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  video: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  searchUser: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
};

/* ─── Glass card class ───────────────────────────────────────── */
const glass = 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl';

/* ─── Status Palette ─────────────────────────────────────────── */
const SP = {
  pending: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#FCD34D', dot: '#f59e0b', label: 'Pending Expert' },
  pending_admin: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', text: '#FDBA74', dot: '#f97316', label: 'Awaiting Payment' },
  accepted: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#6EE7B7', dot: '#10b981', label: 'Accepted' },
  rejected: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#FCA5A5', dot: '#ef4444', label: 'Rejected' },
  completed: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#A5B4FC', dot: '#6366f1', label: 'Completed' },
};

/* ─── StatusBadge ────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = SP[status] || SP.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   BOOKING CARD (Consultee View)
═══════════════════════════════════════════════ */
const BookingCard = ({ booking, onRateClick }) => {
  const s = SP[booking.status] || SP.pending;
  const name = booking.expertId?.name || 'Expert';

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ background: 'rgba(11,12,16,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Top accent */}
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${s.dot}55, transparent)` }} />

      <div className="p-5 flex flex-col h-full">
        {/* Expert avatar + status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-blue-500/20 bg-blue-500/10 shrink-0">
              <Avatar user={booking.expertId} />
            </div>
            <div className="min-w-0 pr-2">
              <p className="text-white text-sm font-medium leading-tight truncate">{name}</p>
              <p className="text-white/30 text-[11px] truncate">{booking.expertId?.email}</p>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Slot info */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-white/35 text-xs">
            <span className="text-white/20">{Icon.calendar}</span>
            {booking.date}
          </div>
          <div className="flex items-center gap-1.5 text-white/35 text-xs">
            <span className="text-white/20">{Icon.clock}</span>
            {booking.time}
          </div>
        </div>

        {/* Transaction ID */}
        {booking.transactionId && (
          <div className="mb-4">
             <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1.5">Payment Verified</p>
             <div className="text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5 text-xs font-mono tracking-wider flex items-center gap-2 w-max">
               {Icon.check} UTI: {booking.transactionId}
             </div>
          </div>
        )}

        {/* Confirmed / Expert Note */}
        {booking.status === 'accepted' && booking.proposedDate && (
          <div className="mb-4 p-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p className="text-[10px] text-emerald-400/50 uppercase tracking-widest mb-1">Confirmed Time</p>
            <p className="text-emerald-300/90 text-sm font-medium">{booking.proposedDate} &middot; {booking.proposedTime}</p>
            {booking.note && <p className="text-emerald-300/40 text-xs mt-1 italic">"{booking.note}"</p>}
          </div>
        )}

        {/* Padding pusher for bottom buttons */}
        <div className="flex-1" />

        {/* Actions */}
        {booking.status === 'accepted' ? (
          <Link to={`/call/${booking.meetingLink || 'demo-room'}/${booking._id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 mt-auto"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7' }}>
            {Icon.play} Join Call
          </Link>
        ) : booking.status === 'completed' && !booking.feedback ? (
          <button onClick={() => onRateClick(booking)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 mt-auto hover:bg-yellow-500/20"
            style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.2)', color: '#FDE047' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 
            Rate Session
          </button>
        ) : booking.status === 'completed' && booking.feedback ? (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium mt-auto"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(234,179,8,0.8)' }}>
             Rated: {booking.feedback.rating} / 5
          </div>
        ) : (
          <Link to={`/experts/${booking.expertId?._id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-white/[0.05] mt-auto"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            View Expert Profile
          </Link>
        )}
      </div>
    </div>
  );
};

/* ─── Sidebar Nav ────────────────────────────────────────────── */
const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all text-left ${active ? 'text-white font-medium' : 'text-white/35 hover:text-white/65 hover:bg-white/[0.03] font-normal'
      }`}
    style={active ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)' } : {}}>
    <span className={active ? 'text-blue-400' : 'text-white/25'}>{icon}</span>
    {label}
    {badge > 0 && (
      <span className="ml-auto text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
        style={{ background: 'rgba(59,130,246,0.85)', color: 'white' }}>{badge}</span>
    )}
  </button>
);

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, color, icon }) => (
  <div className={`${glass} p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/35 text-[11px] uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {sub && <p className="text-white/25 text-[11px] mt-1">{sub}</p>}
      </div>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PROFILE TAB COMPONENT
═══════════════════════════════════════════════════════════════ */
const ProfileTab = ({ user, setUser, stats, glass }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    profilePicture: user?.profilePicture || ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/api/users/profile', {
        name: form.name,
        profilePicture: form.profilePicture
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-[#0b0c10]/70 backdrop-blur-sm border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 transition-all placeholder:text-white/15';

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Your Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} 
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
            Edit Profile
          </button>
        )}
      </div>

      <div className={`${glass} overflow-hidden`}>
        <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.05))' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(11,12,16,0.8))' }} />
        </div>
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-10 mb-8 relative z-10">
            <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 shrink-0 group bg-[#0f1219] shadow-2xl shadow-blue-900/20"
              style={{ width: 84, height: 84 }}>
              
              <Avatar user={user} />
              
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white/80 font-medium">Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <div className="pb-1 w-full flex flex-col justify-end">
              {isEditing ? (
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`${inputCls} mb-2 py-2`} placeholder="Your Name" />
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h3>
                  <p className="text-white/70 text-sm">{user?.email}</p>
                </>
              )}
              <div className="mt-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                  Consultee Account
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl text-sm text-white/40 hover:text-white transition-all border border-white/10 hover:bg-white/5">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/5">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{stats.total}</p>
                <p className="text-white/40 text-[11px] mt-1.5 uppercase tracking-widest font-medium">Total Bookings</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{stats.upcoming}</p>
                <p className="text-white/40 text-[11px] mt-1.5 uppercase tracking-widest font-medium">Upcoming</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">{stats.past}</p>
                <p className="text-white/40 text-[11px] mt-1.5 uppercase tracking-widest font-medium">Past Sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RatingModal = ({ target, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl bg-[#0F1014]">
        <h3 className="text-xl font-bold text-white mb-2">Rate your Session</h3>
        <p className="text-sm text-white/50 mb-6">How was your session with {target.expertId?.name || 'the expert'}?</p>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button"
              onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg className={`w-10 h-10 transition-colors ${(hoverRating || rating) >= s ? "text-yellow-400" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </button>
          ))}
        </div>

        <textarea placeholder="Leave a review! (Optional)" value={comment} onChange={e => setComment(e.target.value)}
          className="w-full bg-[#0b0c10]/70 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 mb-6 min-h-[100px] placeholder:text-white/20"
        />

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl text-sm text-white/40 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
          <button disabled={loading || rating === 0} 
            onClick={async () => {
              setLoading(true);
              await onSubmit(rating, comment);
              setLoading(false);
            }} 
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CONSULTEE DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function ConsulteeDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filter, setFilter] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rateTarget, setRateTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('userInfo'));
    if (!info) return navigate('/login');
    if (info.role === 'expert') return navigate('/expert-dashboard');
    setUser(info);
    fetchBookings(info);
  }, [navigate]);

  const fetchBookings = async (info) => {
    try {
      const res = await api.get('/api/bookings', {
        headers: { Authorization: `Bearer ${info.token}` }
      });
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating, comment) => {
    try {
      await api.post(`/api/bookings/${rateTarget._id}/feedback`, { rating, comment }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await fetchBookings(user);
      setRateTarget(null);
    } catch (e) {
      console.error(e);
      alert("Failed to submit feedback");
    }
  };

  const logout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };

  /* Derived */
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'pending' || b.status === 'pending_admin').length;
  const accepted = bookings.filter(b => b.status === 'accepted').length;
  const upcoming = accepted;
  const past = bookings.filter(b => b.status === 'completed' || b.status === 'rejected').length;

  // For Bookings tab filtering
  const filtered = bookings.filter(b => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return b.status === 'accepted';
    if (filter === 'Pending') return b.status === 'pending' || b.status === 'pending_admin';
    if (filter === 'Past') return b.status === 'completed' || b.status === 'rejected';
    return true;
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen flex" style={{
      background: '#08080A',
      backgroundImage: `
        radial-gradient(ellipse 60% 40% at 80% 0%, rgba(59,130,246,0.07) 0%, transparent 55%),
        radial-gradient(ellipse 50% 35% at 10% 90%, rgba(37,99,235,0.05) 0%, transparent 50%)
      `,
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ─────────── SIDEBAR ─────────── */}
      <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
      <aside className={`fixed md:relative z-50 inset-y-0 left-0 bg-[#08080A] w-64 md:w-60 transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shrink-0`} style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* subtle top gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 40%)' }} />

        {/* Logo */}
        <Link to="/" className="px-5 py-6 flex items-center gap-2.5 relative hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 18px rgba(59,130,246,0.35)' }}>
            {Icon.bolt}
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Consultify<span style={{ color: '#3b82f6' }}>.</span>
          </span>
        </Link>

        {/* Action Button: Book an Expert */}
        <div className="px-4 mb-5">
          <Link to="/experts" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 0 16px rgba(59,130,246,0.2)' }}>
            {Icon.searchUser} Find Expert
          </Link>
        </div>

        {/* Nav items */}
        <nav className="px-3 flex-1 space-y-0.5">
          <p className="text-white/15 text-[9px] uppercase tracking-widest px-3.5 py-2">Main</p>
          <NavItem icon={Icon.grid} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
          <NavItem icon={Icon.calendar} label="My Sessions" active={activeNav === 'bookings'} badge={upcoming} onClick={() => setActiveNav('bookings')} />
          
          <p className="text-white/15 text-[9px] uppercase tracking-widest px-3.5 pt-5 pb-2">Account</p>
          <NavItem icon={Icon.user} label="Profile" active={activeNav === 'profile'} onClick={() => setActiveNav('profile')} />
          <NavItem icon={Icon.settings} label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />
        </nav>

        {/* User card */}
        <div className="mx-3 mb-5 mt-4 p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden mb-3 bg-[#08080A]">
            <Avatar user={user} />
          </div>
          <p className="text-white text-sm font-medium leading-tight truncate">{user?.name || 'User'}</p>
          <p className="text-white/30 text-xs mt-0.5 truncate">{user?.email}</p>
          <button onClick={logout} className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold w-full px-4 py-2.5 rounded-xl text-white transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 16px rgba(59,130,246,0.3)', border: 'none' }}>
            {Icon.logout} Sign out
          </button>
        </div>
      </aside>

      {/* ─────────── MAIN ─────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0 transition-all z-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,10,0.6)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white/50 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <p className="text-white/25 text-xs hidden sm:block">
              Consultee Portal <span className="text-white/20 mx-1.5">›</span>
              <span className="text-white/50">{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              {Icon.bell}
              {upcoming > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Consultee Mode
            </div>
          </div>
        </header>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* ══ DASHBOARD ══ */}
          {activeNav === 'dashboard' && (
            <>
              {/* Greeting */}
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-white tracking-tight">
                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">{user?.name?.split(' ')[0] || 'User'}</span>
                  </h1>
                  <p className="text-white/30 text-sm mt-1">Here is your session overview.</p>
                </div>
                <span className="hidden sm:block text-xs text-white/20 border border-white/[0.06] px-3 py-1.5 rounded-xl">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Sessions" value={total} icon={Icon.grid} color="#3b82f6" sub="All time booked" />
                <StatCard label="Upcoming" value={accepted} icon={Icon.play} color="#10b981" sub="Ready to join" />
                <StatCard label="Awaiting" value={pending} icon={Icon.clock} color="#f59e0b" sub="Pending confirmation" />
                <StatCard label="Past" value={past} icon={Icon.check} color="#6366f1" sub="Completed/Rejected" />
              </div>

              {/* Upcoming quick panel */}
              {accepted > 0 && (
                <div className="rounded-2xl p-6" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-white text-sm font-medium">Upcoming Sessions</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>{accepted}</span>
                    </div>
                    <button onClick={() => { setActiveNav('bookings'); setFilter('Upcoming'); }} className="text-xs text-emerald-500/50 hover:text-emerald-400 transition-colors">View all</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {bookings.filter(b => b.status === 'accepted').slice(0, 3).map(b => (
                      <BookingCard key={b._id} booking={b} onRateClick={setRateTarget} />
                    ))}
                  </div>
                </div>
              )}

              {/* Call to action for empty state or general */}
              {total === 0 && !loading && (
                <div className={`${glass} p-10 flex flex-col items-center justify-center text-center mt-4`}>
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <span className="text-blue-400">{Icon.searchUser}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No sessions yet</h3>
                  <p className="text-white/40 text-sm max-w-sm mb-6">You haven't booked any expert sessions yet. Find an expert to get started.</p>
                  <Link to="/experts" className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 shadow-lg shadow-blue-500/20"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    Browse Experts
                  </Link>
                </div>
              )}

              {/* Table of recents */}
              {total > 0 && (
                <div className={`${glass} overflow-hidden`}>
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                    <div>
                      <p className="text-white text-sm font-medium">Recent Activity</p>
                      <p className="text-white/25 text-xs mt-0.5">Latest session requests & status</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-14">
                      <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(59,130,246,0.15)', borderTopColor: '#3b82f6' }} />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            {['Expert', 'Requested', 'Time', 'Status', 'Action'].map(h => (
                              <th key={h} className="px-6 py-3.5 text-left text-[10px] text-white/25 uppercase tracking-widest font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 8).map((b, idx) => (
                            <tr key={b._id} className="transition-colors hover:bg-white/[0.015]"
                              style={{ borderBottom: idx < 7 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                    <Avatar user={b.expertId} />
                                  </div>
                                  <span className="text-white/70 text-sm">{b.expertId?.name || '—'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-white/35 text-xs">{b.date}</td>
                              <td className="px-6 py-4 text-white/35 text-xs">{b.time}</td>
                              <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                              <td className="px-6 py-4">
                                {b.status === 'accepted' ? (
                                  <Link to={`/call/${b.meetingLink || 'demo-room'}/${b._id}`}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all hover:brightness-110"
                                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7' }}>
                                    {Icon.play} Join
                                  </Link>
                                ) : (
                                  <span className="text-white/15 text-xs">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══ SESSIONS / BOOKINGS ══ */}
          {activeNav === 'bookings' && (
            <>
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">My Sessions</h2>
                <p className="text-white/30 text-sm mt-1">Review your upcoming, pending, and past sessions.</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {['All', 'Upcoming', 'Pending', 'Past'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={filter === f
                      ? { background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>
                    {f}
                    {f === 'Upcoming' && accepted > 0 && <span className="ml-1.5 text-blue-400">({accepted})</span>}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(59,130,246,0.15)', borderTopColor: '#3b82f6' }} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-white/25 text-sm">No {filter !== 'All' ? filter.toLowerCase() : ''} sessions found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5 items-stretch">
                  {filtered.map(b => (
                    <BookingCard key={b._id} booking={b} onRateClick={setRateTarget} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ══ PROFILE ══ */}
          {activeNav === 'profile' && (
            <ProfileTab user={user} setUser={setUser} stats={{ total, upcoming: accepted, past }} glass={glass} />
          )}

          {/* ══ CATCH-ALL ══ */}
          {!['dashboard', 'bookings', 'profile'].includes(activeNav) && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-white/20">{Icon.settings}</span>
              </div>
              <p className="text-white/30 text-sm">{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} coming soon</p>
            </div>
          )}

        </div>
      </div>
      <RatingModal target={rateTarget} onClose={() => setRateTarget(null)} onSubmit={submitRating} />
    </div>
  );
}
