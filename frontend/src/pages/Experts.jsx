import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/experts');
        setExperts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-32 px-4 pb-12">
      <h1 className="text-3xl font-bold mb-8">Find Experts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map(expert => (
            <div key={expert._id} className="bg-white p-6 border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {expert.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold">{expert.name}</h2>
              <p className="text-gray-500 mb-4 line-clamp-2">{expert.bio || 'No bio available.'}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {expert.skills?.map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="font-medium text-lg mb-4">${expert.pricingPerSession || 0} / session</p>
              <Link to={`/experts/${expert._id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experts;
