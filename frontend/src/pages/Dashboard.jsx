import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(userInfo);
      fetchBookings(userInfo);
    }
  }, [navigate]);

  const fetchBookings = async (userInfo) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await api.get('/api/bookings', config);
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await api.put(`/api/bookings/${id}/status`, { status }, config);
      fetchBookings(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-32 px-4 pb-20">
      <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Dashboard</h1>
      
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-medium mb-6 text-white/90">Your Appointments</h2>
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {user?.role === 'expert' ? `Session with ${booking.consulteeId?.name || 'Client'}` : `Session with ${booking.expertId?.name || 'Expert'}`}
                  </h3>
                  <div className="flex items-center gap-3 text-white/60 mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {booking.time}
                    </span>
                  </div>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    booking.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 md:text-right w-full md:w-auto">
                  {user?.role === 'expert' && booking.status === 'pending' && (
                    <>
                      <button onClick={() => updateBookingStatus(booking._id, 'accepted')} className="liquid-button text-white px-5 py-2 rounded-lg text-sm font-medium transition-all">Accept</button>
                      <button onClick={() => updateBookingStatus(booking._id, 'rejected')} className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 px-5 py-2 rounded-lg text-sm font-medium transition-all">Reject</button>
                    </>
                  )}
                  {booking.status === 'accepted' && (
                    <Link to={`/call/${booking.meetingLink || 'demo-room'}`} className="liquid-button bg-blue-600/50 hover:bg-blue-600/70 border-blue-500/50 text-white px-6 py-2 rounded-lg text-sm font-medium text-center w-full md:w-auto transition-all text-center">
                      Join Call
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
