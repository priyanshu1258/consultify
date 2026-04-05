import React from 'react';

/* ─── Animated Boy Avatar ─────────────────────────────────────── */
export const BoyAvatar = () => (
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
      <radialGradient id="bgGradBoy" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#0f1623" />
      </radialGradient>
      <radialGradient id="skinGradBoy" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#f5c5a3" />
        <stop offset="100%" stopColor="#e8a882" />
      </radialGradient>
      <linearGradient id="shirtGradBoy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="60" fill="url(#bgGradBoy)" />
    <g className="boy-float">
      <ellipse cx="60" cy="100" rx="26" ry="18" fill="url(#shirtGradBoy)" />
      <rect x="54" y="81" width="12" height="10" rx="4" fill="#e8a882" />
      <ellipse cx="60" cy="68" rx="22" ry="24" fill="url(#skinGradBoy)" />
      <g className="boy-hair">
        <ellipse cx="60" cy="47" rx="22" ry="10" fill="#3d2314" />
        <ellipse cx="60" cy="50" rx="22" ry="6"  fill="#3d2314" />
        <rect x="38" y="47" width="5" height="14" rx="3" fill="#3d2314" />
        <rect x="77" y="47" width="5" height="14" rx="3" fill="#3d2314" />
      </g>
      <g className="boy-blink">
        <ellipse cx="52" cy="68" rx="4" ry="4.5" fill="#fff" />
        <ellipse cx="68" cy="68" rx="4" ry="4.5" fill="#fff" />
        <circle cx="53" cy="69" r="2.2" fill="#3d2314" />
        <circle cx="69" cy="69" r="2.2" fill="#3d2314" />
        <circle cx="54" cy="68" r="0.8" fill="#fff" />
        <circle cx="70" cy="68" r="0.8" fill="#fff" />
      </g>
      <line x1="48" y1="62" x2="56" y2="61" stroke="#3d2314" strokeWidth="2" strokeLinecap="round" />
      <line x1="64" y1="61" x2="72" y2="62" stroke="#3d2314" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="60" cy="74" rx="2" ry="1.5" fill="#c98b6a" />
      <path d="M53 79 Q60 85 67 79" stroke="#c98b6a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="69" rx="4" ry="5" fill="#e8a882" />
      <ellipse cx="82" cy="69" rx="4" ry="5" fill="#e8a882" />
      <ellipse cx="36" cy="98" rx="7" ry="12" fill="url(#shirtGradBoy)" transform="rotate(-10 36 98)" />
      <ellipse cx="84" cy="98" rx="7" ry="12" fill="url(#shirtGradBoy)" transform="rotate(10 84 98)" />
    </g>
    <circle cx="60" cy="60" r="58" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="12s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── Animated Girl Avatar ────────────────────────────────────── */
export const GirlAvatar = () => (
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
      <ellipse cx="60" cy="103" rx="30" ry="16" fill="url(#girlTop)" />
      <ellipse cx="60" cy="98" rx="26" ry="14" fill="url(#girlTop)" />
      <rect x="55" y="81" width="10" height="10" rx="4" fill="#edb898" />
      <ellipse cx="60" cy="68" rx="21" ry="23" fill="url(#girlSkin)" />
      <g className="girl-hair">
        <ellipse cx="60" cy="48" rx="24" ry="11" fill="#8B1A1A" />
        <rect x="36" y="48" width="10" height="35" rx="5" fill="#8B1A1A" />
        <rect x="74" y="48" width="10" height="35" rx="5" fill="#8B1A1A" />
        <ellipse cx="60" cy="50" rx="21" ry="8" fill="#a52020" />
      </g>
      <g className="girl-blink">
        <ellipse cx="52" cy="68" rx="4.5" ry="4.5" fill="#fff" />
        <ellipse cx="68" cy="68" rx="4.5" ry="4.5" fill="#fff" />
        <circle cx="53" cy="69" r="2.5" fill="#5c2d0e" />
        <circle cx="69" cy="69" r="2.5" fill="#5c2d0e" />
        <circle cx="54" cy="68" r="1"   fill="#fff" />
        <circle cx="70" cy="68" r="1"   fill="#fff" />
        <line x1="48" y1="64" x2="50" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="52" y1="63" x2="52" y2="61" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="56" y1="64" x2="57" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="64" y1="64" x2="63" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="68" y1="63" x2="68" y2="61" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="72" y1="64" x2="74" y2="62" stroke="#5c2d0e" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <path d="M47 62 Q52 59 57 61" stroke="#8B1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M63 61 Q68 59 73 62" stroke="#8B1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="74" rx="1.8" ry="1.2" fill="#d9967a" />
      <path d="M54 79 Q60 85 66 79" stroke="#d9967a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="80" rx="5" ry="1.8" fill="#f472b6" opacity="0.6" />
      <ellipse cx="39" cy="69" rx="4"  ry="5" fill="#edb898" />
      <ellipse cx="81" cy="69" rx="4"  ry="5" fill="#edb898" />
      <circle cx="39" cy="75" r="2"  fill="#ec4899" />
      <circle cx="81" cy="75" r="2"  fill="#ec4899" />
      <ellipse cx="46" cy="75" rx="6" ry="3.5" fill="#f9a8d4" opacity="0.35" />
      <ellipse cx="74" cy="75" rx="6" ry="3.5" fill="#f9a8d4" opacity="0.35" />
      <ellipse cx="33" cy="100" rx="7" ry="13" fill="url(#girlTop)" transform="rotate(-12 33 100)" />
      <ellipse cx="87" cy="100" rx="7" ry="13" fill="url(#girlTop)" transform="rotate(12 87 100)" />
    </g>
    <circle cx="60" cy="60" r="58" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="10s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/* ─── Neutral Avatar ──────────────────────────────────────────── */
export const NeutralAvatar = () => (
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
    <circle cx="60" cy="60" r="60" fill="url(#neutBg)" />
    <ellipse cx="60" cy="104" rx="28" ry="16" fill="#252538" />
    <ellipse cx="60" cy="76" rx="16" ry="4" fill="#000" className="neut-shadow" />
    <g className="neut-bounce">
      <circle cx="60" cy="50" r="22" fill="url(#neutHead)" />
      <circle cx="52" cy="49" r="3.5" fill="#555570" />
      <circle cx="68" cy="49" r="3.5" fill="#555570" />
      <line x1="54" y1="59" x2="66" y2="59" stroke="#555570" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const Avatar = ({ user, className }) => {
  if (user?.profilePicture) {
    return <img src={user.profilePicture} alt="Profile" className={`object-cover w-full h-full ${className}`} />;
  }

  if (user?.gender === 'Male') {
    return <div className={`w-full h-full ${className}`}><BoyAvatar /></div>;
  } else if (user?.gender === 'Female') {
    return <div className={`w-full h-full ${className}`}><GirlAvatar /></div>;
  }
  
  return <div className={`w-full h-full ${className}`}><NeutralAvatar /></div>;
};

export default Avatar;
