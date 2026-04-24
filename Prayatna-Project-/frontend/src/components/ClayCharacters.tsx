// Clay-morphism characters for LifeLink login background
// Each character is pure SVG with drop-shadows, rounded shapes and pastel fills

const CLAY_STYLE = `
@keyframes clayFloat  { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 40%{transform:translateY(-18px) rotate(3deg) scale(1.03)} 70%{transform:translateY(-8px) rotate(-2deg) scale(0.98)} }
@keyframes clayFloat2 { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 35%{transform:translateY(-22px) rotate(-4deg) scale(1.04)} 65%{transform:translateY(-6px) rotate(2deg) scale(0.97)} }
@keyframes clayFloat3 { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 50%{transform:translateY(-14px) rotate(5deg) scale(1.02)} }
@keyframes clayBob    { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.96)} }
@keyframes clayWave   { 0%,100%{transform:rotate(0deg) } 25%{transform:rotate(18deg)} 75%{transform:rotate(-12deg)} }
@keyframes clayShadow { 0%,100%{transform:scaleX(1);opacity:.22} 50%{transform:scaleX(0.75);opacity:.12} }
`;
if (typeof document !== 'undefined' && !document.getElementById('ll-clay-styles')) {
  const el = document.createElement('style'); el.id = 'll-clay-styles';
  el.textContent = CLAY_STYLE; document.head.appendChild(el);
}

// ── Hospital ──────────────────────────────────────────────────────────────────
export function ClayHospital({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: 110, height: 130, ...style }}>
      <svg width="110" height="130" viewBox="0 0 110 130" fill="none" style={{ animation: 'clayFloat3 6s ease-in-out infinite', filter: 'drop-shadow(0 12px 24px rgba(20,184,166,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
        <defs>
          <radialGradient id="hbg" cx="40%" cy="30%" r="70%"><stop offset="0%" stopColor="#5eead4"/><stop offset="100%" stopColor="#0f766e"/></radialGradient>
          <radialGradient id="hroof" cx="40%" cy="20%" r="70%"><stop offset="0%" stopColor="#99f6e4"/><stop offset="100%" stopColor="#14b8a6"/></radialGradient>
        </defs>
        {/* Building body */}
        <rect x="12" y="42" width="86" height="78" rx="14" fill="url(#hbg)" stroke="#2dd4bf" strokeWidth="2.5"/>
        {/* Roof / top band */}
        <rect x="8" y="32" width="94" height="22" rx="11" fill="url(#hroof)" stroke="#5eead4" strokeWidth="2"/>
        {/* Shine */}
        <ellipse cx="38" cy="38" rx="18" ry="6" fill="white" opacity="0.22"/>
        {/* Red cross vertical */}
        <rect x="48" y="18" width="14" height="40" rx="7" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5"/>
        {/* Red cross horizontal */}
        <rect x="36" y="30" width="38" height="14" rx="7" fill="#f87171" stroke="#fca5a5" strokeWidth="1.5"/>
        {/* Door */}
        <rect x="42" y="90" width="26" height="30" rx="8" fill="#0d9488" stroke="#2dd4bf" strokeWidth="1.5"/>
        {/* Windows */}
        <rect x="18" y="58" width="22" height="18" rx="5" fill="#a7f3d0" stroke="#5eead4" strokeWidth="1.5"/>
        <rect x="70" y="58" width="22" height="18" rx="5" fill="#a7f3d0" stroke="#5eead4" strokeWidth="1.5"/>
        {/* Window shine */}
        <rect x="20" y="60" width="8" height="4" rx="2" fill="white" opacity="0.5"/>
        <rect x="72" y="60" width="8" height="4" rx="2" fill="white" opacity="0.5"/>
      </svg>
      {/* Ground shadow */}
      <div style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%)', width:70, height:10, borderRadius:'50%', background:'rgba(20,184,166,0.2)', filter:'blur(4px)', animation:'clayShadow 6s ease-in-out infinite' }}/>
    </div>
  );
}

