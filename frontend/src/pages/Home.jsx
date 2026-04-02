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
    <div className="relative min-h-[100vh] w-full pt-32 pb-20 flex flex-col items-center overflow-hidden">
      {/* Immersive glow background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[80vh] bg-gradient-to-br from-pink-600/30 via-purple-700/20 to-blue-600/30 blur-[100px] -z-10 rounded-[100%] pointer-events-none"
      ></motion.div>

      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center space-y-6 max-w-4xl mx-auto z-10 px-4"
      >
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">Elevate your career · Join Consultify</motion.p>
        <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-medium tracking-tight text-white leading-tight">
          Expert Advice, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">On Demand.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-6 text-lg text-white/60 max-w-2xl mx-auto font-light">
          Connect with industry leaders, mentors, and professionals for 1-on-1 video sessions. Gain all the skills you need to kick-start your path.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10">
          <Link to="/experts" className="liquid-button px-8 py-3 rounded-full text-sm font-medium text-white transition-all">
            Find an Expert
          </Link>
          <Link to="/register" className="liquid-button px-8 py-3 rounded-full text-sm font-medium text-white transition-all">
            Apply now
          </Link>
        </motion.div>
      </motion.div>

      {/* Info Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto mt-32 border-y border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-12 py-8 text-center text-white/80"
      >
         <div className="flex flex-col text-left">
           <span className="text-xs uppercase tracking-wider text-white/40 mb-1">Users</span>
           <span className="font-medium text-2xl">10,000+</span>
         </div>
         <div className="flex flex-col text-left">
           <span className="text-xs uppercase tracking-wider text-white/40 mb-1">Experts</span>
           <span className="font-medium text-2xl">500+</span>
         </div>
         <div className="flex flex-col text-left">
           <span className="text-xs uppercase tracking-wider text-white/40 mb-1">Mentorship</span>
           <span className="font-medium text-2xl">1-on-1</span>
         </div>
         <div className="flex flex-col text-left">
           <span className="text-xs uppercase tracking-wider text-white/40 mb-1">Format</span>
           <span className="font-medium text-2xl">Video Sessions</span>
         </div>
      </motion.div>

      {/* Value Preposition / Features */}
      <div className="w-full max-w-6xl mx-auto mt-32 px-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <button className="liquid-button text-white/80 rounded-full px-4 py-1.5 text-xs mb-6 inline-flex items-center space-x-2 hover:text-white transition-colors">
            <span>Learn more about us</span>
          </button>
          <h2 className="text-4xl md:text-5xl font-medium text-white">What's in it for you?</h2>
          <p className="text-white/50 mt-6 text-sm max-w-lg mx-auto">Gain all the skills you need to kick-start your professional path through mentoring by industry professionals.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div variants={fadeUp} className="glass-card p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Video size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">High Quality Video</h3>
            <p className="text-white/50 text-sm leading-relaxed">Seamless 1-on-1 video calls with integrated tools tailored for professionals.</p>
            <span className="absolute bottom-6 right-6 text-white/20 text-3xl font-light">01</span>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center mb-6 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Mentorship</h3>
            <p className="text-white/50 text-sm leading-relaxed">Take advantage of your mentor's expertise and gain industry-relevant feedback.</p>
            <span className="absolute bottom-6 right-6 text-white/20 text-3xl font-light">02</span>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
             <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Widely applicable</h3>
            <p className="text-white/50 text-sm leading-relaxed">The platform is designed to give you a solid foundation and boost your professional growth.</p>
            <span className="absolute bottom-6 right-6 text-white/20 text-3xl font-light">03</span>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-8 rounded-2xl flex flex-col items-start relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
             <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Star size={20} />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">Street cred</h3>
            <p className="text-white/50 text-sm leading-relaxed">Upon completion you will receive a certificate verifying your new skills.</p>
            <span className="absolute bottom-6 right-6 text-white/20 text-3xl font-light">04</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
