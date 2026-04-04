import { useParams, useNavigate } from 'react-router-dom';

const VideoCall = () => {
  const { meetingLink } = useParams();
  const navigate = useNavigate();

  const handleEndCall = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo?.role === 'expert') {
      navigate('/expert-dashboard');
    } else {
      navigate('/consultee-dashboard');
    }
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Anonymous' };
  
  // Format the URL with parameters to disable Jitsi's promotional screens
  const roomName = `ConsultifySession-${meetingLink}`;
  const displayName = encodeURIComponent(userInfo.name);
  
  // Note: meet.jit.si requires the first user (moderator) to log in with Google to prevent spam.
  // We added 'popups' to the iframe permissions so you can log in directly inside the app.
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${displayName}"&config.disableDeepLinking=true&config.prejoinPageEnabled=false`;

  return (
    <div className="flex flex-col h-screen pt-20 bg-gray-950 max-w-full w-full relative">
      <div className="flex-1 w-full h-full pb-4">
        {/* Using standard iframe ensures browser honors the 'allow' attributes immediately before load */}
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; clipboard-read; popups; popups-to-escape-sandbox"
          style={{ height: '100%', width: '100%', border: 'none' }}
          title="Consultify Video Session"
        />
      </div>

      {/* Floating Leave Button since we cannot listen to Jitsi iframe events due to cross-origin */}
      <button 
        onClick={handleEndCall}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold shadow-2xl shadow-red-900/50 flex items-center gap-2 border border-red-400/20 transition-all hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M10.5 15.5l-4-4 4-4" />
            <path d="M21 11.5v-4a2 2 0 0 0-2-2H9v12h10a2 2 0 0 0 2-2v-4" />
            <line x1="6.5" y1="11.5" x2="16.5" y2="11.5" />
        </svg>
        Return to Dashboard
      </button>
    </div>
  );
};

export default VideoCall;
