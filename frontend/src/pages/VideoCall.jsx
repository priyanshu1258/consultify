import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useState, useEffect } from 'react';
import api from '../api';

const VideoCall = () => {
  const { meetingLink, bookingId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleReadyToClose = async () => {
    if (userInfo?.role === 'expert') {
      if (bookingId) {
        try {
          await api.put(`/api/bookings/${bookingId}/status`, 
            { status: 'completed' }, 
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
        } catch (err) {
          console.error("Failed to update booking status to completed:", err);
        }
      }
      navigate('/expert-dashboard');
    } else if (userInfo?.role === 'consultee') {
      navigate('/consultee-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col h-[85vh] mt-24 max-w-7xl mx-auto w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative z-10 bg-[#0F1014]">
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 text-sm rounded-full z-50 pointer-events-none border border-white/10">
        Meeting ID: {meetingLink ? meetingLink.substring(0, 8) + '...' : 'Demo'}
      </div>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`Consultify-${meetingLink || 'PublicRoom'}`}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
          prejoinPageEnabled: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        }}
        userInfo={{
          displayName: userInfo?.name || 'Guest',
          email: userInfo?.email || ''
        }}
        onApiReady={(externalApi) => {
           externalApi.addListener('readyToClose', handleReadyToClose);
           externalApi.addListener('videoConferenceLeft', handleReadyToClose);
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.style.border = 'none';
        }}
      />
    </div>
  );
};

export default VideoCall;
