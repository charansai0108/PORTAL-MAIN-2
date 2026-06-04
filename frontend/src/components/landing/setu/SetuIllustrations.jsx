import React from 'react';

/** Hand-drawn yellow oval scribble behind highlighted text */
export function YellowScribbleHighlight({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 90"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M18 48 C 22 18, 72 8, 118 22 C 168 38, 205 58, 198 50 C 172 78, 95 82, 38 68 C 10 56, 8 40, 18 48 Z"
        fill="#FFB800"
        fillOpacity="0.4"
        stroke="#FFB800"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 52 C 35 28, 88 20, 130 32 C 155 42, 175 52, 168 46"
        fill="none"
        stroke="#E6A600"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M42 58 C 55 45, 100 48, 145 55"
        fill="none"
        stroke="#FFB800"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/** Stylized group of people — hero doodle */
export function PeopleGroupIllustration({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="260" cy="268" rx="200" ry="8" fill="#1A1A1A" opacity="0.08" />
      {/* Plant */}
      <path d="M48 220 Q52 180 60 150 Q68 120 55 100" stroke="#1A1A1A" strokeWidth="3" fill="none" />
      <ellipse cx="42" cy="95" rx="18" ry="28" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      <ellipse cx="62" cy="88" rx="14" ry="22" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      {/* Person 1 standing */}
      <rect x="90" y="130" width="44" height="70" rx="6" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="82" y="95" width="60" height="42" rx="20" fill="#F5D0C0" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="78" y="198" width="22" height="55" rx="4" fill="#1A1A1A" />
      <rect x="124" y="198" width="22" height="55" rx="4" fill="#1A1A1A" />
      {/* Person 2 sitting */}
      <rect x="175" y="175" width="50" height="45" rx="8" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="168" y="140" width="64" height="40" rx="22" fill="#F5D0C0" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="160" y="215" width="70" height="12" rx="4" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2" />
      {/* Person 3 center — yellow dress */}
      <path d="M248 200 L268 130 L288 200 Z" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      <circle cx="268" cy="108" r="28" fill="#F5D0C0" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="252" y="198" width="14" height="50" rx="3" fill="#1A1A1A" />
      <rect x="270" y="198" width="14" height="50" rx="3" fill="#1A1A1A" />
      {/* Person 4 leaning */}
      <rect x="320" y="155" width="48" height="55" rx="6" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      <path d="M310 120 Q350 100 370 130" stroke="#1A1A1A" strokeWidth="2.5" fill="#F5D0C0" />
      <ellipse cx="348" cy="118" rx="26" ry="24" fill="#F5D0C0" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="318" y="205" width="20" height="48" rx="3" fill="#1A1A1A" />
      <rect x="350" y="205" width="20" height="48" rx="3" fill="#1A1A1A" />
      {/* Person 5 lying */}
      <ellipse cx="430" cy="230" rx="55" ry="22" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      <circle cx="395" cy="218" r="22" fill="#F5D0C0" stroke="#1A1A1A" strokeWidth="2.5" />
      {/* Doodles */}
      <path d="M480 60 Q500 40 520 55" stroke="#FFB800" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="495" cy="75" r="6" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />
      <path d="M15 180 Q5 160 20 145" stroke="#1A1A1A" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  );
}

/** Process timeline doodle */
export function TimelineDoodle({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 80 240" aria-hidden>
      <line x1="40" y1="20" x2="40" y2="220" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
      {[20, 110, 200].map((y) => (
        <g key={y}>
          <circle cx="40" cy={y} r="14" fill="#FFFAF0" stroke="#1A1A1A" strokeWidth="3" />
          <circle cx="40" cy={y} r="6" fill="#FFB800" />
        </g>
      ))}
    </svg>
  );
}

/** Join Us panel illustration */
export function JoinUsIllustration({ role = 'Student', className = '' }) {
  const accent = role === 'Company' ? '#1A1A1A' : '#FFB800';
  return (
    <svg className={className} viewBox="0 0 320 280" aria-hidden>
      <rect x="20" y="40" width="280" height="200" rx="16" fill="#FFFAF0" stroke="#1A1A1A" strokeWidth="2.5" strokeDasharray="8 4" />
      <circle cx="100" cy="120" r="35" fill="#F5D0C0" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="70" y="155" width="60" height="70" rx="8" fill={accent} stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="160" y="90" width="120" height="14" rx="4" fill="#FFB800" opacity="0.6" />
      <rect x="160" y="120" width="100" height="14" rx="4" fill="#1A1A1A" opacity="0.15" />
      <rect x="160" y="150" width="110" height="14" rx="4" fill="#1A1A1A" opacity="0.15" />
      <path d="M250 200 L270 185 L290 205" stroke="#FFB800" strokeWidth="3" fill="none" strokeLinecap="round" />
      <text x="160" y="210" fontFamily="Caveat, cursive" fontSize="18" fill="#1A1A1A">
        {role === 'Institute' ? 'Your campus, unified' : role === 'Company' ? 'Talent that fits' : 'Your career, clear'}
      </text>
    </svg>
  );
}

/** Scribble underline SVG */
export function ScribbleUnderline({ width = 200, className = '' }) {
  return (
    <svg className={className} width={width} height="12" viewBox={`0 0 ${width} 12`} aria-hidden>
      <path
        d={`M2 8 Q${width * 0.25} 2 ${width * 0.5} 7 T${width - 2} 5`}
        stroke="#FFB800"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Decorative squiggle */
export function Squiggle({ className = '', flip = false }) {
  return (
    <svg
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      width="60"
      height="40"
      viewBox="0 0 60 40"
      aria-hidden
    >
      <path
        d="M5 20 Q15 5 30 20 T55 18"
        stroke="#FFB800"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/** Envelope doodle from reference */
export function EnvelopeDoodle({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 100" aria-hidden>
      <rect x="10" y="30" width="100" height="60" rx="4" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2.5" />
      <path d="M10 30 L60 65 L110 30" stroke="#1A1A1A" strokeWidth="2.5" fill="none" />
      <path d="M45 15 Q50 5 55 15" stroke="#1A1A1A" strokeWidth="2" fill="none" />
      <path d="M60 12 Q65 2 70 12" stroke="#1A1A1A" strokeWidth="2" fill="none" />
      <path d="M75 15 Q80 5 85 15" stroke="#1A1A1A" strokeWidth="2" fill="none" />
    </svg>
  );
}
