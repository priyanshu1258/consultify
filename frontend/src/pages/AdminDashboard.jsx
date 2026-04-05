import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

/* ─── Icons (inline SVG helpers) ─────────────────────────────────────── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  users:     'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  experts:   'M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z',
  bookings:  'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  whatsapp:  'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  logout:    'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  refresh:   'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10 M23 14l-4.64 4.36A9 9 0 013.51 15',
  check:     'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  trash:     'M3 6h18 M19 6l-1 14H6L5 6 M9 6V4h6v2 M10 11v6 M14 11v6',
  shield:    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  doc:       'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  close:     'M18 6L6 18 M6 6l12 12',
  download:  'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  image:     'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
};

/* ─── Nav config ─────────────────────────────────────────────────────── */
const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: ICONS.dashboard },
  { id: 'users',     label: 'All Users',  icon: ICONS.users     },
  { id: 'experts',   label: 'Experts',    icon: ICONS.experts   },
  { id: 'bookings',  label: 'Bookings',   icon: ICONS.bookings  },
  { id: 'whatsapp',  label: 'WhatsApp',   icon: ICONS.whatsapp  },
];

/* ─── Role badge ─────────────────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
  const cfg = {
    expert:    'bg-orange-500/15 text-orange-400 border-orange-500/25',
    consultee: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
    admin:     'bg-violet-500/15 text-violet-400 border-violet-500/25',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${cfg[role] || cfg.consultee}`}>
      {role}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   TAB: DASHBOARD
═══════════════════════════════════════════════════════════════════════ */
const TabDashboard = ({ stats, loading }) => {
  const cards = [
    { label: 'Total Consultees', value: stats.totalConsultees, color: 'text-sky-400',    bg: 'bg-sky-400/10',    icon: ICONS.users },
    { label: 'Total Experts',    value: stats.totalExperts,    color: 'text-orange-400', bg: 'bg-orange-400/10', icon: ICONS.experts },
    { label: 'Total Bookings',   value: stats.totalBookings,   color: 'text-emerald-400',bg: 'bg-emerald-400/10',icon: ICONS.bookings },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-semibold mb-1">Overview</h2>
        <p className="text-white/40 text-sm">Platform activity at a glance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(c => (
          <div key={c.label} className="bg-[#13151e] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center ${c.color} shrink-0`}>
              <Icon d={c.icon} size={20} />
            </div>
            <div>
              <p className="text-white/50 text-xs mb-0.5">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>
                {loading ? <span className="animate-pulse">—</span> : c.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info section */}
      <div className="bg-[#13151e] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon d={ICONS.shield} size={16} />
          <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider">Admin Privileges</h3>
        </div>
        <ul className="space-y-2.5 text-sm text-white/50">
          {[
            'View and delete all registered users and experts.',
            'Monitor all bookings across the platform.',
            'Manage WhatsApp OTP connection status.',
            'Platform statistics updated in real-time.',
          ].map(t => (
            <li key={t} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0"><Icon d={ICONS.check} size={14} /></span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   DOCUMENT VIEWER PANEL
═══════════════════════════════════════════════════════════════════════ */
const DocViewerPanel = ({ expert, onClose }) => {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docs, setDocs] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const load = async () => {
      setFetchLoading(true);
      setFetchError('');
      try {
        const res = await api.get(`/api/admin/users/${expert._id}/documents`);
        setDocs(res.data.expertDocuments || []);
      } catch (e) {
        setFetchError('Failed to load documents.');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [expert._id]);

  const downloadDoc = (doc) => {
    const a = document.createElement('a');
    a.href = doc.data;
    a.download = doc.name;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="ml-auto w-full max-w-lg h-full bg-[#0e1019] border-l border-white/[0.07] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div>
            <h3 className="text-white font-semibold text-base">{expert.name}'s Documents</h3>
            <p className="text-white/40 text-xs mt-0.5">
              {fetchLoading ? 'Loading…' : `${docs.length} document${docs.length !== 1 ? 's' : ''} uploaded`}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
            <Icon d={ICONS.close} size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-8 h-8 border-2 border-white/10 border-t-orange-400 rounded-full animate-spin" />
              <p className="text-white/30 text-sm">Loading documents…</p>
            </div>
          ) : fetchError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
              {fetchError}
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                <Icon d={ICONS.doc} size={24} />
              </div>
              <p className="text-white/30 text-sm">No documents uploaded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map((doc, i) => {
                const isPdf = doc.type === 'application/pdf';
                const isImg = doc.type?.startsWith('image/');
                return (
                  <div key={i} className="bg-[#13151e] border border-white/[0.06] rounded-xl overflow-hidden">
                    {/* Doc row */}
                    <div className="flex items-center gap-3 p-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPdf ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        <Icon d={isPdf ? ICONS.doc : ICONS.image} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/85 text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-white/35 text-xs mt-0.5">
                          {doc.type} &middot; {doc.data ? `${Math.round(doc.data.length * 0.75 / 1024)} KB` : 'Size N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {isImg && (
                          <button
                            onClick={() => setPreviewDoc(previewDoc === i ? null : i)}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors border border-blue-500/20">
                            {previewDoc === i ? 'Hide' : 'Preview'}
                          </button>
                        )}
                        <button
                          onClick={() => downloadDoc(doc)}
                          className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-medium transition-colors border border-orange-500/20 flex items-center gap-1">
                          <Icon d={ICONS.download} size={11} /> Download
                        </button>
                      </div>
                    </div>

                    {/* Image preview inline */}
                    {isImg && previewDoc === i && doc.data && (
                      <div className="px-4 pb-4">
                        <img
                          src={doc.data}
                          alt={doc.name}
                          className="w-full rounded-xl object-contain max-h-72 border border-white/[0.06] bg-black/20"
                        />
                      </div>
                    )}

                    {/* PDF hint */}
                    {isPdf && (
                      <div className="px-4 pb-3">
                        <p className="text-white/25 text-xs italic">PDF — click Download to open</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   TAB: USERS TABLE (reusable)
═══════════════════════════════════════════════════════════════════════ */
const UsersTable = ({ users, onDelete, role, loading }) => {
  const [docExpert, setDocExpert] = useState(null); // expert whose docs to view
  const filtered = users.filter(u => u.role === role);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold mb-0.5 capitalize">{role === 'consultee' ? 'All Consultees' : 'All Experts'}</h2>
          <p className="text-white/40 text-sm">{filtered.length} {role}(s) registered</p>
        </div>
      </div>
      <div className="bg-[#13151e] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['User', 'Contact', 'Gender', 'Role', role === 'expert' ? 'Docs' : '', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-[11px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3 bg-white/5 rounded animate-pulse w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-white/25 text-sm">No {role}s found.</td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/60 uppercase shrink-0 overflow-hidden">
                        {u.profilePicture ? <img src={u.profilePicture} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-white/85">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-white/70">{u.email}</p>
                    <p className="text-white/35 text-xs mt-0.5">{u.mobile || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-white/50 text-xs">{u.gender || '—'}</td>
                  <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                  {role === 'expert' && (
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setDocExpert(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: u.expertDocuments?.length > 0 ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.04)',
                          border: u.expertDocuments?.length > 0 ? '1px solid rgba(249,115,22,0.25)' : '1px solid rgba(255,255,255,0.08)',
                          color: u.expertDocuments?.length > 0 ? '#fb923c' : 'rgba(255,255,255,0.25)',
                        }}
                      >
                        <Icon d={ICONS.doc} size={11} />
                        {u.expertDocuments?.length > 0 ? `${u.expertDocuments.length} Doc${u.expertDocuments.length > 1 ? 's' : ''}` : 'No Docs'}
                      </button>
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onDelete(u._id, u.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1 rounded-lg text-xs font-medium"
                    >
                      <Icon d={ICONS.trash} size={12} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doc viewer panel */}
      {docExpert && <DocViewerPanel expert={docExpert} onClose={() => setDocExpert(null)} />}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   TAB: BOOKINGS
═══════════════════════════════════════════════════════════════════════ */
const TabBookings = ({ bookings, loading, fetchBookings }) => {
  const handleApprove = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await api.put(`/api/admin/bookings/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to approve booking', error);
      alert('Failed to approve payment');
    }
  };

  return (
  <div className="space-y-4">
    <div>
      <h2 className="text-white text-xl font-semibold mb-0.5">All Bookings</h2>
      <p className="text-white/40 text-sm">{bookings.length} booking(s) on the platform</p>
    </div>
    <div className="bg-[#13151e] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Consultee', 'Expert', 'Payment UTI', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="px-5 py-3.5 text-[11px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-3 bg-white/5 rounded animate-pulse w-28" /></td>
                  ))}
                </tr>
              ))
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center text-white/25 text-sm">No bookings yet.</td>
              </tr>
            ) : bookings.map(b => {
              const statusCfg = {
                pending_admin: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
                completed: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
              };
              return (
                <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white/75">{b.consulteeId?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-white/75">{b.expertId?.name || '—'}</td>
                  <td className="px-5 py-3.5 text-white/75 font-mono text-xs tracking-wider">{b.transactionId || 'N/A'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${statusCfg[b.status] || statusCfg.pending}`}>
                      {b.status === 'pending_admin' ? 'Awaiting Payment' : b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/45 text-xs">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    {b.status === 'pending_admin' && (
                      <button
                        onClick={() => handleApprove(b._id)}
                        className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Verify Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)};

/* ═══════════════════════════════════════════════════════════════════════
   TAB: WHATSAPP  (live QR polling)
═══════════════════════════════════════════════════════════════════════ */
const TabWhatsApp = () => {
  const [waStatus, setWaStatus] = useState('loading'); // loading | disconnected | qr_ready | connected
  const [qrUrl,    setQrUrl]    = useState(null);
  const [activeMethod, setActiveMethod] = useState('qr'); // 'qr' | 'phone'

  const poll = useCallback(async () => {
    try {
      const res = await api.get('/api/admin/whatsapp/qr');
      setWaStatus(res.data.status);
      setQrUrl(res.data.qr || null);
    } catch {
      setWaStatus('disconnected');
      setQrUrl(null);
    }
  }, []);

  useEffect(() => {
    poll();
    // Poll every 5s — QR expires every ~20s, this keeps it fresh
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [poll]);

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h2 className="text-white text-xl font-semibold mb-0.5">WhatsApp Settings</h2>
        <p className="text-white/40 text-sm">Manage WhatsApp connection for sending OTP messages.</p>
      </div>

      {/* Connect card */}
      <div className="bg-[#13151e] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h3 className="text-white/80 text-sm font-semibold">Connect WhatsApp</h3>

        {/* Method tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveMethod('qr')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${activeMethod === 'qr'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-white/50 hover:text-white/75'}`}
          >
            Scan QR Code
          </button>
          <button
            onClick={() => setActiveMethod('phone')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${activeMethod === 'phone'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-white/50 hover:text-white/75'}`}
          >
            Link with Phone Number
          </button>
        </div>

        {activeMethod === 'qr' ? (
          <div className="flex flex-col items-center gap-4 py-2">
            {/* ── Connected ── */}
            {waStatus === 'connected' && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Icon d={ICONS.check} size={32} />
                </div>
                <p className="text-emerald-400 font-semibold text-lg">WhatsApp Connected!</p>
                <p className="text-white/40 text-sm text-center">OTPs will be delivered via WhatsApp automatically.</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
            )}

            {/* ── QR Ready ── */}
            {waStatus === 'qr_ready' && qrUrl && (
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-xl shadow-lg shadow-black/40">
                  <img src={qrUrl} alt="WhatsApp QR Code" className="w-52 h-52 block" />
                </div>
                <p className="text-white/50 text-xs text-center">
                  Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
                </p>
                <div className="flex items-center gap-1.5 text-amber-400/70 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  QR refreshes automatically
                </div>
              </div>
            )}

            {/* ── Loading / Disconnected / Waiting ── */}
            {(waStatus === 'loading' || waStatus === 'disconnected') && !qrUrl && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-52 h-52 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-sky-400 rounded-full animate-spin" />
                  <p className="text-white/30 text-xs text-center px-4">
                    {waStatus === 'loading' ? 'Checking status…' : 'Waiting for server to generate QR…'}
                  </p>
                </div>
                <p className="text-white/35 text-xs text-center">
                  Make sure the backend server is running
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Phone number method (coming soon) */
          <div className="space-y-3">
            <label className="block text-white/50 text-xs font-medium">Enter Code from WhatsApp</label>
            <input
              type="text"
              placeholder="123-456"
              className="w-full bg-[#0d0f18] border border-white/10 rounded-xl px-4 py-2.5 text-white/70 text-sm outline-none focus:border-sky-500/40 transition-colors"
            />
            <button disabled className="w-full bg-white/10 text-white/30 text-sm font-medium py-2.5 rounded-xl cursor-not-allowed">
              Link Device (Coming Soon)
            </button>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs text-red-300/70">
              <strong>Note:</strong> Linking with phone number is not yet supported in this admin panel. Please use the QR Code method.
            </div>
          </div>
        )}
      </div>

      {/* Actions card */}
      <div className="bg-[#13151e] border border-white/[0.06] rounded-2xl p-6 space-y-3">
        <h3 className="text-white/80 text-sm font-semibold">Actions</h3>
        <div className="flex items-center justify-between bg-[#0d0f18] border border-white/[0.06] rounded-xl px-4 py-3">
          <div>
            <p className="text-white/75 text-sm font-medium">Check Status</p>
            <p className="text-white/35 text-xs mt-0.5">
              Current: <span className={`font-semibold ${waStatus === 'connected' ? 'text-emerald-400' : waStatus === 'qr_ready' ? 'text-amber-400' : 'text-red-400'}`}>{waStatus}</span>
            </p>
          </div>
          <button
            onClick={poll}
            className="flex items-center gap-2 bg-[#1e3a8a]/60 hover:bg-[#1e3a8a]/90 text-sky-300 border border-sky-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Icon d={ICONS.refresh} size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#13151e] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">How it works</p>
        </div>
        <p className="text-white/40 text-xs leading-relaxed">
          WhatsApp is used to send OTP codes to users during phone-based login. When connected, OTPs are delivered instantly via WhatsApp. If disconnected, OTPs are logged to the server console (development mode).
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats,    setStats]    = useState({ totalConsultees: 0, totalExperts: 0, totalBookings: 0 });
  const [users,    setUsers]    = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);

      // Try to fetch bookings (may not exist yet)
      try {
        const bookRes = await api.get('/api/admin/bookings');
        setBookings(bookRes.data);
      } catch { /* bookings endpoint may not exist */ }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the platform? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      const updated = users.filter(u => u._id !== id);
      setUsers(updated);
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove user.');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  /* ── Tab title map ── */
  const TITLES = {
    dashboard: 'Consultify Admin',
    users:     'Consultify Admin',
    experts:   'Consultify Admin',
    bookings:  'Consultify Admin',
    whatsapp:  'Consultify Admin',
  };

  return (
    /* Full-screen overlay — sits above the shared Navbar */
    <div className="fixed inset-0 z-[999] flex bg-[#0b0d14] font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className="w-[158px] shrink-0 bg-[#0e1019] border-r border-white/[0.05] flex flex-col py-5 px-3">

        {/* Brand pill */}
        <div className="mb-7 px-1">
          <div className="bg-white text-[#0e1019] text-sm font-bold rounded-lg px-4 py-2 text-center tracking-tight">
            Admin
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left
                  ${active
                    ? 'bg-[#3730a3] text-white shadow-lg shadow-indigo-900/40'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/[0.04]'
                  }`}
              >
                <span className={active ? 'text-white' : 'text-white/40'}>
                  <Icon d={item.icon} size={15} />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-red-600/90 hover:bg-red-600 text-white transition-colors mt-2"
        >
          <Icon d={ICONS.logout} size={15} />
          Logout
        </button>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.05] shrink-0">
          <h1 className="text-[#22d3ee] text-lg font-bold tracking-tight">
            {TITLES[activeTab]}
          </h1>
          <button
            onClick={fetchData}
            title="Refresh data"
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <Icon d={ICONS.refresh} size={17} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-7">
          {activeTab === 'dashboard' && (
            <TabDashboard stats={stats} loading={loading} />
          )}
          {activeTab === 'users' && (
            <UsersTable users={users} onDelete={handleDelete} role="consultee" loading={loading} />
          )}
          {activeTab === 'experts' && (
            <UsersTable users={users} onDelete={handleDelete} role="expert" loading={loading} />
          )}
          {activeTab === 'bookings' && (
            <TabBookings bookings={bookings} loading={loading} fetchBookings={fetchData} />
          )}
          {activeTab === 'whatsapp' && (
            <TabWhatsApp />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
