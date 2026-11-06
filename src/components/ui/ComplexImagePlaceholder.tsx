import React, { useState } from 'react';
import { CourtVisualVariant, SportType } from '../../types/canchas';

interface ComplexImagePlaceholderProps {
  imageUrl?: string;
  name: string;
  zone: string;
  sports: SportType[];
  variant: CourtVisualVariant;
}

export const ComplexImagePlaceholder: React.FC<ComplexImagePlaceholderProps> = ({
  imageUrl,
  name,
  zone,
  sports,
  variant,
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (imageUrl && !hasImageError) {
    return (
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-pitch">
        <img
          src={imageUrl}
          alt={`${name} — Complejo de fútbol en ${zone}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setHasImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-[16/10] overflow-hidden bg-pitch select-none"
      role="img"
      aria-label={`Ilustración arquitectónica de canchas de fútbol en ${name}, ${zone} (${sports.join(', ')})`}
    >
      <CourtArchitecturalIllustration variant={variant} />
    </div>
  );
};

const CourtArchitecturalIllustration: React.FC<{ variant: CourtVisualVariant }> = ({
  variant,
}) => {
  switch (variant) {
    case 'multi-pitch':
      return (
        <svg
          viewBox="0 0 640 400"
          className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="640" height="400" fill="var(--c3-pitch)" />
          {/* Left 7v7 pitch */}
          <rect
            x="48"
            y="54"
            width="324"
            height="292"
            rx="4"
            fill="var(--c3-turf)"
            fillOpacity="0.34"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <line
            x1="210"
            y1="54"
            x2="210"
            y2="346"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
          <circle
            cx="210"
            cy="200"
            r="42"
            stroke="var(--c3-volt)"
            strokeOpacity="0.7"
            strokeWidth="2"
          />
          <rect
            x="48"
            y="128"
            width="50"
            height="144"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
          <rect
            x="322"
            y="128"
            width="50"
            height="144"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
          {/* Right two 5v5 pitches */}
          <rect
            x="396"
            y="54"
            width="196"
            height="134"
            rx="4"
            fill="var(--c3-turf-highlight)"
            fillOpacity="0.28"
            stroke="var(--c3-volt)"
            strokeOpacity="0.6"
            strokeWidth="2"
          />
          <line
            x1="494"
            y1="54"
            x2="494"
            y2="188"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          <circle
            cx="494"
            cy="121"
            r="22"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          <rect
            x="396"
            y="212"
            width="196"
            height="134"
            rx="4"
            fill="var(--c3-turf-highlight)"
            fillOpacity="0.28"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
          <line
            x1="494"
            y1="212"
            x2="494"
            y2="346"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          <circle
            cx="494"
            cy="279"
            r="22"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
        </svg>
      );

    case 'night-stadium':
      return (
        <svg
          viewBox="0 0 640 400"
          className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="640" height="400" fill="var(--c3-pitch)" />
          <rect
            x="56"
            y="48"
            width="528"
            height="304"
            rx="6"
            fill="var(--c3-turf)"
            fillOpacity="0.28"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.55"
            strokeWidth="2.5"
          />
          {/* Halfway & center */}
          <line
            x1="320"
            y1="48"
            x2="320"
            y2="352"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <circle
            cx="320"
            cy="200"
            r="56"
            stroke="var(--c3-volt)"
            strokeOpacity="0.75"
            strokeWidth="2.5"
          />
          <circle cx="320" cy="200" r="5" fill="var(--c3-volt)" />
          {/* Double penalty boxes (18-yard + 6-yard) */}
          <rect
            x="56"
            y="104"
            width="92"
            height="192"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          <rect
            x="56"
            y="148"
            width="36"
            height="104"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          <rect
            x="492"
            y="104"
            width="92"
            height="192"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          <rect
            x="548"
            y="148"
            width="36"
            height="104"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          {/* Corner floodlights */}
          <circle cx="56" cy="48" r="6" fill="var(--c3-volt)" />
          <circle cx="584" cy="48" r="6" fill="var(--c3-volt)" />
          <circle cx="56" cy="352" r="6" fill="var(--c3-volt)" />
          <circle cx="584" cy="352" r="6" fill="var(--c3-volt)" />
        </svg>
      );

    case 'rooftop-pitch':
    case 'soccer-turf':
    case 'indoor-pitch':
    case 'clubhouse-turf':
    default:
      return (
        <svg
          viewBox="0 0 640 400"
          className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="640" height="400" fill="var(--c3-pitch)" />
          {/* Subtle turf mowing stripes */}
          <g fill="var(--c3-turf)" fillOpacity="0.12">
            <rect x="64" y="54" width="64" height="292" />
            <rect x="192" y="54" width="64" height="292" />
            <rect x="320" y="54" width="64" height="292" />
            <rect x="448" y="54" width="64" height="292" />
          </g>
          {/* Outer pitch boundary */}
          <rect
            x="64"
            y="54"
            width="512"
            height="292"
            rx="4"
            fill="var(--c3-turf)"
            fillOpacity="0.24"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.55"
            strokeWidth="2.5"
          />
          {/* Halfway line & center circle */}
          <line
            x1="320"
            y1="54"
            x2="320"
            y2="346"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <circle
            cx="320"
            cy="200"
            r="52"
            stroke="var(--c3-volt)"
            strokeOpacity="0.7"
            strokeWidth="2.5"
          />
          <circle cx="320" cy="200" r="4.5" fill="var(--c3-volt)" />
          {/* Penalty areas */}
          <rect
            x="64"
            y="116"
            width="78"
            height="168"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          <rect
            x="498"
            y="116"
            width="78"
            height="168"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          {variant === 'indoor-pitch' && (
            <g stroke="var(--c3-pitch-line)" strokeWidth="2">
              <line x1="64" y1="54" x2="576" y2="346" strokeOpacity="0.35" />
              <line x1="576" y1="54" x2="64" y2="346" strokeOpacity="0.35" />
            </g>
          )}
          {variant === 'rooftop-pitch' && (
            <g stroke="var(--c3-pitch-line)" strokeWidth="1.5">
              <line x1="0" y1="28" x2="640" y2="28" />
              <line x1="0" y1="372" x2="640" y2="372" />
            </g>
          )}
        </svg>
      );
  }
};
