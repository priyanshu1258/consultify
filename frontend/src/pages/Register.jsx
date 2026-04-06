import { useState, useRef } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

/* ─── Animated Boy Avatar ─────────────────────────────────────── */
const BoyAvatar = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <style>{`
        .boy-float { animation: boyFloat 3s ease-in-out infinite; transform-origin: center; }
        .boy-blink { animation: boyBlink 4s ease-in-out infinite; transform-origin: center; }
        .boy-hair  { animation: boyHair 2.5s ease-in-out infinite alternate; transform-origin: top center; }
        @keyframes boyFloat  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-4px)} }
        @keyframes boyBlink  { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.1)} }
        @keyframes boyHair   { from{transform:rotate(-1deg)}    to{transform:rotate(1deg)} }
      `}</style>
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#0f1623" />
      </radialGradient>
      <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#f5c5a3" />
        <stop offset="100%" stopColor="#e8a882" />
      </radialGradient>
      <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    {/* Background */}
    <circle cx="60" cy="60" r="60" fill="url(#bgGrad)" />
    {/* Body + shirt */}
    <g className="boy-float">
      {/* Shirt/torso */}
      <ellipse cx="60" cy="100" rx="26" ry="18" fill="url(#shirtGrad)" />
      {/* Neck */}
      <rect x="54" y="81" width="12" height="10" rx="4" fill="#e8a882" />
      {/* Head */}
      <ellipse cx="60" cy="68" rx="22" ry="24" fill="url(#skinGrad)" />
      {/* Hair */}
      <g className="boy-hair">
        <ellipse cx="60" cy="47" rx="22" ry="10" fill="#3d2314" />
        <ellipse cx="60" cy="50" rx="22" ry="6"  fill="#3d2314" />
        <rect x="38" y="47" width="5" height="14" rx="3" fill="#3d2314" />
        <rect x="77" y="47" width="5" height="14" rx="3" fill="#3d2314" />
      </g>
      {/* Eyes */}
      <g className="boy-blink">
        <ellipse cx="52" cy="68" rx="4" ry="4.5" fill="#fff" />
        <ellipse cx="68" cy="68" rx="4" ry="4.5" fill="#fff" />
        <circle cx="53" cy="69" r="2.2" fill="#3d2314" />
        <circle cx="69" cy="69" r="2.2" fill="#3d2314" />
        <circle cx="54" cy="68" r="0.8" fill="#fff" />
        <circle cx="70" cy="68" r="0.8" fill="#fff" />
      </g>
      {/* Eyebrows */}
      <line x1="48" y1="62" x2="56" y2="61" stroke="#3d2314" strokeWidth="2" strokeLinecap="round" />
      <line x1="64" y1="61" x2="72" y2="62" stroke="#3d2314" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="74" rx="2" ry="1.5" fill="#c98b6a" />
      {/* Smile */}
      <path d="M53 79 Q60 85 67 79" stroke="#c98b6a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="38" cy="69" rx="4" ry="5" fill="#e8a882" />
      <ellipse cx="82" cy="69" rx="4" ry="5" fill="#e8a882" />
      {/* Arms */}
      <ellipse cx="36" cy="98" rx="7" ry="12" fill="url(#shirtGrad)" transform="rotate(-10 36 98)" />
      <ellipse cx="84" cy="98" rx="7" ry="12" fill="url(#shirtGrad)" transform="rotate(10 84 98)" />
    </g>
    {/* Shimmer ring */}
    <circle cx="60" cy="60" r="58" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="12s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── Animated Girl Avatar ────────────────────────────────────── */
