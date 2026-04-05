import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detailed dashboards have their own built-in sidebar + topbar — hide the global Navbar there
  if (['/expert-dashboard', '/consultee-dashboard', '/admin-dashboard'].includes(pathname)) return null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const NavLinks = ({ mobile }) => (
    <>
      <Link to="/experts" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider">Find Experts</Link>
      {user ? (
        <>
          <Link
            to={user?.role === 'expert' ? '/expert-dashboard' : '/consultee-dashboard'}
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider"
          >
            Dashboard
          </Link>
          <button onClick={logoutHandler} className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider text-left">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider">Login</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className={`bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-400/50 text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all ${mobile ? 'inline-block text-center' : ''}`}>Sign Up</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent border-b border-white/10">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight z-50">
          Consultify<span className="text-orange-500">.</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLinks mobile={false} />
        </div>

        {/* Mobile Hamburger Icon */}
        <button 
          className="md:hidden text-white p-2 z-50 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-8 pt-16 border-b border-white/10">
          <NavLinks mobile={true} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
