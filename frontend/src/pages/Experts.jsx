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
    <div className="min-h-screen bg-[#08080A] text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Soft Arc Glow Component matching Auth/Home pages */}
      <div className="absolute top-0 right-1/4 -translate-y-1/4 w-[800px] h-[800px] pointer-events-none z-0">
          <svg viewBox="0 0 800 800" className="w-full h-full opacity-30 blur-[80px]">
            <circle cx="400" cy="400" r="300" fill="transparent" stroke="#ea580c" strokeWidth="60" />
            <circle cx="400" cy="400" r="200" fill="#c2410c" opacity="0.3" filter="blur(40px)" />
          </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-medium text-white mb-2">Find Experts</h1>
        <p className="text-white/40 text-sm mb-12">Discover domain experts and book your next session.</p>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-white/50 animate-pulse text-lg tracking-widest font-mono">LOADING...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map(expert => (
              <Link to={`/experts/${expert._id}`} key={expert._id} className="group relative bg-[#0B0C10] backdrop-blur-xl border border-white/[0.05] hover:border-orange-500/30 rounded-3xl shadow-2xl hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] transition-all duration-500 flex flex-col overflow-hidden transform hover:-translate-y-1">
                {/* Arc gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Header Banner */}
                <div className="h-20 w-full bg-gradient-to-r from-orange-400/20 to-orange-600/5 border-b border-white/[0.04]"></div>
                
                <div className="p-6 pt-0 flex flex-col flex-grow relative z-10">
                  <div className="flex justify-between items-end -mt-10 mb-4">
                    {/* Avatar */}
                    {expert.profilePicture ? (
                      <img src={expert.profilePicture} alt={expert.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0B0C10] shadow-[0_8px_16px_rgba(0,0,0,0.6)] z-10" />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 text-orange-400 border-4 border-[#0B0C10] rounded-2xl flex items-center justify-center text-3xl font-bold shadow-[0_8px_16px_rgba(0,0,0,0.6)] z-10">
                        {expert.name.charAt(0)}
                      </div>
                    )}
                    {/* Price Ribbon */}
                    <div className="mb-2 bg-[#12131A] border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                       <span className="text-orange-400 font-bold text-sm tracking-wide">₹{expert.pricingPerSession || 0}</span>
                       <span className="text-white/30 text-[10px] uppercase font-semibold">/ session</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white tracking-tight mb-1">{expert.name}</h2>
                  
                  <p className="text-white/40 text-xs mb-5 flex-grow line-clamp-3 leading-relaxed">
                    {expert.bio || 'Consulting expert available for booking.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {expert.skills?.slice(0, 4).map(skill => (
                      <span key={skill} className="bg-white/5 border border-white/[0.06] text-white/60 text-[10px] font-medium px-2.5 py-1 rounded-md tracking-wider uppercase">
                        {skill}
                      </span>
                    ))}
                    {expert.skills?.length > 4 && (
                      <span className="bg-white/5 border border-white/[0.06] text-white/40 text-[10px] font-medium px-2 py-1 rounded-md">
                        +{expert.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-orange-400 font-medium text-xs tracking-wide uppercase group-hover:text-orange-300 transition-colors">
                    <span>View Profile</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experts;
