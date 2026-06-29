'use client';

import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore();

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="text-sm font-medium text-rose-500">Favorites</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Your saved courses
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            {favorites.length} {favorites.length === 1 ? 'course' : 'courses'} saved
          </p>
        </div>
        {favorites.length > 0 && (
          <Button variant="outline" onClick={clearFavorites} className="glass">
            <Trash2 className="h-4 w-4 mr-2" /> Clear all
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-16 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-rose-500" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Tap the heart icon on any course to save it here for later.
          </p>
          <Button asChild className="glow">
            <Link href="/courses">Browse courses</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
