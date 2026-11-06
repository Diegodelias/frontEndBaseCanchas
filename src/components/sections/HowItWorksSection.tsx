import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../../data/landingContent';
import { StepItem } from '../../types/canchas';
import { Button } from '../ui/Button';

interface HowItWorksSectionProps {
  onPrimaryCta: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onPrimaryCta,
}) => {
  return (
    <section
      id="como-funciona"
      className="py-14 sm:py-20 bg-surface border-b border-line scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-turf-ink">
              Cómo funciona
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              De la idea a la cancha en tres pasos
            </h2>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onPrimaryCta}
            className="self-start md:self-auto"
          >
            Reservá tu cancha
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line border-t border-b border-line">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <article
              key={step.number}
              className="py-8 md:py-9 md:px-7 first:md:pl-0 last:md:pr-0 flex flex-col"
            >
              <StepCourtSchematic type={step.visualType} />

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-turf tabular-nums">
                  {step.number}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                  {step.title}
                </h3>
              </div>

              <p className="mt-2.5 text-sm sm:text-base text-ink-muted leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCourtSchematic: React.FC<{ type: StepItem['visualType'] }> = ({
  type,
}) => {
  if (type === 'discover') {
    return (
      <div
        className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-pitch"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 360 202"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="360" height="202" fill="var(--c3-pitch)" />
          <g stroke="var(--c3-pitch-line)" strokeWidth="1.5">
            <line x1="0" y1="50" x2="360" y2="50" />
            <line x1="0" y1="101" x2="360" y2="101" />
            <line x1="0" y1="152" x2="360" y2="152" />
            <line x1="90" y1="0" x2="90" y2="202" />
            <line x1="180" y1="0" x2="180" y2="202" />
            <line x1="270" y1="0" x2="270" y2="202" />
          </g>
          <rect
            x="44"
            y="36"
            width="124"
            height="76"
            rx="4"
            fill="var(--c3-turf)"
            fillOpacity="0.28"
            stroke="var(--c3-volt)"
            strokeWidth="2"
          />
          <rect
            x="196"
            y="88"
            width="118"
            height="78"
            rx="4"
            fill="var(--c3-turf-highlight)"
            fillOpacity="0.28"
            stroke="var(--c3-pitch-ink)"
            strokeOpacity="0.45"
            strokeWidth="1.75"
          />
          <circle cx="106" cy="74" r="7" fill="var(--c3-volt)" />
          <circle
            cx="106"
            cy="74"
            r="16"
            stroke="var(--c3-volt)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }

  if (type === 'schedule') {
    return (
      <div
        className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-pitch"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 360 202"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="360" height="202" fill="var(--c3-pitch)" />
          <rect
            x="36"
            y="34"
            width="288"
            height="134"
            rx="6"
            fill="var(--c3-pitch-surface)"
            stroke="var(--c3-pitch-line)"
            strokeWidth="1.5"
          />
          <line
            x1="36"
            y1="72"
            x2="324"
            y2="72"
            stroke="var(--c3-pitch-line)"
            strokeWidth="1.5"
          />
          <rect
            x="54"
            y="92"
            width="74"
            height="54"
            rx="4"
            fill="var(--c3-pitch-elevated)"
            stroke="var(--c3-pitch-line)"
            strokeWidth="1.5"
          />
          <rect
            x="143"
            y="92"
            width="74"
            height="54"
            rx="4"
            fill="var(--c3-volt)"
          />
          <rect
            x="232"
            y="92"
            width="74"
            height="54"
            rx="4"
            fill="var(--c3-pitch-elevated)"
            stroke="var(--c3-pitch-line)"
            strokeWidth="1.5"
          />
          <line
            x1="164"
            y1="119"
            x2="196"
            y2="119"
            stroke="var(--c3-volt-ink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-pitch"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 360 202"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="360" height="202" fill="var(--c3-pitch)" />
        <rect
          x="42"
          y="32"
          width="276"
          height="138"
          rx="6"
          fill="var(--c3-turf)"
          fillOpacity="0.24"
          stroke="var(--c3-pitch-ink)"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
        <line
          x1="180"
          y1="32"
          x2="180"
          y2="170"
          stroke="var(--c3-pitch-ink)"
          strokeOpacity="0.35"
          strokeWidth="1.75"
        />
        <circle cx="180" cy="101" r="28" fill="var(--c3-volt)" />
        <path
          d="M168 101.5L176.2 109.5L193 92.5"
          stroke="var(--c3-volt-ink)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
