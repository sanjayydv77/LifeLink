import React from 'react';

const CLAY_STYLE = `
@keyframes clayFloat  { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 40%{transform:translateY(-20px) rotate(2.5deg) scale(1.03)} 70%{transform:translateY(-8px) rotate(-1.5deg) scale(0.98)} }
@keyframes clayFloat2 { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 35%{transform:translateY(-24px) rotate(-3deg) scale(1.04)} 65%{transform:translateY(-6px) rotate(1.5deg) scale(0.97)} }
@keyframes clayFloat3 { 0%,100%{transform:translateY(0) rotate(0deg) scale(1)} 50%{transform:translateY(-16px) rotate(4deg) scale(1.02)} }
@keyframes clayShadow { 0%,100%{transform:scaleX(1);opacity:.2} 50%{transform:scaleX(0.7);opacity:.09} }
@keyframes clayGlow   { 0%,100%{opacity:.55} 50%{opacity:.85} }
`;
if (typeof document !== 'undefined' && !document.getElementById('ll-clay-styles')) {
  const el = document.createElement('style'); el.id = 'll-clay-styles';
  el.textContent = CLAY_STYLE; document.head.appendChild(el);
}

interface CharProps {
  src: string;
  width: number;
  height: number;
  animation: string;
  glowColor: string;
  shadowW: number;
  label: string;
}

function ClayChar({ src, width, height, animation, glowColor, shadowW, label }: CharProps) {
  return (
    <div style={{ position: 'relative', width, height, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Glow ring behind image */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        width: width * 0.85, height: width * 0.85, borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        filter: 'blur(18px)', animation: 'clayGlow 3s ease-in-out infinite', zIndex: 0,
      }} />
      {/* Image */}
      <img
        src={src} alt={label}
        style={{
          width, height, objectFit: 'contain', position: 'relative', zIndex: 1,
          animation,
          filter: `drop-shadow(0 16px 28px ${glowColor}) drop-shadow(0 4px 10px rgba(0,0,0,0.45))`,
        }}
      />
      {/* Ground shadow ellipse */}
      <div style={{
        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
        width: shadowW, height: 10, borderRadius: '50%',
        background: `rgba(0,0,0,0.28)`, filter: 'blur(5px)',
        animation: `clayShadow ${animation.includes('Float2') ? '5.5s' : animation.includes('Float3') ? '6s' : '7s'} ease-in-out infinite`,
      }} />
    </div>
  );
}

interface Props { mouseX: number; mouseY: number; }

export default function ClayScene({ mouseX, mouseY }: Props) {
  const px = (f: number) => (mouseX - 50) * f;
  const py = (f: number) => (mouseY - 50) * f;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Hospital — top left */}
      <div style={{
        position: 'absolute', top: '4%', left: '1%',
        transition: 'transform 0.5s ease',
        transform: `translate(${px(0.07)}px, ${py(0.07)}px)`,
      }}>
        <ClayChar
          src="/clay_hospital.png" label="Hospital"
          width={140} height={140}
          animation="clayFloat3 6s ease-in-out infinite"
          glowColor="rgba(20,184,166,0.4)" shadowW={90}
        />
      </div>

      {/* Ambulance — bottom left */}
      <div style={{
        position: 'absolute', bottom: '5%', left: '1%',
        transition: 'transform 0.5s ease',
        transform: `translate(${px(0.05)}px, ${py(-0.06)}px)`,
      }}>
        <ClayChar
          src="/clay_ambulance.png" label="Ambulance"
          width={180} height={120}
          animation="clayFloat2 5.5s ease-in-out infinite 0.8s"
          glowColor="rgba(248,113,113,0.35)" shadowW={130}
        />
      </div>

      {/* Doctor — top right */}
      <div style={{
        position: 'absolute', top: '3%', right: '1%',
        transition: 'transform 0.5s ease',
        transform: `translate(${px(-0.08)}px, ${py(0.07)}px)`,
      }}>
        <ClayChar
          src="/clay_doctor.png" label="Doctor"
          width={130} height={170}
          animation="clayFloat 7s ease-in-out infinite 0.3s"
          glowColor="rgba(99,102,241,0.3)" shadowW={80}
        />
      </div>

      {/* Patient — bottom right */}
      <div style={{
        position: 'absolute', bottom: '4%', right: '1%',
        transition: 'transform 0.5s ease',
        transform: `translate(${px(-0.06)}px, ${py(-0.05)}px)`,
      }}>
        <ClayChar
          src="/clay_patient.png" label="Patient"
          width={120} height={160}
          animation="clayFloat 8s ease-in-out infinite 1.5s"
          glowColor="rgba(251,191,36,0.28)" shadowW={75}
        />
      </div>
    </div>
  );
}
