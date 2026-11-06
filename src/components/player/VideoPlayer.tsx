import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Share2,
  User,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlays } from '../../context/PlaysContext';
import { ROUTES } from '../../routes/paths';
import { Match } from '../../types/match';
import { SavedPlay } from '../../types/play';
import { formatVideoTime } from '../../utils/sharing';
import { AccessEmailModal } from '../auth/AccessEmailModal';
import { ShareModal } from '../sharing/ShareModal';
import { Button } from '../ui/Button';

interface VideoPlayerProps {
  match: Match;
  highlightedPlay?: SavedPlay | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  match,
  highlightedPlay,
}) => {
  const navigate = useNavigate();
  const { authMode, user } = useAuth();
  const { savePlay } = usePlays();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(highlightedPlay?.startTime ?? 0);
  const [duration, setDuration] = useState<number>(match.duration || 60);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Muted by default for autoplay compliance
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<{
    visible: boolean;
    play: SavedPlay | null;
    timestampText: string;
  }>({
    visible: false,
    play: null,
    timestampText: '',
  });

  const controlsTimeoutRef = useRef<number | null>(null);

  // If highlighted play provided, seek video to its startTime
  useEffect(() => {
    if (highlightedPlay && videoRef.current) {
      videoRef.current.currentTime = highlightedPlay.startTime;
      setCurrentTime(highlightedPlay.startTime);
    }
  }, [highlightedPlay]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = Boolean(
        document.fullscreenElement ||
          (document as any).webkitFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, volume]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
    if (highlightedPlay) {
      videoRef.current.currentTime = highlightedPlay.startTime;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const seekRelative = (delta: number) => {
    if (!videoRef.current) return;
    const target = Math.min(Math.max(0, videoRef.current.currentTime + delta), duration);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
          // Fallback for iOS Safari
          (videoRef.current as any).webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      // Silently ignore fullscreen failures if rejected by browser
    }
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current !== null) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3200);
  };

  // Guardar jugada handler
  const handleSavePlayClick = async () => {
    if (authMode === 'guest') {
      // User is not registered: prompt access modal
      setIsAccessModalOpen(true);
      return;
    }

    // Registered user flow
    const timestampSec = Math.floor(currentTime);
    const formatted = formatVideoTime(timestampSec);

    const newPlay = await savePlay({
      matchId: match.id,
      title: `Jugada en ${formatVideoTime(timestampSec)}`,
      clubName: match.clubName,
      courtName: match.courtName,
      dateLabel: match.dateLabel,
      timeSlot: match.timeSlot,
      startTime: Math.max(0, timestampSec - 2),
      endTime: timestampSec + 3,
    });

    setSavedToast({
      visible: true,
      play: newPlay,
      timestampText: formatted,
    });

    setTimeout(() => {
      setSavedToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  };

  const hasVideoSource = Boolean(match.videoSrc && match.status === 'available');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      className="relative w-full h-[100dvh] bg-pitch text-pitch-ink overflow-hidden select-none flex flex-col justify-between"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Video Element or High-Quality Architectural Poster Fallback */}
      <div className="absolute inset-0 flex items-center justify-center bg-pitch overflow-hidden">
        {hasVideoSource ? (
          <video
            ref={videoRef}
            src={match.videoSrc!}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-pitch-surface">
            <div className="w-16 h-16 rounded-2xl bg-pitch-elevated border border-pitch-line flex items-center justify-center text-volt mb-4">
              <Zap className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-pitch-ink">
              {match.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-pitch-muted max-w-md">
              {match.statusMessage ||
                'La grabación automática no está disponible para este horario.'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(ROUTES.SEARCH)}
              >
                Buscar otro partido
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Top Header Bar with Context & Back Action */}
      <div
        className={`relative z-20 w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-200 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.SEARCH)}
              aria-label="Volver al buscador de partidos"
              className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg bg-black/50 text-pitch-ink hover:bg-black/70 border border-white/10 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-volt font-medium">
                <span className="truncate">{match.clubName}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{match.courtName}</span>
              </div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight truncate leading-tight">
                {match.title}
              </h1>
            </div>
          </div>

          {/* Quick status / profile link */}
          <div className="flex items-center gap-2">
            {highlightedPlay && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-volt text-volt-ink font-mono text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Jugada destacada</span>
              </span>
            )}

            {authMode === 'registered' && (
              <button
                type="button"
                onClick={() => navigate(ROUTES.PROFILE)}
                aria-label="Ir a mi perfil con jugadas guardadas"
                className="min-h-[36px] px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-volt" aria-hidden="true" />
                <span className="hidden sm:inline">Mi perfil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toast when a play is saved */}
      {savedToast.visible && (
        <div
          role="status"
          className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-sm w-[92%] p-3.5 rounded-xl bg-surface text-ink border border-line shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-turf-soft flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-turf stroke-[2.5]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-xs text-ink truncate">
                ¡Jugada guardada en {savedToast.timestampText}!
              </p>
              <p className="text-[11px] text-ink-muted truncate">
                Disponible en tu lista de jugadas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.PROFILE)}
            className="px-2.5 py-1.5 rounded-md bg-volt text-volt-ink text-xs font-semibold shrink-0 cursor-pointer hover:bg-volt-hover transition-colors"
          >
            Ver perfil
          </button>
        </div>
      )}

      {/* Center Big Play Pause indicator when paused manually */}
      {!isPlaying && hasVideoSource && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Reanudar reproducción"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-volt text-volt-ink flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Play className="w-7 h-7 fill-volt-ink translate-x-0.5" aria-hidden="true" />
        </button>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`relative z-20 w-full px-4 sm:px-6 pb-4 sm:pb-6 pt-8 bg-gradient-to-t from-black/90 via-black/55 to-transparent transition-opacity duration-200 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Progress / Scrub Bar */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-medium text-white tabular-nums shrink-0">
              {formatVideoTime(currentTime)}
            </span>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 60}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                aria-label="Barra de progreso del video"
                className="w-full h-1.5 rounded-lg appearance-none bg-white/25 accent-volt cursor-pointer focus:outline-none"
              />
            </div>

            <span className="font-mono text-xs font-medium text-white/70 tabular-nums shrink-0">
              {formatVideoTime(duration)}
            </span>
          </div>

          {/* Controls & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Playback Controls: Play/Pause, Seek 5s, Volume */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" aria-hidden="true" />
                ) : (
                  <Play className="w-5 h-5 fill-white" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => seekRelative(-5)}
                aria-label="Retroceder 5 segundos"
                className="hidden sm:inline-flex min-w-[36px] min-h-[36px] items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                  className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-alert" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Control de volumen"
                  className="hidden md:inline-block w-16 h-1 rounded-lg appearance-none bg-white/20 accent-volt cursor-pointer"
                />
              </div>
            </div>

            {/* Primary Actions: Guardar jugada + Compartir + Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Button
                variant="volt"
                size="sm"
                onClick={handleSavePlayClick}
                className="font-semibold"
              >
                <Bookmark className="w-4 h-4 shrink-0 fill-volt-ink" aria-hidden="true" />
                <span>Guardar jugada</span>
              </Button>

              <Button
                variant="darkSecondary"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Compartir</span>
              </Button>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Maximize className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        match={match}
        activePlay={highlightedPlay}
        currentTimestamp={currentTime}
      />

      {/* Access Email Modal for Guests */}
      <AccessEmailModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        onSuccessRegistered={() => {
          setIsAccessModalOpen(false);
          handleSavePlayClick();
        }}
      />
    </div>
  );
};