const GirlAvatar = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <style>{`
        .girl-float { animation: girlFloat 3s ease-in-out infinite; transform-origin: center; }
        .girl-blink { animation: girlBlink 4.5s ease-in-out infinite; transform-origin: center; }
        .girl-hair  { animation: girlHair 3s ease-in-out infinite alternate; transform-origin: top center; }
        @keyframes girlFloat  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-4px)} }
        @keyframes girlBlink  { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
        @keyframes girlHair   { from{transform:rotate(-1.5deg)} to{transform:rotate(1.5deg)} }
      `}</style>
      <radialGradient id="girlBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4a1040" />
        <stop offset="100%" stopColor="#1a0818" />
      </radialGradient>
      <radialGradient id="girlSkin" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#f8d0b0" />
        <stop offset="100%" stopColor="#edb898" />
      </radialGradient>
      <linearGradient id="girlTop" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="60" fill="url(#girlBg)" />
    <g className="girl-float">
      {/* Dress/shirt */}
      <ellipse cx="60" cy="103" rx="30" ry="16" fill="url(#girlTop)" />
      <ellipse cx="60" cy="98" rx="26" ry="14" fill="url(#girlTop)" />
      {/* Neck */}
      <rect x="55" y="81" width="10" height="10" rx="4" fill="#edb898" />
      {/* Head */}
      <ellipse cx="60" cy="68" rx="21" ry="23" fill="url(#girlSkin)" />
      {/* Long hair back */}
      <g className="girl-hair">
        <ellipse cx="60" cy="48" rx="24" ry="11" fill="#8B1A1A" />
        <rect x="36" y="48" width="10" height="35" rx="5" fill="#8B1A1A" />
        <rect x="74" y="48" width="10" height="35" rx="5" fill="#8B1A1A" />
        <ellipse cx="60" cy="50" rx="21" ry="8" fill="#a52020" />
      </g>
      {/* Eyes */}
      <g className="girl-blink">
        <ellipse cx="52" cy="68" rx="4.5" ry="4.5" fill="#fff" />
        <ellipse cx="68" cy="68" rx="4.5" ry="4.5" fill="#fff" />
        <circle cx="53" cy="69" r="2.5" fill="#5c2d0e" />
        <circle cx="69" cy="69" r="2.5" fill="#5c2d0e" />
        <circle cx="54" cy="68" r="1"   fill="#fff" />
        <circle cx="70" cy="68" r="1"   fill="#fff" />
        {/* Lashes */}
        <line x1="48" y1="64" x2="50" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="63" x2="52" y2="61" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="56" y1="64" x2="57" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="64" y1="64" x2="63" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="68" y1="63" x2="68" y2="61" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="72" y1="64" x2="74" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* Brows */}
      <path d="M47 62 Q52 59 57 61" stroke="#8B1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M63 61 Q68 59 73 62" stroke="#8B1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="74" rx="1.8" ry="1.2" fill="#d9967a" />
      {/* Smile + lips */}
      <path d="M54 79 Q60 85 66 79" stroke="#d9967a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="80" rx="5" ry="1.8" fill="#f472b6" opacity="0.6" />
      {/* Ears */}
      <ellipse cx="39" cy="69" rx="4"  ry="5" fill="#edb898" />
      <ellipse cx="81" cy="69" rx="4"  ry="5" fill="#edb898" />
      {/* Earrings */}
      <circle cx="39" cy="75" r="2"  fill="#ec4899" />
      <circle cx="81" cy="75" r="2"  fill="#ec4899" />
      {/* Cheek blush */}
      <ellipse cx="46" cy="75" rx="6" ry="3.5" fill="#f9a8d4" opacity="0.35" />
      <ellipse cx="74" cy="75" rx="6" ry="3.5" fill="#f9a8d4" opacity="0.35" />
      {/* Arms */}
      <ellipse cx="33" cy="100" rx="7" ry="13" fill="url(#girlTop)" transform="rotate(-12 33 100)" />
      <ellipse cx="87" cy="100" rx="7" ry="13" fill="url(#girlTop)" transform="rotate(12 87 100)" />
    </g>
    {/* Shimmer ring */}
    <circle cx="60" cy="60" r="58" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="10s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── Neutral Avatar ──────────────────────────────────────────── */
const NeutralAvatar = () => (
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <style>{`
        .neut-bounce {
          animation: neutBounce 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite alternate;
          transform-origin: 60px 60px;
        }
        .neut-shadow {
          animation: neutShadow 1s ease-in-out infinite alternate;
          transform-origin: 60px 60px;
        }
        @keyframes neutBounce {
          0%   { transform: translateY(0px);  }
          60%  { transform: translateY(-14px); }
          100% { transform: translateY(-14px); }
        }
        @keyframes neutShadow {
          0%   { transform: scaleX(1);   opacity: 0.35; }
          60%  { transform: scaleX(0.5); opacity: 0.12; }
          100% { transform: scaleX(0.5); opacity: 0.12; }
        }
      `}</style>
      <radialGradient id="neutBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1f1f2e" />
        <stop offset="100%" stopColor="#0d0d16" />
      </radialGradient>
      <radialGradient id="neutHead" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#3a3a55" />
        <stop offset="100%" stopColor="#252538" />
      </radialGradient>
    </defs>

    {/* Background */}
    <circle cx="60" cy="60" r="60" fill="url(#neutBg)" />

    {/* Body / torso (static) */}
    <ellipse cx="60" cy="104" rx="28" ry="16" fill="#252538" />

    {/* Shadow under head (squashes as head rises) */}
    <ellipse cx="60" cy="76" rx="16" ry="4" fill="#000" className="neut-shadow" />

    {/* Bouncing head group */}
    <g className="neut-bounce">
      {/* Head */}
      <circle cx="60" cy="50" r="22" fill="url(#neutHead)" />
      {/* Simple eyes */}
      <circle cx="52" cy="49" r="3.5" fill="#555570" />
      <circle cx="68" cy="49" r="3.5" fill="#555570" />
      {/* Neutral mouth line */}
      <line x1="54" y1="59" x2="66" y2="59" stroke="#555570" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);


