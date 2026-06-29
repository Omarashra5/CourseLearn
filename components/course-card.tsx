'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Eye, Clock, PlayCircle, BarChart3 } from 'lucide-react';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import { formatViews, timeAgo, truncate } from '@/lib/format';
import type { Course } from '@/lib/types';
import { cn } from '@/lib/utils';

const levelStyles: Record<Course['level'], string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Intermediate: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Advanced: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const fav = isFavorite(course.videoId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link href={`/courses/${course.videoId}`} className="block">
        <div className="glass-card card-shine overflow-hidden h-full flex flex-col group-hover:glow group-hover:border-primary/40">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
              <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center glow">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            {course.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {course.duration}
              </div>
            )}
            <div className="absolute top-2 left-2 flex gap-1.5">
              <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium backdrop-blur-sm', levelStyles[course.level])}>
                {course.level}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(course);
              }}
              className="absolute top-2 right-2 h-8 w-8 rounded-full glass-strong flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('h-4 w-4 transition-all', fav && 'fill-rose-500 text-rose-500 scale-110')} />
            </button>
          </div>

          <div className="p-4 flex flex-col flex-1">
            <span className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">
              {course.category}
            </span>
            <h3 className="font-display font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
              {truncate(course.description, 120)}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
              <span className="font-medium truncate max-w-[55%]">{course.channelTitle}</span>
              <div className="flex items-center gap-3">
                {course.viewCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViews(course.viewCount)}
                  </span>
                )}
                <span>{timeAgo(course.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-video bg-muted shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-muted rounded shimmer" />
        <div className="h-4 w-full bg-muted rounded shimmer" />
        <div className="h-4 w-2/3 bg-muted rounded shimmer" />
        <div className="h-3 w-full bg-muted rounded shimmer" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-24 bg-muted rounded shimmer" />
          <div className="h-3 w-16 bg-muted rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
