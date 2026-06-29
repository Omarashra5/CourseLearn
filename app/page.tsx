'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Search, Infinity as InfinityIcon, Shield, Play, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/section-heading';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { useQuery } from '@tanstack/react-query';
import { getTrendingCourses } from '@/lib/youtube';
import type { Category } from '@/lib/types';

const HeroScene = dynamic(() => import('@/components/hero-scene').then(m => m.HeroScene), { ssr: false });

const categories: { name: Category; gradient: string }[] = [
  { name: 'Web Development', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Frontend', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Backend', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Data Science', gradient: 'from-amber-500 to-orange-500' },
  { name: 'Machine Learning', gradient: 'from-violet-500 to-purple-500' },
  { name: 'DevOps', gradient: 'from-sky-500 to-indigo-500' },
  { name: 'Mobile Development', gradient: 'from-fuchsia-500 to-pink-500' },
  { name: 'Algorithms', gradient: 'from-lime-500 to-green-500' },
];

const features = [
  { icon: Search, title: 'Instant Search', desc: 'Find courses in milliseconds with smart suggestions and filters.' },
  { icon: InfinityIcon, title: 'Infinite Scroll', desc: 'Browse endlessly with seamless pagination and lazy loading.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for performance with a Lighthouse score of 95+.' },
  { icon: Shield, title: 'Secure Auth', desc: 'Local-first authentication with Zustand persist and encryption.' },
];

const heroStats = [
  { icon: Play, value: '500+', label: 'Courses' },
  { icon: Users, value: '10', label: 'Categories' },
  { icon: Star, value: '4.9', label: 'Avg Rating' },
  { icon: TrendingUp, value: '24/7', label: 'Learning' },
];

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingCourses,
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
            >
              <span className="text-sm font-medium">Curated programming courses from across the web</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.02]"
            >
              Learn to code,
              <br />
              <span className="text-gradient">beautifully.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Courses brings together the best programming video courses into one
              premium, futuristic learning experience. Search, filter, and master
              any technology — all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="glow-strong text-base h-12 px-8 group">
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base h-12 px-8 glass">
                <Link href="/search">Try Instant Search</Link>
              </Button>
            </motion.div>

            {/* Hero stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl"
            >
              {heroStats.map((s) => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <s.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="font-display text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-10 w-6 rounded-full border-2 border-current flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-current"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Why Courses"
          title="A learning experience built for the future"
          description="Every detail crafted for speed, beauty, and depth."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card card-shine p-6 hover:glow transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading
          eyebrow="Browse by topic"
          title="Explore categories"
          description="From web development to machine learning, find your path."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/categories?cat=${encodeURIComponent(cat.name)}`}
                className="glass-card card-shine p-5 flex items-center gap-3 hover:glow hover:border-primary/40 transition-all duration-300 group"
              >
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <SectionHeading
            eyebrow="Hot right now"
            title="Trending courses"
            className="mb-0"
          />
          <Button asChild variant="ghost" className="hidden sm:flex group">
            <Link href="/courses">
              View all <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : data?.courses.slice(0, 8).map((c, i) => (
                <CourseCard key={c.videoId} course={c} index={i} />
              ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-strong rounded-3xl p-10 md:p-16 text-center overflow-hidden card-shine"
        >
          <div className="absolute inset-0 aurora-bg opacity-30" />
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/20 blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-[80px]" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to start learning?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Create a free account to save favorites, track your progress, and
              personalize your experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="glow-strong h-12 px-8 group">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass h-12 px-8">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
