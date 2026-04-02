import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

const VideoCall = () => {
  const { meetingLink } = useParams();
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const handleEndCall = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-[85vh] mt-24 max-w-7xl mx-auto w-full px-4 bg-gray-900 rounded-xl overflow-hidden relative">
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
          {videoOn ? (
            <div className="text-white text-center">
              <span className="block text-6xl">👤</span>
              <p className="mt-2">Self</p>
            </div>
          ) : (
             <div className="text-gray-500 text-center">
                <VideoOff size={48} className="mx-auto" />
                <p className="mt-2">Video Paused</p>
             </div>
          )}
          <span className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">You</span>
        </div>

        <div className="bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
           <div className="text-white text-center">
              <span className="block text-6xl">🧑‍🏫</span>
              <p className="mt-2">Other Participant</p>
            </div>
            <span className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">Participant</span>
        </div>
      </div>

      <div className="h-20 bg-gray-950 flex items-center justify-center space-x-6">
        <button 
          onClick={() => setMicOn(!micOn)} 
          className={`p-4 rounded-full ${micOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {micOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        <button 
          onClick={() => setVideoOn(!videoOn)} 
          className={`p-4 rounded-full ${videoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {videoOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>

        <button 
          onClick={handleEndCall} 
          className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 px-8 flex items-center space-x-2"
        >
          <PhoneOff size={24} />
          <span>End Call</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 text-sm rounded-full">
        Meeting ID: {meetingLink.substring(0, 8)}...
      </div>
    </div>
  );
};

export default VideoCall;
