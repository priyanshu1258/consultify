import { Link } from 'react-router-dom';
import { Video, Calendar, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const Home = () => {
  return (
    <div className="relative min-h-[100vh] w-full pt-40 pb-20 flex flex-col items-center overflow-hidden bg-[#08080A]">
      
      {/* Background SVG Arcs - RedSun Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[800px] pointer-events-none -translate-y-10 z-0">
         <svg viewBox="0 0 1000 500" className="w-full h-full opacity-90 drop-shadow-[0_0_40px_rgba(249,115,22,0.6)]">
           <defs>
             <radialGradient id="sun-core" cx="50%" cy="100%" r="60%">
               <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
               <stop offset="70%" stopColor="#c2410c" stopOpacity="0.2" />
               <stop offset="100%" stopColor="#08080A" stopOpacity="0" />
             </radialGradient>
             <linearGradient id="arc-glow" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#08080A" stopOpacity="0"/>
               <stop offset="20%" stopColor="#ea580c" stopOpacity="0.8"/>
               <stop offset="50%" stopColor="#fb923c" stopOpacity="1"/>
               <stop offset="80%" stopColor="#ea580c" stopOpacity="0.8"/>
               <stop offset="100%" stopColor="#08080A" stopOpacity="0"/>
             </linearGradient>
           </defs>
           {/* Deep Core Glow */}
           <path d="M 100 500 A 400 350 0 0 1 900 500" fill="url(#sun-core)" className="blur-[80px]" />
           
           {/* Main Outer Arc */}
           <path d="M 100 500 A 400 380 0 0 1 900 500" fill="transparent" stroke="url(#arc-glow)" strokeWidth="6" />
           {/* Secondary Blurred Tracking Arc */}
           <path d="M 100 500 A 400 380 0 0 1 900 500" fill="transparent" stroke="url(#arc-glow)" strokeWidth="20" className="blur-[15px]" opacity="0.5" />
           
           {/* Inner Sharp Arc */}
           <path d="M 250 500 A 250 250 0 0 1 750 500" fill="transparent" stroke="#ffedd5" strokeWidth="1" opacity="0.3" />
         </svg>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center space-y-8 max-w-5xl mx-auto z-10 px-4 mt-8"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-sm mx-auto shadow-[0_0_15px_rgba(249,115,22,0.15)]">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>Welcome To Consultify</span>
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-6xl md:text-[5.5rem] font-medium tracking-tight text-white leading-[1.1]">
          Expert Advice, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-100 to-white drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">On Demand.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
          Connect with industry leaders, mentors, and professionals for 1-on-1 video sessions. Gain the guidance you need to accelerate your path.
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
          <Link to="/experts" className="bg-transparent border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all backdrop-blur-sm">
            Find an Expert
          </Link>
          <Link to="/register" className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-400/50 text-white px-9 py-3.5 rounded-full text-sm font-bold hover:brightness-110 hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all flex items-center space-x-2">
            <span>Register Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </motion.div>
      </motion.div>

      {/* Modern Analytics/Dashboard Graphic Stand-in */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto mt-24 z-10 px-4 relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 to-red-600/30 blur-2xl z-0 rounded-[2rem]"></div>
        <div className="bg-[#0f0f13] border border-white/10 p-2 rounded-[2rem] shadow-2xl relative z-10 overflow-hidden">
          <div className="w-full h-12 bg-black/40 border-b border-white/5 flex items-center px-6 space-x-2">
             <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
             {/* Mock Dashboard UI Elements */}
             <div className="col-span-1 border border-white/5 bg-black/40 p-6 rounded-2xl h-48 flex flex-col justify-between">
                <div className="h-4 w-24 bg-white/10 rounded-full"></div>
                <div className="space-y-3">
                   <div className="h-10 w-10 bg-orange-500/20 rounded-full"></div>
                   <div className="h-6 w-32 bg-white/20 rounded-full"></div>
                </div>
             </div>
             <div className="col-span-2 border border-white/5 bg-black/40 p-6 rounded-2xl h-48 flex items-end space-x-4">
                {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-orange-500/30 rounded-t-sm hover:bg-orange-500/50 transition-colors" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>

      {/* Info Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto mt-32 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-12 py-10 text-center text-white/50"
      >
         <div className="flex flex-col text-left space-y-2">
           <span className="text-xl font-light text-white">10,000<span className="text-orange-500">+</span></span>
           <span className="text-xs uppercase tracking-wider">Active Users</span>
         </div>
         <div className="flex flex-col text-left space-y-2">
           <span className="text-xl font-light text-white">500<span className="text-orange-500">+</span></span>
           <span className="text-xs uppercase tracking-wider">Top Experts</span>
         </div>
         <div className="flex flex-col text-left space-y-2">
           <span className="text-xl font-light text-white">24/7</span>
           <span className="text-xs uppercase tracking-wider">Availability</span>
         </div>
         <div className="flex flex-col text-left space-y-2">
           <span className="text-xl font-light text-white">100<span className="text-orange-500">%</span></span>
           <span className="text-xs uppercase tracking-wider">Satisfaction</span>
         </div>
      </motion.div>

      {/* Value Preposition / Features */}
      <div className="w-full max-w-6xl mx-auto mt-32 px-4 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase mb-4 block">Our Key Features</span>
          <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Discover the Magic Behind<br/>Our Platform</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div variants={fadeUp} className="glass-card bg-[#0b0c10]/80 p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <Video size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">High Quality Video</h3>
            <p className="text-white/40 text-sm leading-relaxed">Seamless 1-on-1 video calls with integrated tools tailored for professionals.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card bg-[#0b0c10]/80 p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Mentorship</h3>
            <p className="text-white/40 text-sm leading-relaxed">Take advantage of your mentor's expertise and gain industry-relevant feedback.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card bg-[#0b0c10]/80 p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
             <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Flexible Booking</h3>
            <p className="text-white/40 text-sm leading-relaxed">The platform is designed to give you complete control over your scheduling.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card bg-[#0b0c10]/80 p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
             <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
              <Star size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Verified Experts</h3>
            <p className="text-white/40 text-sm leading-relaxed">We strictly vet all professionals to make sure you get premium advice.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
