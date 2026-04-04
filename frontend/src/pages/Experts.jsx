import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data } = await api.get('/api/users/experts');
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
    <div className="min-h-screen bg-[#08080A] pt-32 px-4 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto relative z-10 antialiased">
        <div className="mb-12">
          <p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-1 flex items-center gap-2">
            <span className="w-8 h-px bg-orange-500/50" />
            Our Roster
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Find the Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Expert</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
            Connect with top-tier professionals ready to guide you through your challenges with 1-on-1 personalized sessions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experts.map(expert => (
              <div key={expert._id} className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                {/* Card Background / Blur */}
                <div className="absolute inset-0 bg-[#12131A]/80 backdrop-blur-xl border border-white/10 group-hover:border-orange-500/30 transition-colors z-0" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-orange-600/10 to-transparent transition-opacity duration-500 z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full p-6">
                  {/* Header: Avatar, Name, Price */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1C1F2A] to-[#252836] border border-white/10 flex items-center justify-center font-bold text-orange-400 text-2xl overflow-hidden flex-shrink-0 shadow-lg relative">
                      {expert.profilePicture ? (
                         <img src={expert.profilePicture} alt={expert.name} className="w-full h-full object-cover" />
                      ) : (
                         expert.name.charAt(0).toUpperCase()
                      )}
                      
                      {/* Sub-badge indicating expert status visually */}
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#12131A] rounded-full" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-semibold text-lg leading-tight truncate">{expert.name}</h2>
                      <div className="flex items-center mt-1">
                        <span className="text-white/30 text-xs mr-1">per session</span>
                        <span className="text-emerald-400 font-medium text-sm">₹{expert.pricingPerSession || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {expert.bio || 'This expert has not provided a bio yet.'}
                  </p>

                  {/* Skills */}
                  <div className="mb-6 h-[50px] overflow-hidden relative">
                    <div className="flex flex-wrap gap-2">
                      {expert.skills && expert.skills.length > 0 ? expert.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide text-white/70 bg-white/[0.04] border border-white/[0.08]">
                          {skill}
                        </span>
                      )) : (
                        <span className="text-white/20 text-xs italic">Flexible domain</span>
                      )}
                      {expert.skills && expert.skills.length > 4 && (
                        <span className="px-2 py-1 rounded-full text-[11px] font-medium tracking-wide text-white/40 bg-white/[0.02] border border-transparent">
                          +{expert.skills.length - 4}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[10px] bg-gradient-to-t from-[#12131A] to-transparent pointer-events-none" />
                  </div>

                  {/* Action */}
                  <Link 
                    to={`/experts/${expert._id}`} 
                    className="flex justify-center items-center w-full bg-white/[0.03] hover:bg-orange-500 text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/[0.05] hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:bg-white/[0.08]"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experts;
