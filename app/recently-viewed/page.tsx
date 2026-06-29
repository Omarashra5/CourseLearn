'use client';

import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store';
import Link from 'next/link';

export default function RecentlyViewedPage() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewedStore();

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">History</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Recently viewed
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            {recentlyViewed.length} {recentlyViewed.length === 1 ? 'course' : 'courses'} viewed
          </p>
        </div>
        {recentlyViewed.length > 0 && (
          <Button variant="outline" onClick={clearRecentlyViewed} className="glass">
            <Trash2 className="h-4 w-4 mr-2" /> Clear history
          </Button>
        )}
      </div>

      {recentlyViewed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-16 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Nothing here yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Courses you view will appear here so you can pick up where you left off.
          </p>
          <Button asChild className="glow">
            <Link href="/courses">Start exploring</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentlyViewed.map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
