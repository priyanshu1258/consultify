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
  const navigate = useNavigate();

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
      await api.post('/api/bookings', { expertId: id, date, time }, config);
      setSuccess('Booking request sent successfully!');
      setDate('');
      setTime('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book session');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !expert) return <div className="text-red-500">{error || 'Expert not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-32 px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 border rounded-xl shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {expert.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{expert.name}</h1>
              <p className="text-gray-500 text-lg">${expert.pricingPerSession || 0} / session</p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">About me</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{expert.bio || 'No bio provided.'}</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {expert.skills?.map(skill => (
               <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded">
                 {skill}
               </span>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="bg-white p-6 border rounded-xl shadow-sm sticky top-6">
          <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}
          <form onSubmit={handleBookSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input 
                type="date" 
                required 
                className="mt-1 w-full p-2 border rounded-md" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input 
                type="time" 
                required 
                className="mt-1 w-full p-2 border rounded-md" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition font-medium">
              Request Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
