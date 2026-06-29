'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Maximize, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoId: string;
  thumbnail: string;
  title: string;
  autoplay?: boolean;
  className?: string;
}

export function VideoPlayer({
  videoId,
  thumbnail,
  title,
  autoplay = false,
  className,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoplay);
  const [muted, setMuted] = useState(false);
  const [theater, setTheater] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!theater) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTheater(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [theater]);

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1${muted ? '&mute=1' : ''}`;

  const player = (
    <div
      className={cn(
        'relative w-full aspect-video bg-black rounded-2xl overflow-hidden',
        className
      )}
    >
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button
          onClick={() => setMuted((m) => !m)}
          className="h-9 w-9 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setTheater(true)}
          className="h-9 w-9 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Theater mode"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!playing ? (
        <div
          ref={containerRef}
          className={cn(
            'relative w-full aspect-video rounded-2xl overflow-hidden glass-card group cursor-pointer',
            className
          )}
          onClick={() => setPlaying(true)}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center glow group-hover:glow-accent transition-all"
            >
              <Play className="h-9 w-9 text-white ml-1" fill="white" />
            </motion.div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-medium text-sm line-clamp-1 drop-shadow-lg">
              {title}
            </p>
            <p className="text-white/70 text-xs mt-0.5">Click to play in Courses</p>
          </div>
        </div>
      ) : (
        player
      )}

      <AnimatePresence>
        {theater && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setTheater(false)}
          >
            <button
              className="absolute top-6 right-6 h-11 w-11 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-transform z-10"
              onClick={() => setTheater(false)}
              aria-label="Close theater"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {player}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