// ── Ambulance ─────────────────────────────────────────────────────────────────
export function ClayAmbulance({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: 140, height: 100, ...style }}>
      <svg width="140" height="100" viewBox="0 0 140 100" fill="none" style={{ animation: 'clayFloat2 5.5s ease-in-out infinite 0.8s', filter: 'drop-shadow(0 10px 20px rgba(248,113,113,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
        <defs>
          <radialGradient id="abody" cx="35%" cy="25%" r="70%"><stop offset="0%" stopColor="#fef2f2"/><stop offset="100%" stopColor="#fecaca"/></radialGradient>
          <radialGradient id="acabin" cx="30%" cy="20%" r="70%"><stop offset="0%" stopColor="#fde8e8"/><stop offset="100%" stopColor="#fca5a5"/></radialGradient>
        </defs>
        {/* Main body */}
        <rect x="8" y="22" width="118" height="58" rx="16" fill="url(#abody)" stroke="#fca5a5" strokeWidth="2.5"/>
        {/* Cabin bump */}
        <rect x="96" y="12" width="34" height="42" rx="12" fill="url(#acabin)" stroke="#f87171" strokeWidth="2"/>
        {/* Red stripe */}
        <rect x="8" y="52" width="118" height="12" rx="0" fill="#ef4444" opacity="0.85"/>
        {/* Red cross */}
        <rect x="28" y="30" width="8" height="22" rx="4" fill="#ef4444"/>
        <rect x="22" y="36" width="20" height="8" rx="4" fill="#ef4444"/>
        {/* Windows */}
        <rect x="98" y="17" width="26" height="20" rx="7" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1.5"/>
        <rect x="100" y="19" width="10" height="6" rx="3" fill="white" opacity="0.55"/>
        {/* Door line */}
        <line x1="88" y1="26" x2="88" y2="76" stroke="#fca5a5" strokeWidth="2" strokeDasharray="0"/>
        {/* Wheels */}
        <circle cx="36" cy="82" r="16" fill="#374151" stroke="#6b7280" strokeWidth="2.5"/>
        <circle cx="36" cy="82" r="8" fill="#9ca3af" stroke="#d1d5db" strokeWidth="2"/>
        <circle cx="36" cy="82" r="3" fill="#f9fafb"/>
        <circle cx="106" cy="82" r="16" fill="#374151" stroke="#6b7280" strokeWidth="2.5"/>
        <circle cx="106" cy="82" r="8" fill="#9ca3af" stroke="#d1d5db" strokeWidth="2"/>
        <circle cx="106" cy="82" r="3" fill="#f9fafb"/>
        {/* Light bar */}
        <rect x="50" y="14" width="36" height="10" rx="5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5"/>
        <rect x="53" y="16" width="10" height="6" rx="3" fill="#fef3c7" opacity="0.9"/>
        <rect x="68" y="16" width="10" height="6" rx="3" fill="#fef3c7" opacity="0.9"/>
      </svg>
      <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:100, height:10, borderRadius:'50%', background:'rgba(248,113,113,0.2)', filter:'blur(5px)', animation:'clayShadow 5.5s ease-in-out infinite 0.8s' }}/>
    </div>
  );
}

