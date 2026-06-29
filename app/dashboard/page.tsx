'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Clock, TrendingUp, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { SectionHeading } from '@/components/section-heading';
import { useFavoritesStore } from '@/lib/stores/favorites-store';
import { useRecentlyViewedStore } from '@/lib/stores/recently-viewed-store';
import { useQuery } from '@tanstack/react-query';
import { getTrendingCourses } from '@/lib/youtube';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    return unsubscribe;
  }, []);
  const { favorites } = useFavoritesStore();
  const { recentlyViewed } = useRecentlyViewedStore();
  const { data: trending } = useQuery({ queryKey: ['trending-dash'], queryFn: getTrendingCourses });

  const stats = [
    { label: 'Favorites', value: favorites.length, icon: Heart, href: '/favorites', color: 'from-rose-500 to-pink-500' },
    { label: 'Recently Viewed', value: recentlyViewed.length, icon: Clock, href: '/recently-viewed', color: 'from-amber-500 to-orange-500' },
    { label: 'Trending', value: trending?.courses.length ?? 0, icon: TrendingUp, href: '/courses', color: 'from-emerald-500 to-teal-500' },
    { label: 'Categories', value: 10, icon: BookOpen, href: '/categories', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-primary">Dashboard</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          Welcome back , {user?.displayName ?? user?.email ?? "Learner"} 👋        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Track your progress and continue where you left off.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link href={s.href} className="glass-card p-5 block group hover:glow transition-all">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-3xl font-bold font-display">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {recentlyViewed.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Continue learning</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/recently-viewed">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Your favorites</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/favorites">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.slice(0, 4).map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
          </div>
        </section>
      )}

      <section>
        <SectionHeading eyebrow="Recommended" title="Trending now" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trending?.courses.slice(0, 4).map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
        </div>
      </section>
    </div>
  );
}
