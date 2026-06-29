'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, ThumbsUp, Clock, ArrowLeft, Share2, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/video-player';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { formatViews, timeAgo } from '@/lib/format';
import type { Course } from '@/lib/types';
import { toast } from 'sonner';

const levelStyles: Record<Course['level'], string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Intermediate: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Advanced: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

export function CourseDetailClient({ course }: { course: Course }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addViewed } = useRecentlyViewedStore();
  const { isAuthenticated } = useAuthStore();
  const fav = isFavorite(course.videoId);

  useEffect(() => {
    addViewed(course);
  }, [course, addViewed]);

  const learningPoints = course.description
    .split(/[.!?]/)
    .filter((s) => s.trim().length > 20)
    .slice(0, 4)
    .map((s) => s.trim());

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen pb-20">
      <Link href="/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to courses
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VideoPlayer
              videoId={course.videoId}
              thumbnail={course.thumbnail}
              title={course.title}
            />
          </motion.div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${levelStyles[course.level]}`}>
                {course.level}
              </span>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {learningPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-8 glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">What you'll learn</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {learningPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6 sticky top-28">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/60">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
                {course.channelTitle.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{course.channelTitle}</p>
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {course.duration && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
              )}
              {course.viewCount !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Eye className="h-4 w-4" /> Views</span>
                  <span className="font-medium">{formatViews(course.viewCount)}</span>
                </div>
              )}
              {course.likeCount !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> Likes</span>
                  <span className="font-medium">{formatViews(course.likeCount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Published</span>
                <span className="font-medium">{timeAgo(course.publishedAt)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                size="lg"
                className="glass"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('Please sign in to save favorites');
                    return;
                  }
                  toggleFavorite(course);
                  toast(fav ? 'Removed from favorites' : 'Added to favorites');
                }}
              >
                <Heart className={`h-5 w-5 mr-2 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
                {fav ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/courses/${course.videoId}`);
                  toast.success('Course link copied');
                }}
              >
                <Share2 className="h-5 w-5 mr-2" /> Share course
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              The video plays right here in Courses — no redirects.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
