import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ChevronDown, Search } from 'lucide-react';
import {
  buildHeroPosterDataUri,
  HERO_COPY,
  HERO_VIDEO_PLAYBACK_RATE,
  HERO_VIDEO_SRC,
} from '../../data/heroConfig';
import { Complex, SearchSelection } from '../../types/canchas';
import { Button } from '../ui/Button';
import { formatCurrencyArs } from '../ui/ComplexCard';

interface HeroSearchSectionProps {
  complexes: Complex[];
  activeCityName: string;
  onSearchSubmit: (selection: SearchSelection) => void;
  onPrimaryCta: () => void;
  onOwnerCta: () => void;
}

export const HeroSearchSection: React.FC<HeroSearchSectionProps> = ({
  complexes,
  activeCityName,
  onSearchSubmit,
  onPrimaryCta,
  onOwnerCta,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const complexSelectRef = useRef<HTMLSelectElement | null>(null);

  const [posterUri, setPosterUri] = useState<string>('');
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  const [complexId, setComplexId] = useState<string>('');
  const [courtId, setCourtId] = useState<string>('');
  const [dayId, setDayId] = useState<string>('');
  const [slotId, setSlotId] = useState<string>('');
  const [searchPromptMessage, setSearchPromptMessage] = useState<string>('');

  // Reset cascading search when city complexes list changes
  useEffect(() => {
    setComplexId('');
    setCourtId('');
    setDayId('');
    setSlotId('');
    setSearchPromptMessage('');
  }, [complexes]);

  // Configure video poster, playback rate, and reduced motion compliance
  useEffect(() => {
    setPosterUri(buildHeroPosterDataUri());

    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const applyPlaybackRate = () => {
      if (prefersReducedMotion) {
        video.pause();
        return;
      }
      video.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
    };

    applyPlaybackRate();
    video.addEventListener('loadedmetadata', applyPlaybackRate);
    video.addEventListener('canplay', applyPlaybackRate);

    return () => {
      video.removeEventListener('loadedmetadata', applyPlaybackRate);
      video.removeEventListener('canplay', applyPlaybackRate);
    };
  }, []);

  const selectedComplex = useMemo(
    () => complexes.find((c) => c.id === complexId),
    [complexes, complexId]
  );

  const selectedCourt = useMemo(
    () => selectedComplex?.courts.find((c) => c.id === courtId),
    [selectedComplex, courtId]
  );

  const selectedDay = useMemo(
    () => selectedCourt?.availabilityByDay.find((d) => d.id === dayId),
    [selectedCourt, dayId]
  );

  const availableSlots = selectedDay?.slots ?? [];
  const hasNoSlotsForSelectedDay =
    Boolean(selectedDay) && availableSlots.length === 0;

  const alternativeDayWithSlots = useMemo(
    () =>
      selectedCourt?.availabilityByDay.find(
        (d) => d.id !== dayId && d.slots.length > 0
      ),
    [selectedCourt, dayId]
  );

  const handleComplexChange = (nextComplexId: string) => {
    setComplexId(nextComplexId);
    setCourtId('');
    setDayId('');
    setSlotId('');
    setSearchPromptMessage('');
  };

  const handleCourtChange = (nextCourtId: string) => {
    setCourtId(nextCourtId);
    setDayId('');
    setSlotId('');
    setSearchPromptMessage('');
  };

  const handleDayChange = (nextDayId: string) => {
    setDayId(nextDayId);
    setSlotId('');
    setSearchPromptMessage('');
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!complexId) {
      if (complexes.length === 0) {
        onPrimaryCta();
        return;
      }
      setSearchPromptMessage(
        'Elegí primero un club o complejo para filtrar horarios.'
      );
      complexSelectRef.current?.focus();
      return;
    }

    setSearchPromptMessage('');
    onSearchSubmit({
      complexId,
      courtId,
      dayId,
      slotId,
    });
  };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-pitch text-pitch-ink dark-focus min-h-[600px] lg:min-h-[700px] flex items-center"
    >
      {/* Architectural CSS-token fallback backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-pitch"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 75% 60% at 50% 35%, var(--c3-pitch-elevated) 0%, var(--c3-pitch) 78%)',
        }}
      />

      {/* Background Hero Video */}
      {!videoFailed && (
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          poster={posterUri || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* Measured Dark Gradient Scrim for >= 4.5:1 Contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, var(--c3-scrim-top) 0%, var(--c3-scrim-mid) 46%, var(--c3-scrim-bottom) 100%)',
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-volt">
            Canchas de fútbol · {activeCityName}
          </p>

          <h1 className="mt-3 font-display text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-pitch-ink leading-[1.03]">
            {HERO_COPY.headline}
          </h1>

          <p className="mt-4 text-base sm:text-xl text-pitch-ink/90 max-w-2xl leading-relaxed">
            {HERO_COPY.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="volt" size="lg" onClick={onPrimaryCta}>
              {HERO_COPY.primaryCta}
            </Button>
            <Button variant="darkSecondary" size="lg" onClick={onOwnerCta}>
              {HERO_COPY.secondaryCta}
            </Button>
          </div>
        </div>

        {/* Protagonista Cascading Search Bar */}
        <form
          id="buscador"
          onSubmit={handleFormSubmit}
          aria-label="Buscador de canchas disponibles"
          className="mt-8 sm:mt-10 bg-surface text-ink rounded-xl p-4 sm:p-5 border border-line shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1.2fr_1fr_1fr_auto] gap-3.5 lg:gap-3 lg:items-end">
            {/* 1. Club / Complejo */}
            <div>
              <label
                htmlFor="search-complex"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5"
              >
                1. Club o complejo
              </label>
              <div className="relative">
                <select
                  ref={complexSelectRef}
                  id="search-complex"
                  value={complexId}
                  onChange={(e) => handleComplexChange(e.target.value)}
                  disabled={complexes.length === 0}
                  className="w-full min-h-[46px] appearance-none rounded-lg bg-canvas border border-line-strong pl-3.5 pr-9 py-2.5 text-sm font-medium text-ink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {complexes.length === 0
                      ? 'Sin complejos en esta ciudad'
                      : 'Elegí un complejo'}
                  </option>
                  {complexes.map((complex) => (
                    <option key={complex.id} value={complex.id}>
                      {complex.name} ({complex.zone})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-ink-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* 2. Cancha (Disabled until Club is chosen) */}
            <div>
              <label
                htmlFor="search-court"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5"
              >
                2. Cancha
              </label>
              <div className="relative">
                <select
                  id="search-court"
                  value={courtId}
                  onChange={(e) => handleCourtChange(e.target.value)}
                  disabled={!selectedComplex}
                  className="w-full min-h-[46px] appearance-none rounded-lg bg-canvas border border-line-strong pl-3.5 pr-9 py-2.5 text-sm font-medium text-ink cursor-pointer disabled:bg-surface-muted disabled:text-ink-muted disabled:border-line disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedComplex
                      ? 'Elegí una cancha'
                      : 'Primero elegí complejo'}
                  </option>
                  {selectedComplex?.courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-ink-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* 3. Fecha (Disabled until Cancha is chosen) */}
            <div>
              <label
                htmlFor="search-day"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5"
              >
                3. Fecha
              </label>
              <div className="relative">
                <select
                  id="search-day"
                  value={dayId}
                  onChange={(e) => handleDayChange(e.target.value)}
                  disabled={!selectedCourt}
                  className="w-full min-h-[46px] appearance-none rounded-lg bg-canvas border border-line-strong pl-3.5 pr-9 py-2.5 text-sm font-medium text-ink cursor-pointer disabled:bg-surface-muted disabled:text-ink-muted disabled:border-line disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedCourt ? 'Elegí una fecha' : 'Primero elegí cancha'}
                  </option>
                  {selectedCourt?.availabilityByDay.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-ink-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* 4. Horario (Disabled until Fecha is chosen & has slots) */}
            <div>
              <label
                htmlFor="search-slot"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5"
              >
                4. Horario
              </label>
              <div className="relative">
                <select
                  id="search-slot"
                  value={slotId}
                  onChange={(e) => setSlotId(e.target.value)}
                  disabled={!selectedDay || availableSlots.length === 0}
                  className="w-full min-h-[46px] appearance-none rounded-lg bg-canvas border border-line-strong pl-3.5 pr-9 py-2.5 text-sm font-mono font-medium text-ink cursor-pointer disabled:font-sans disabled:bg-surface-muted disabled:text-ink-muted disabled:border-line disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedDay
                      ? 'Primero elegí fecha'
                      : availableSlots.length === 0
                      ? 'Sin horarios libres'
                      : 'Elegí un horario'}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.time} hs · {formatCurrencyArs(slot.price)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-ink-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="volt"
                size="lg"
                className="w-full lg:w-auto min-h-[46px]"
              >
                <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Buscar canchas</span>
              </Button>
            </div>
          </div>

          {/* Inline message when selected date has no available slots */}
          {hasNoSlotsForSelectedDay && selectedCourt && selectedDay && (
            <div
              role="status"
              className="mt-3.5 p-3 rounded-lg bg-warning-soft border border-warning/30 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-ink"
            >
              <span className="flex items-center gap-2 font-medium">
                <AlertCircle
                  className="w-4 h-4 text-warning shrink-0"
                  aria-hidden="true"
                />
                <span>
                  No hay horarios disponibles en {selectedCourt.name} para{' '}
                  {selectedDay.label.toLowerCase()}.
                </span>
              </span>
              {alternativeDayWithSlots && (
                <button
                  type="button"
                  onClick={() => handleDayChange(alternativeDayWithSlots.id)}
                  className="font-semibold text-turf-ink underline underline-offset-4 cursor-pointer"
                >
                  Probar {alternativeDayWithSlots.label}
                </button>
              )}
            </div>
          )}

          {/* Inline message when user submits without choosing a complex */}
          {searchPromptMessage && (
            <div
              role="status"
              className="mt-3.5 p-3 rounded-lg bg-surface-muted border border-line flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-ink"
            >
              <span className="flex items-center gap-2 font-medium">
                <AlertCircle
                  className="w-4 h-4 text-turf shrink-0"
                  aria-hidden="true"
                />
                <span>{searchPromptMessage}</span>
              </span>
              <button
                type="button"
                onClick={onPrimaryCta}
                className="font-semibold text-turf-ink underline underline-offset-4 cursor-pointer"
              >
                Ver todos los complejos
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