// ── Doctor ────────────────────────────────────────────────────────────────────
export function ClayDoctor({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: 90, height: 150, ...style }}>
      <svg width="90" height="150" viewBox="0 0 90 150" fill="none" style={{ animation: 'clayFloat 7s ease-in-out infinite 0.3s', filter: 'drop-shadow(0 12px 20px rgba(99,102,241,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
        <defs>
          <radialGradient id="dhead" cx="40%" cy="30%" r="60%"><stop offset="0%" stopColor="#fed7aa"/><stop offset="100%" stopColor="#fdba74"/></radialGradient>
          <radialGradient id="dcoat" cx="35%" cy="20%" r="70%"><stop offset="0%" stopColor="#f0fdf4"/><stop offset="100%" stopColor="#dcfce7"/></radialGradient>
        </defs>
        {/* Head */}
        <ellipse cx="45" cy="32" rx="26" ry="28" fill="url(#dhead)" stroke="#fbbf24" strokeWidth="2"/>
        <ellipse cx="36" cy="24" rx="8" ry="5" fill="white" opacity="0.35"/>
        {/* Hair */}
        <ellipse cx="45" cy="8" rx="24" ry="10" fill="#78350f" stroke="#92400e" strokeWidth="1.5"/>
        <ellipse cx="45" cy="10" rx="16" ry="5" fill="#92400e" opacity="0.5"/>
        {/* Eyes */}
        <ellipse cx="36" cy="34" rx="4" ry="4.5" fill="white"/>
        <circle cx="37" cy="34" r="2.5" fill="#1e293b"/>
        <circle cx="38" cy="33" r="0.8" fill="white"/>
        <ellipse cx="54" cy="34" rx="4" ry="4.5" fill="white"/>
        <circle cx="55" cy="34" r="2.5" fill="#1e293b"/>
        <circle cx="56" cy="33" r="0.8" fill="white"/>
        {/* Smile */}
        <path d="M37 44 Q45 51 53 44" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Coat body */}
        <rect x="12" y="55" width="66" height="72" rx="18" fill="url(#dcoat)" stroke="#86efac" strokeWidth="2.5"/>
        <ellipse cx="30" cy="62" rx="10" ry="5" fill="white" opacity="0.4"/>
        {/* Coat collar */}
        <path d="M33 55 L45 70 L57 55" fill="#bbf7d0" stroke="#86efac" strokeWidth="1.5"/>
        {/* Stethoscope */}
        <path d="M30 80 Q20 90 24 100 Q28 112 38 110" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <circle cx="38" cy="112" r="6" fill="#818cf8" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="38" cy="112" r="3" fill="#c7d2fe"/>
        {/* Pocket */}
        <rect x="55" y="72" width="16" height="20" rx="5" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5"/>
        <rect x="58" y="76" width="2.5" height="10" rx="1.2" fill="#22c55e"/>
        <rect x="62" y="76" width="2.5" height="10" rx="1.2" fill="#ef4444"/>
        {/* Arms */}
        <rect x="-2" y="60" width="18" height="44" rx="9" fill="url(#dcoat)" stroke="#86efac" strokeWidth="2" style={{ transformOrigin:'8px 62px', animation:'clayWave 3s ease-in-out infinite 1s' }}/>
        <rect x="74" y="60" width="18" height="44" rx="9" fill="url(#dcoat)" stroke="#86efac" strokeWidth="2"/>
        {/* Hands */}
        <ellipse cx="7" cy="106" rx="9" ry="7" fill="url(#dhead)" stroke="#fbbf24" strokeWidth="1.5"/>
        <ellipse cx="83" cy="106" rx="9" ry="7" fill="url(#dhead)" stroke="#fbbf24" strokeWidth="1.5"/>
      </svg>
      <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:55, height:9, borderRadius:'50%', background:'rgba(99,102,241,0.2)', filter:'blur(4px)', animation:'clayShadow 7s ease-in-out infinite 0.3s' }}/>
    </div>
  );
}

