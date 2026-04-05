import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

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
};

/* ─── Glass card class ───────────────────────────────────────── */
const glass = 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl';

/* ─── Bar Spark Chart ────────────────────────────────────────── */
const BarSpark = ({ data = [], color = '#f97316', height = 48 }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 w-full" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all duration-700"
          style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : `${color}40`, minHeight: 3 }} />
      ))}
    </div>
  );
};

/* ─── Donut ──────────────────────────────────────────────────── */
const Donut = ({ pct = 0, color = '#f97316', size = 100 }) => {
  const r = 40, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ filter: `drop-shadow(0 0 5px ${color}88)`, transition: 'stroke-dasharray 1.2s ease' }} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="18" fontWeight="700">{pct}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">acceptance</text>
    </svg>
  );
};

/* ─── Status Palette ─────────────────────────────────────────── */
const SP = {
  pending: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#FCD34D', dot: '#f59e0b' },
  accepted: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#6EE7B7', dot: '#10b981' },
  rejected: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#FCA5A5', dot: '#ef4444' },
  completed: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#A5B4FC', dot: '#6366f1' },
};

/* ─── StatusBadge ────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = SP[status] || SP.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   ACCEPT MODAL
═══════════════════════════════════════════════ */
const AcceptModal = ({ booking, onConfirm, onClose, loading }) => {
  const today = new Date().toISOString().split('T')[0];
  const [pDate, setPDate] = useState(booking.date || today);
  const [pTime, setPTime] = useState(booking.time || '10:00');
  const [note, setNote] = useState('');

  const inputCls = 'w-full bg-[#0b0c10]/70 backdrop-blur-sm border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/10 transition-all placeholder:text-white/15';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(15,15,20,0.95), rgba(8,8,10,0.98))',
        border: '1px solid rgba(249,115,22,0.15)',
        boxShadow: '0 0 80px rgba(249,115,22,0.08), 0 32px 64px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(24px)',
      }}>
        {/* Top orange accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.6), transparent)' }} />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <span className="text-orange-400">{Icon.calendar}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold tracking-tight">Confirm Session</h3>
              <p className="text-white/35 text-xs mt-0.5">Set the confirmed date & time for this client</p>
            </div>
            <button onClick={onClose} className="ml-auto text-white/20 hover:text-white/50 transition-colors">{Icon.x}</button>
          </div>

          {/* Client request info */}
          <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-white/25 text-[10px] uppercase tracking-widest mb-1.5">Client Requested</p>
            <p className="text-white/70 text-sm font-medium">{booking.consulteeId?.name}</p>
            <p className="text-white/35 text-xs mt-0.5">{booking.date} &middot; {booking.time}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-white/35 uppercase tracking-widest mb-2">Confirmed Date</label>
              <input type="date" min={today} value={pDate} onChange={e => setPDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] text-white/35 uppercase tracking-widest mb-2">Confirmed Time</label>
              <input type="time" value={pTime} onChange={e => setPTime(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] text-white/35 uppercase tracking-widest mb-2">Note <span className="text-white/15 normal-case tracking-normal ml-1">(optional)</span></label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                placeholder="Looking forward to our session…"
                className={`${inputCls} resize-none`} />
            </div>
          </div>

          <div className="flex gap-3 mt-7">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm text-white/35 hover:text-white/60 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              Cancel
            </button>
            <button onClick={() => onConfirm({ proposedDate: pDate, proposedTime: pTime, note })}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
              {loading ? 'Confirming…' : 'Confirm & Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   BOOKING CARD (glassmorphism)
═══════════════════════════════════════════════ */
const BookingCard = ({ booking, onAcceptClick, onReject, updating }) => {
  const s = SP[booking.status] || SP.pending;
  const isUpdating = updating === booking._id;
  const name = booking.consulteeId?.name || 'Client';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ background: 'rgba(11,12,16,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Top accent */}
      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${s.dot}55, transparent)` }} />

      <div className="p-5">
        {/* Client avatar + status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
              {booking.consulteeId?.profilePicture
                ? <img src={booking.consulteeId.profilePicture} alt="" className="w-full h-full object-cover" />
                : initials}
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-tight">{name}</p>
              <p className="text-white/30 text-[11px]">{booking.consulteeId?.email}</p>
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
             <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1.5">Payment Verified By Admin</p>
             <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-xs font-mono tracking-wider flex items-center gap-2 w-max">
               {Icon.check} UTI: {booking.transactionId}
             </div>
          </div>
        )}

        {/* Confirmed slot */}
        {booking.status === 'accepted' && booking.proposedDate && (
          <div className="mb-4 p-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p className="text-[10px] text-emerald-400/50 uppercase tracking-widest mb-1">Confirmed</p>
            <p className="text-emerald-300/90 text-sm font-medium">{booking.proposedDate} &middot; {booking.proposedTime}</p>
            {booking.note && <p className="text-emerald-300/40 text-xs mt-1 italic">"{booking.note}"</p>}
          </div>
        )}

        {/* Actions */}
        {booking.status === 'pending' && (
          <div className="flex gap-2">
            <button onClick={() => onAcceptClick(booking)} disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.2)' }}>
              {isUpdating ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : Icon.check}
              Accept
            </button>
            <button onClick={() => onReject(booking._id)} disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-red-500/10 disabled:opacity-50"
              style={{ border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>
              {isUpdating ? <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> : Icon.x}
              Decline
            </button>
          </div>
        )}

        {booking.status === 'accepted' && (
          <Link to={`/call/${booking.meetingLink || 'demo'}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7' }}>
            {Icon.play} Start Session
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
    style={active ? { background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)' } : {}}>
    <span className={active ? 'text-orange-400' : 'text-white/25'}>{icon}</span>
    {label}
    {badge > 0 && (
      <span className="ml-auto text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
        style={{ background: 'rgba(249,115,22,0.85)', color: 'white' }}>{badge}</span>
    )}
  </button>
);

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, color, barData, icon }) => (
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
    {barData && <BarSpark data={barData} color={color} height={40} />}
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
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
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
      const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.put('/api/users/profile', {
        name: form.name,
        bio: form.bio,
        skills: skillsArray,
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

  const inputCls = 'w-full bg-[#0b0c10]/70 backdrop-blur-sm border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/10 transition-all placeholder:text-white/15';

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Expert Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} 
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }}>
            Edit Profile
          </button>
        )}
      </div>

      <div className={`${glass} overflow-hidden`}>
        <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.05))' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(11,12,16,0.8))' }} />
        </div>
        <div className="px-8 pb-8">
          <div className="flex items-end gap-4 -mt-10 mb-7">
            <div className="relative w-18 h-18 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-bold border-2 shrink-0 group"
              style={{ borderColor: '#08080A', background: 'rgba(249,115,22,0.15)', color: '#fb923c', width: 72, height: 72 }}>
              {(form.profilePicture || user?.profilePicture) ? (
                <img src={form.profilePicture || user?.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                (user?.name || 'E').charAt(0)
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white/80 font-medium">Upload</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <div className="pb-1 w-full">
              {isEditing ? (
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`${inputCls} mb-2 py-2`} placeholder="Your Name" />
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                  <p className="text-white/35 text-sm">{user?.email}</p>
                </>
              )}
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
                Expert
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-[11px] text-white/35 uppercase tracking-widest mb-2">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} placeholder="Tell clients about yourself..." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className="block text-[11px] text-white/35 uppercase tracking-widest mb-2">Skills (comma separated)</label>
                  <input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="e.g. React, Node.js, Design" className={inputCls} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl text-sm text-white/35 hover:text-white/60 transition-all border border-white/[0.07]">Cancel</button>
                  <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-2">Bio</p>
                  <p className="text-white/65 text-sm leading-relaxed">{user?.bio || <span className="text-white/20 italic">No bio added yet.</span>}</p>
                </div>
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">Skills</p>
                  {user?.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl text-xs text-white/55"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{s}</span>
                      ))}
                    </div>
                  ) : <p className="text-white/20 italic text-sm">No skills added yet.</p>}
                </div>
              </>
            )}
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.05]">
              {[['Total', stats.total], ['Accepted', stats.accepted], ['Completed', stats.completed]].map(([l, v]) => (
                <div key={l} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-2xl font-bold text-white">{v}</p>
                  <p className="text-white/25 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EXPERT DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function ExpertDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filter, setFilter] = useState('All');
  const [acceptTarget, setAcceptTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('userInfo'));
    if (!info) return navigate('/login');
    if (info.role !== 'expert') return navigate('/consultee-dashboard');
    setUser(info);
    fetchBookings(info);
  }, [navigate]);

  const fetchBookings = async (info) => {
    try {
      const { data } = await api.get('/api/bookings', { headers: { Authorization: `Bearer ${info.token}` } });
      setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAcceptConfirm = async ({ proposedDate, proposedTime, note }) => {
    if (!acceptTarget) return;
    setUpdating(acceptTarget._id);
    try {
      await api.put(`/api/bookings/${acceptTarget._id}/status`,
        { status: 'accepted', proposedDate, proposedTime, note },
        { headers: { Authorization: `Bearer ${user.token}` } });
      setAcceptTarget(null);
      fetchBookings(user);
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const handleReject = async (id) => {
    setUpdating(id);
    try {
      await api.put(`/api/bookings/${id}/status`, { status: 'rejected' },
        { headers: { Authorization: `Bearer ${user.token}` } });
      fetchBookings(user);
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const logout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };

  /* Derived */
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const accepted = bookings.filter(b => b.status === 'accepted').length;
  const rejected = bookings.filter(b => b.status === 'rejected').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const acceptRate = total ? Math.round((accepted / total) * 100) : 0;
  const weekBars = [Math.max(1, total - 4), Math.max(1, accepted + 1), Math.max(1, pending + 2), Math.max(1, total - 2), Math.max(2, accepted + 2), Math.max(1, total), total + 1];

  const filtered = bookings.filter(b => filter === 'All' || b.status === filter.toLowerCase());

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen flex" style={{
      background: '#08080A',
      backgroundImage: `
        radial-gradient(ellipse 60% 40% at 80% 0%, rgba(249,115,22,0.07) 0%, transparent 55%),
        radial-gradient(ellipse 50% 35% at 10% 90%, rgba(234,88,12,0.05) 0%, transparent 50%)
      `,
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ─────────── SIDEBAR ─────────── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 relative" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* subtle top gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 40%)' }} />

        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-2.5 relative">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 18px rgba(249,115,22,0.35)' }}>
            {Icon.bolt}
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Consultify<span style={{ color: '#f97316' }}>.</span>
          </span>
        </div>

        {/* Search */}
        <div className="px-4 mb-5">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-white/20">{Icon.search}</span>
            <input placeholder="Search…" className="bg-transparent text-white/40 text-xs outline-none w-full placeholder:text-white/15" />
          </div>
        </div>

        {/* Nav items */}
        <nav className="px-3 flex-1 space-y-0.5">
          <p className="text-white/15 text-[9px] uppercase tracking-widest px-3.5 py-2">Main</p>
          <NavItem icon={Icon.grid} label="Dashboard" active={activeNav === 'dashboard'} onClick={() => setActiveNav('dashboard')} />
          <NavItem icon={Icon.calendar} label="Bookings" active={activeNav === 'bookings'} badge={pending} onClick={() => setActiveNav('bookings')} />
          <NavItem icon={Icon.chart} label="Analytics" active={activeNav === 'analytics'} onClick={() => setActiveNav('analytics')} />
          <NavItem icon={Icon.video} label="Sessions" active={activeNav === 'sessions'} onClick={() => setActiveNav('sessions')} />
          <p className="text-white/15 text-[9px] uppercase tracking-widest px-3.5 pt-5 pb-2">Account</p>
          <NavItem icon={Icon.user} label="Profile" active={activeNav === 'profile'} onClick={() => setActiveNav('profile')} />
          <NavItem icon={Icon.settings} label="Settings" active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} />
        </nav>

        {/* Expert card */}
        <div className="mx-3 mb-5 mt-4 p-4 rounded-2xl" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.12)' }}>
          <div className="w-9 h-9 rounded-xl overflow-hidden mb-3 flex items-center justify-center font-bold text-orange-300 text-sm"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}>
            {user?.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
              : (user?.name || 'E').charAt(0).toUpperCase()}
          </div>
          <p className="text-white text-sm font-medium leading-tight truncate">{user?.name || 'Expert'}</p>
<p className="text-white/30 text-xs mt-0.5 truncate">{user?.email}</p>
          <button onClick={logout} className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold w-full px-4 py-2.5 rounded-xl text-white transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.3)', border: 'none' }}>
            {Icon.logout} Sign out
          </button>
        </div>
      </aside>

      {/* ─────────── MAIN ─────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,10,0.6)', backdropFilter: 'blur(20px)' }}>
          <div>
            <p className="text-white/25 text-xs">
              Expert Portal <span className="text-white/20 mx-1.5">›</span>
              <span className="text-white/50">{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              {Icon.bell}
              {pending > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#f97316' }} />}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Expert Mode
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
                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">{user?.name?.split(' ')[0] || 'Expert'}</span>
                  </h1>
                  <p className="text-white/30 text-sm mt-1">Here's your activity overview.</p>
                </div>
                <span className="hidden sm:block text-xs text-white/20 border border-white/[0.06] px-3 py-1.5 rounded-xl">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Requests" value={total} icon={Icon.chart} color="#f97316" barData={weekBars} sub="All time" />
                <StatCard label="Pending" value={pending} icon={Icon.clock} color="#f59e0b" sub="Awaiting response" />
                <StatCard label="Accepted" value={accepted} icon={Icon.check} color="#10b981" sub="Sessions scheduled" />
                <StatCard label="Completed" value={completed} icon={Icon.play} color="#6366f1" sub="Past sessions" />
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Bar chart */}
                <div className={`${glass} p-6 lg:col-span-2`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-white font-medium text-sm tracking-tight">Booking Activity</p>
                      <p className="text-white/30 text-xs mt-0.5">Weekly request overview</p>
                    </div>
                    <span className="text-white/20 text-[10px] border border-white/[0.06] px-2.5 py-1 rounded-lg">Last 7 days</span>
                  </div>
                  <BarSpark data={weekBars} color="#f97316" height={100} />
                  <div className="flex mt-4 pt-4 border-t border-white/[0.04]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                      <span key={i} className="flex-1 text-center text-[10px] text-white/15">{d}</span>
                    ))}
                  </div>
                </div>

                {/* Donut + decline */}
                <div className="flex flex-col gap-4">
                  <div className={`${glass} p-5 flex-1 flex flex-col items-center justify-center`}>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest mb-4">Acceptance Rate</p>
                    <Donut pct={acceptRate} color="#f97316" size={110} />
                  </div>
                  <div className={`${glass} p-5`}>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Declined</p>
                    <p className="text-2xl font-bold text-white">{rejected}</p>
                    <div className="mt-3 h-1 rounded-full bg-white/[0.05]">
                      <div className="h-1 rounded-full transition-all duration-1000"
                        style={{ width: `${total ? (rejected / total) * 100 : 0}%`, background: 'linear-gradient(to right,#ef4444,#dc2626)' }} />
                    </div>
                    <p className="text-white/20 text-[10px] mt-1.5">{total ? Math.round((rejected / total) * 100) : 0}% decline rate</p>
                  </div>
                </div>
              </div>

              {/* Pending quick panel */}
              {pending > 0 && (
                <div className="rounded-2xl p-6" style={{ background: 'rgba(249,115,22,0.03)', border: '1px solid rgba(249,115,22,0.1)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                      <p className="text-white text-sm font-medium">Pending Requests</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}>{pending}</span>
                    </div>
                    <button onClick={() => setActiveNav('bookings')} className="text-xs text-orange-500/50 hover:text-orange-400 transition-colors">View all</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {bookings.filter(b => b.status === 'pending').slice(0, 3).map(b => (
                      <BookingCard key={b._id} booking={b} onAcceptClick={setAcceptTarget} onReject={handleReject} updating={updating} />
                    ))}
                  </div>
                </div>
              )}

              {/* Table */}
              <div className={`${glass} overflow-hidden`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
                  <div>
                    <p className="text-white text-sm font-medium">Recent Bookings</p>
                    <p className="text-white/25 text-xs mt-0.5">Latest incoming session requests</p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-14">
                    <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(249,115,22,0.15)', borderTopColor: '#f97316' }} />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-white/20">{Icon.calendar}</span>
                    </div>
                    <p className="text-white/30 text-sm">No bookings yet</p>
                    <p className="text-white/15 text-xs mt-1">Clients will appear here once they book with you</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {['Client', 'Requested', 'Time', 'Status', 'Action'].map(h => (
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
                                <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-[11px] font-bold"
                                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)', color: '#fb923c' }}>
                                  {(b.consulteeId?.name || 'C').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white/70 text-sm">{b.consulteeId?.name || '—'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-white/35 text-xs">{b.date}</td>
                            <td className="px-6 py-4 text-white/35 text-xs">{b.time}</td>
                            <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                            <td className="px-6 py-4">
                              {b.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <button onClick={() => setAcceptTarget(b)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110"
                                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                    Accept
                                  </button>
                                  <button onClick={() => handleReject(b._id)}
                                    className="px-3 py-1.5 rounded-lg text-xs text-red-300/70 transition-all hover:bg-red-500/10"
                                    style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
                                    Decline
                                  </button>
                                </div>
                              ) : b.status === 'accepted' ? (
                                <Link to={`/call/${b.meetingLink || 'demo'}`}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all hover:brightness-110"
                                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7' }}>
                                  {Icon.play} Start
                                </Link>
                              ) : <span className="text-white/15 text-xs">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ BOOKINGS ══ */}
          {activeNav === 'bookings' && (
            <>
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Session Bookings</h2>
                <p className="text-white/30 text-sm mt-1">Manage all consultation requests</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {['All', 'Pending', 'Accepted', 'Rejected', 'Completed'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={filter === f
                      ? { background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>
                    {f}{f === 'Pending' && pending > 0 && <span className="ml-1.5 text-orange-400">({pending})</span>}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(249,115,22,0.15)', borderTopColor: '#f97316' }} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-white/25 text-sm">No {filter !== 'All' ? filter.toLowerCase() : ''} bookings found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map(b => (
                    <BookingCard key={b._id} booking={b} onAcceptClick={setAcceptTarget} onReject={handleReject} updating={updating} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ══ PROFILE ══ */}
          {activeNav === 'profile' && (
            <ProfileTab user={user} setUser={setUser} stats={{ total, accepted, completed }} glass={glass} />
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

      {/* Accept Modal */}
      {acceptTarget && (
        <AcceptModal booking={acceptTarget} onConfirm={handleAcceptConfirm}
          onClose={() => setAcceptTarget(null)} loading={updating === acceptTarget._id} />
      )}
    </div>
  );
}
