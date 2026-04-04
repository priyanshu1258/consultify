import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConsulteeDashboard from './pages/ConsulteeDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import Experts from './pages/Experts';
import ExpertProfile from './pages/ExpertProfile';
import VideoCall from './pages/VideoCall';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultee-dashboard" element={<ConsulteeDashboard />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/experts/:id" element={<ExpertProfile />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/call/:meetingLink" element={<VideoCall />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