// ── Patient ───────────────────────────────────────────────────────────────────
export function ClayPatient({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', width: 80, height: 140, ...style }}>
      <svg width="80" height="140" viewBox="0 0 80 140" fill="none" style={{ animation: 'clayFloat 8s ease-in-out infinite 1.5s', filter: 'drop-shadow(0 10px 18px rgba(251,191,36,0.28)) drop-shadow(0 4px 8px rgba(0,0,0,0.28))' }}>
        <defs>
          <radialGradient id="phead" cx="38%" cy="28%" r="65%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#f59e0b"/></radialGradient>
          <radialGradient id="pbody" cx="35%" cy="20%" r="70%"><stop offset="0%" stopColor="#a5f3fc"/><stop offset="100%" stopColor="#22d3ee"/></radialGradient>
        </defs>
        {/* Head */}
        <ellipse cx="40" cy="28" rx="24" ry="24" fill="url(#phead)" stroke="#fbbf24" strokeWidth="2"/>
        <ellipse cx="30" cy="20" rx="8" ry="4" fill="white" opacity="0.3"/>
        {/* Hair */}
        <ellipse cx="40" cy="8" rx="22" ry="9" fill="#92400e" stroke="#78350f" strokeWidth="1.5"/>
        {/* Eyes */}
        <ellipse cx="32" cy="29" rx="3.5" ry="4" fill="white"/>
        <circle cx="33" cy="29" r="2.2" fill="#1e293b"/>
        <circle cx="34" cy="28" r="0.7" fill="white"/>
        <ellipse cx="48" cy="29" rx="3.5" ry="4" fill="white"/>
        <circle cx="49" cy="29" r="2.2" fill="#1e293b"/>
        <circle cx="50" cy="28" r="0.7" fill="white"/>
        {/* Happy smile */}
        <path d="M32 40 Q40 47 48 40" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Blush */}
        <ellipse cx="25" cy="37" rx="5" ry="3" fill="#fca5a5" opacity="0.45"/>
        <ellipse cx="55" cy="37" rx="5" ry="3" fill="#fca5a5" opacity="0.45"/>
        {/* Body / shirt */}
        <rect x="10" y="48" width="60" height="64" rx="18" fill="url(#pbody)" stroke="#67e8f9" strokeWidth="2.5"/>
        <ellipse cx="26" cy="56" rx="9" ry="4" fill="white" opacity="0.35"/>
        {/* Collar */}
        <path d="M28 48 L40 62 L52 48" fill="#67e8f9" stroke="#22d3ee" strokeWidth="1.5"/>
        {/* Arms */}
        <rect x="-4" y="54" width="17" height="40" rx="8" fill="url(#pbody)" stroke="#67e8f9" strokeWidth="2"/>
        <rect x="67" y="54" width="17" height="40" rx="8" fill="url(#pbody)" stroke="#67e8f9" strokeWidth="2"/>
        {/* Hands */}
        <ellipse cx="4" cy="96" rx="8" ry="6" fill="url(#phead)" stroke="#fbbf24" strokeWidth="1.5"/>
        <ellipse cx="76" cy="96" rx="8" ry="6" fill="url(#phead)" stroke="#fbbf24" strokeWidth="1.5"/>
        {/* Phone in hand */}
        <rect x="-2" y="88" width="12" height="18" rx="3" fill="#1e293b" stroke="#374151" strokeWidth="1.2"/>
        <rect x="0" y="90" width="8" height="13" rx="2" fill="#38bdf8" opacity="0.8"/>
      </svg>
      <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:50, height:8, borderRadius:'50%', background:'rgba(251,191,36,0.2)', filter:'blur(4px)', animation:'clayShadow 8s ease-in-out infinite 1.5s' }}/>
    </div>
  );
}

// ── Composed scene — positions characters around the page ─────────────────────
import React from 'react';

interface Props { mouseX: number; mouseY: number; }

export default function ClayScene({ mouseX, mouseY }: Props) {
  const px = (factor: number) => (mouseX - 50) * factor;
  const py = (factor: number) => (mouseY - 50) * factor;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Hospital — top left */}
      <div style={{ position:'absolute', top:'8%', left:'3%', transition:'transform 0.5s ease', transform:`translate(${px(0.07)}px,${py(0.07)}px)` }}>
        <ClayHospital />
      </div>
      {/* Ambulance — bottom left */}
      <div style={{ position:'absolute', bottom:'8%', left:'2%', transition:'transform 0.5s ease', transform:`translate(${px(0.05)}px,${py(-0.06)}px)` }}>
        <ClayAmbulance />
      </div>
      {/* Doctor — top right */}
      <div style={{ position:'absolute', top:'6%', right:'3%', transition:'transform 0.5s ease', transform:`translate(${px(-0.08)}px,${py(0.07)}px)` }}>
        <ClayDoctor />
      </div>
      {/* Patient — bottom right */}
      <div style={{ position:'absolute', bottom:'6%', right:'4%', transition:'transform 0.5s ease', transform:`translate(${px(-0.06)}px,${py(-0.05)}px)` }}>
        <ClayPatient />
      </div>
    </div>
  );
}