/* ─── Main Component ──────────────────────────────────────────── */
const Register = () => {
  // Step 1: User Details
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [mobile, setMobile]         = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [role, setRole]             = useState('consultee');
  const [gender, setGender]         = useState('');

  // Profile picture
  const [profilePic, setProfilePic]         = useState(null); // base64
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [picError, setPicError]             = useState('');
  const fileInputRef = useRef(null);

  // Expert Details
  const [bio, setBio]                       = useState('');
  const [pricingPerSession, setPricingPerSession] = useState(0);
  const [skills, setSkills]                 = useState('');

  // Expert Documents
  const [expertDocs, setExpertDocs]   = useState([]); // [{name, size, type, data}]
  const [docError, setDocError]       = useState('');
  const docInputRef = useRef(null);

  // Step 2: OTP
  const [otpStep, setOtpStep]   = useState(false);
  const [otp, setOtp]           = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ── Profile pic handler ───────────────────────────────────── */
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicError('');
    const MIN = 50 * 1024;   // 50 KB
    const MAX = 800 * 1024;  // 800 KB
    if (file.size < MIN) {
      setPicError(`Image too small (min 50 KB). Yours: ${(file.size / 1024).toFixed(1)} KB`);
      e.target.value = '';
      return;
    }
    if (file.size > MAX) {
      setPicError(`Image too large (max 800 KB). Yours: ${(file.size / 1024).toFixed(1)} KB`);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(file); // Store actual File object for FormData
      setProfilePicPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePic = (e) => {
    e.stopPropagation();
    setProfilePic(null);
    setProfilePicPreview(null);
    setPicError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Expert document handler ──────────────────────────────── */
  const handleDocChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setDocError('');

    const MIN = 50 * 1024;         // 50 KB
    const MAX = 1000 * 1024;      // 1000 KB
    const PDF_LIMIT = 2;
    const IMG_LIMIT = 3;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    // Current counts of already-uploaded docs
    const currentPdfs   = expertDocs.filter(d => d.type === 'application/pdf').length;
    const currentImages = expertDocs.filter(d => d.type !== 'application/pdf').length;

    let pendingPdfs   = currentPdfs;
    let pendingImages = currentImages;
    const newDocs = [];

    for (const file of files) {
      if (!allowed.includes(file.type)) {
        setDocError(`"${file.name}" is not allowed. Only PDF or images.`);
        e.target.value = '';
        return;
      }
      if (file.size < MIN) {
        setDocError(`"${file.name}" is too small (min 50 KB). Yours: ${(file.size/1024).toFixed(1)} KB`);
        e.target.value = '';
        return;
      }
      if (file.size > MAX) {
        setDocError(`"${file.name}" is too large (max 1000 KB). Yours: ${(file.size/1024).toFixed(0)} KB`);
        e.target.value = '';
        return;
      }

      const isPdf = file.type === 'application/pdf';
      if (isPdf) {
        if (pendingPdfs >= PDF_LIMIT) {
          setDocError(`PDF limit reached — you can upload at most ${PDF_LIMIT} PDFs.`);
          e.target.value = '';
          return;
        }
        pendingPdfs++;
      } else {
        if (pendingImages >= IMG_LIMIT) {
          setDocError(`Image limit reached — you can upload at most ${IMG_LIMIT} images.`);
          e.target.value = '';
          return;
        }
        pendingImages++;
      }
      newDocs.push(file);
    }

    // Convert all valid files to base64 for preview and keep File objects
    newDocs.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExpertDocs(prev => [
          ...prev,
          { name: file.name, size: file.size, type: file.type, data: reader.result, file: file }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveDoc = (idx) => {
    setExpertDocs(prev => prev.filter((_, i) => i !== idx));
  };

  /* ── OTP flow ─────────────────────────────────────────────── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Automatically make sure mobile is cleanly formatted before sending
    let formattedMobile = mobile.trim();
    if (!formattedMobile.startsWith('+91')) {
      formattedMobile = '+91' + formattedMobile.replace(/\D/g, '').replace(/^91/, '');
    }
    setMobile(formattedMobile);

    if (!firstName || !lastName || !formattedMobile || !email || !password || !gender) {
      return setError('Please fill all required fields including gender');
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/send-otp', { identifier: formattedMobile, channel: 'whatsapp' });
      setPreviewUrl(data.previewUrl);
      setOtpStep(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    
    // Re-verify the format just in case
    let formattedMobile = mobile.trim();
    if (!formattedMobile.startsWith('+91')) {
      formattedMobile = '+91' + formattedMobile.replace(/\D/g, '').replace(/^91/, '');
    }

    if (!otp) return setError('Please enter the OTP');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("mobile", formattedMobile);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("gender", gender);
      formData.append("otp", otp);

      if (profilePic) {
        formData.append("profilePicture", profilePic);
      }

      if (role === 'expert') {
        formData.append("bio", bio);
        formData.append("pricingPerSession", Number(pricingPerSession));
        formData.append("skills", JSON.stringify(skills.split(',').map(s => s.trim())));
        
        expertDocs.forEach(doc => {
          if(doc.file) {
            formData.append("expertDocuments", doc.file);
          }
        });
      }

      const { data } = await api.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(data.role === 'expert' ? '/expert-dashboard' : '/consultee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or registration failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── Which avatar to show ─────────────────────────────────── */
  const AvatarContent = () => {
    if (profilePicPreview) {
      return (
        <img
          src={profilePicPreview}
          alt="Profile preview"
          className="w-full h-full object-cover"
        />
      );
    }
    if (gender === 'Male') return <BoyAvatar />;
    if (gender === 'Female') return <GirlAvatar />;
    return <NeutralAvatar />;
  };

  const inputClass  = "w-full p-3.5 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 focus:bg-[#1A1C23] focus:ring-1 focus:ring-orange-500/20 transition-all placeholder:text-white/10 md:placeholder:text-white/20 text-sm";
  const labelClass  = "block text-xs font-medium text-white/50 tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center pt-28 pb-20 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-[800px] h-[800px] pointer-events-none z-0">
        <svg viewBox="0 0 800 800" className="w-full h-full opacity-40 blur-[80px]">
          <circle cx="400" cy="400" r="300" fill="transparent" stroke="#ea580c" strokeWidth="60" />
          <circle cx="400" cy="400" r="200" fill="#c2410c" opacity="0.3" filter="blur(40px)" />
        </svg>
      </div>

      <div className="w-full max-w-xl bg-[#0F1014]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl p-10 rounded-3xl relative z-10 flex flex-col">
        {!otpStep ? (
          <>
            {/* ── Header row: title + avatar ─────────────────── */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-2xl font-medium text-white">Create an Account</h2>
                <p className="text-white/40 text-sm mt-1">Join Consultify and dive into the future.</p>
              </div>

              {/* ── Profile Picture Circle ─────────────────────── */}
              <div className="flex flex-col items-center gap-1.5 ml-4 flex-shrink-0">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-[82px] h-[82px] rounded-full cursor-pointer group ring-2 ring-orange-500/30 hover:ring-orange-500/70 transition-all overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_28px_rgba(249,115,22,0.35)]"
                  title="Upload profile picture"
                >
                  <AvatarContent />

                  {/* Hover overlay */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity duration-200 ${profilePicPreview ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <svg className="w-6 h-6 text-orange-400 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
                    </svg>
                    <span className="text-[9px] text-orange-300 font-medium tracking-wide">UPLOAD</span>
                  </div>

                  {/* Remove button */}
                  {profilePicPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePic}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>



                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
            </div>

            {/* Pic size error */}
            {picError && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-2.5 rounded-lg mb-3 text-xs">
                ⚠️ {picError}
              </div>
            )}

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" required className={inputClass} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" required className={inputClass} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Mobile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white/50 text-sm">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      required 
                      className={`${inputClass} pl-10`} 
                      value={mobile.startsWith('+91') ? mobile.substring(3) : mobile} 
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        // If user pastes a number starting with 91, remove it to avoid +9191
                        if (val.startsWith('91') && val.length > 10) {
                          val = val.substring(2);
                        }
                        setMobile(val ? '+91' + val : '');
                      }} 
                      placeholder="98765 43210" 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email address</label>
                  <input type="email" required className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input type="password" required className={`${inputClass} tracking-widest`} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>I want to...</label>
                  <select className={inputClass} value={role} onChange={e => setRole(e.target.value)}>
                    <option value="consultee">Get Advice (Consultee)</option>
                    <option value="expert">Give Advice (Expert)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select required className={inputClass} value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {role === 'expert' && (
                <div className="space-y-4 p-5 border border-white/5 rounded-xl bg-white/[0.02] mt-2">
                  <h3 className="text-white/80 font-medium text-sm mb-2">Expert Details</h3>
                  <div>
                    <label className={labelClass}>Professional Bio</label>
                    <textarea required className={`${inputClass} resize-none`} rows="2" value={bio} onChange={e => setBio(e.target.value)} placeholder="Briefly describe your background..." />
                  </div>
                  <div>
                    <label className={labelClass}>Skills (comma separated)</label>
                    <input type="text" required className={inputClass} value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Finance, etc." />
                  </div>

                  {/* ── Document Upload ───────────────────────── */}
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-white/50 tracking-wide mb-2">
                        Proof of Expertise
                        <span className="ml-1.5 text-white/25 font-normal">(Resume, CV, Degree — PDF or image, 50 KB–1000 KB each)</span>
                    </label>

                    {/* Drop zone */}
                    <div
                      onClick={() => docInputRef.current?.click()}
                      className="group cursor-pointer border-2 border-dashed border-white/10 hover:border-orange-500/40 rounded-xl p-5 flex flex-col items-center gap-2 transition-all bg-white/[0.01] hover:bg-orange-500/[0.03]"
                    >
                      <svg className="w-8 h-8 text-white/20 group-hover:text-orange-500/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-xs text-white/30 group-hover:text-white/50 transition-colors text-center">
                        Click to browse documents
                      </p>
                    </div>

                    <input
                      ref={docInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      multiple
                      className="hidden"
                      onChange={handleDocChange}
                    />

                    {/* Doc error */}
                    {docError && (
                      <div className="mt-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 p-2.5 rounded-lg text-xs">
                        ⚠️ {docError}
                      </div>
                    )}

                    {/* Uploaded files list */}
                    {expertDocs.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {expertDocs.map((doc, idx) => (
                          <li key={idx} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 group">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Icon */}
                              {doc.type === 'application/pdf' ? (
                                <div className="w-7 h-7 rounded-md bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-md bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs text-white/70 truncate font-medium">{doc.name}</p>
                                <p className="text-[10px] text-white/30">{doc.size >= 1024*1024 ? (doc.size/1024/1024).toFixed(2)+' MB' : (doc.size/1024).toFixed(1)+' KB'}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(idx)}
                              className="text-white/20 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/50 text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all mt-4 text-sm tracking-wide disabled:opacity-50">
                {loading ? 'Sending Verification...' : 'Continue'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-white/40">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-orange-400 font-medium transition-colors underline decoration-white/30 underline-offset-4">Log in here</Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-medium text-center mb-2 text-white">Verify Mobile Number</h2>
            <p className="text-center text-white/40 mb-8 text-sm">We've sent a 6-digit code via WhatsApp to <b className="text-white/80">{mobile}</b></p>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

            <form onSubmit={handleVerifyAndRegister} className="space-y-6">
              <div>
                {previewUrl ? (
                  <div className="text-xs text-orange-200/90 mb-6 bg-orange-500/10 p-4 rounded-xl border border-orange-500/30 text-center flex flex-col gap-3">
                    <p className="font-semibold text-orange-400 tracking-wide">Verification sent via Email ✉️</p>
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="bg-orange-500/20 border border-orange-500/50 text-orange-400 py-2.5 px-4 rounded-lg inline-block w-max mx-auto hover:bg-orange-500/30 transition font-medium">
                      Open Development Inbox
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-green-200/90 mb-6 bg-green-500/10 p-4 rounded-xl border border-green-500/30 text-center flex flex-col gap-2">
                    <p className="font-semibold text-green-400 tracking-wide">Secure OTP sent successfully! ✉️</p>
                    <p className="text-green-300/70">Please check your WhatsApp for the 6-digit verification code.</p>
                  </div>
                )}
                <label className="block text-xs font-medium text-white/50 mb-2 text-center tracking-wide">Enter Code</label>
                <input
                  type="text" required maxLength={6}
                  className="w-full p-4 bg-[#16171C] border border-white/5 rounded-xl text-white outline-none focus:border-orange-500/50 transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="------"
                />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/50 text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all text-sm tracking-wide disabled:opacity-50">
                {loading ? 'Verifying...' : 'Finish Registration'}
              </button>
              <div className="flex items-center justify-between pt-4">
                <button type="button" onClick={() => setOtpStep(false)} className="text-white/30 hover:text-white/60 text-xs transition-colors">Edit Details</button>
                <button type="button" onClick={handleSendOtp} disabled={loading} className="text-orange-400/70 hover:text-orange-400 text-xs transition-colors disabled:opacity-50 font-medium">Resend code</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
