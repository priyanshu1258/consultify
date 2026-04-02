import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // Expert dashboard has its own built-in sidebar + topbar — hide the global Navbar there
  if (pathname === '/expert-dashboard') return null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent border-b border-white/10">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          Consultify<span className="text-pink-500">.</span>
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/experts" className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider">Find Experts</Link>
          {user ? (
            <>
              <Link
                to={user?.role === 'expert' ? '/expert-dashboard' : '/consultee-dashboard'}
                className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider"
              >
                Dashboard
              </Link>
              <button onClick={logoutHandler} className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition uppercase tracking-wider">Login</Link>
              <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
