import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');
  const [selectedDocs, setSelectedDocs] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData(userInfo);
  }, [navigate]);

  const fetchData = async (userInfo) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [paymentsRes, expertsRes] = await Promise.all([
        api.get('/api/admin/bookings', config),
        api.get('/api/admin/experts', config)
      ]);
      setPayments(paymentsRes.data);
      setExperts(expertsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (bookingId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.put(`/api/admin/bookings/${bookingId}/verify`, {}, config);
      setPayments(payments.filter(p => p._id !== bookingId));
    } catch (err) {
      console.error(err);
      alert('Failed to verify payment');
    }
  };

  const verifyExpertDocs = async (expertId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.put(`/api/admin/experts/${expertId}/verify-docs`, {}, config);
      setExperts(experts.filter(e => e._id !== expertId));
    } catch (err) {
      console.error(err);
      alert('Failed to verify documents');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Admin Portal</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'payments' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Pending Payments ({payments.length})
        </button>
        <button 
          onClick={() => setActiveTab('experts')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'experts' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Expert Approvals ({experts.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 bg-white/5 border border-white/10">
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-xl font-semibold text-white/90 mb-6">Payment Verifications</h2>
              {payments.length === 0 ? (
                 <p className="text-white/50 text-center py-8">No pending payments to verify.</p>
              ) : (
                <div className="space-y-4">
                  {payments.map(payment => (
                    <div key={payment._id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">Session with {payment.expertId?.name}</p>
                        <p className="text-sm text-white/50 mb-1">Consultee: {payment.consulteeId?.name} ({payment.consulteeId?.email})</p>
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                          <span className="text-xs text-blue-300 font-mono">UTR: {payment.utrNumber}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => verifyPayment(payment._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-900/30 whitespace-nowrap"
                      >
                        Verify & Confirm
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'experts' && (
            <div>
              <h2 className="text-xl font-semibold text-white/90 mb-6">Expert Document Verifications</h2>
              {experts.length === 0 ? (
                 <p className="text-white/50 text-center py-8">No experts waiting for approval.</p>
              ) : (
                <div className="space-y-4">
                  {experts.map(expert => (
                    <div key={expert._id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{expert.name}</p>
                        <p className="text-sm text-white/50">{expert.email}</p>
                        <p className="text-xs text-amber-300 mt-1">{expert.expertDocuments?.length || 0} document(s) uploaded</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                          onClick={() => setSelectedDocs(expert.expertDocuments || [])}
                        >
                          View Docs
                        </button>
                        <button 
                          onClick={() => verifyExpertDocs(expert._id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-900/30"
                        >
                          Approve Expert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocs !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F1014] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Expert Documents</h3>
              <button onClick={() => setSelectedDocs(null)} className="text-white/50 hover:text-white transition">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedDocs.map((doc, idx) => {
                const isDataUrl = doc.data && doc.data.startsWith('data:');
                const fileUrl = isDataUrl ? doc.data : `${API_BASE_URL}${doc.data}`;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                    <p className="text-white font-medium">{doc.name || 'Document'}</p>
                    <p className="text-sm text-white/50">{doc.type}</p>
                    <div className="bg-black/50 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 p-2">
                      {doc.type === 'application/pdf' ? (
                        <iframe src={fileUrl} className="w-full h-96 border-none bg-white object-contain rounded" />
                      ) : (
                        <img src={fileUrl} alt={doc.name} className="max-w-full max-h-96 object-contain rounded" />
                      )}
                    </div>
                  </div>
                );
              })}
              {selectedDocs.length === 0 && <p className="text-white/50">No documents found.</p>}
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedDocs(null)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
