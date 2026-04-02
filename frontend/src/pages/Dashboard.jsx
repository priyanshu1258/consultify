import { useState, useEffect } from 'react';
import axios from 'axios';
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
      const { data } = await axios.get('http://localhost:5000/api/bookings', config);
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
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status }, config);
      fetchBookings(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-32 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="border p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {user?.role === 'expert' ? `Session with ${booking.consulteeId?.name}` : `Session with ${booking.expertId?.name}`}
                  </p>
                  <p className="text-sm text-gray-500">{booking.date} at {booking.time}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="text-right space-x-2">
                  {user?.role === 'expert' && booking.status === 'pending' && (
                    <>
                      <button onClick={() => updateBookingStatus(booking._id, 'accepted')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Accept</button>
                      <button onClick={() => updateBookingStatus(booking._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
                    </>
                  )}
                  {booking.status === 'accepted' && (
                    <Link to={`/call/${booking.meetingLink}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
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
