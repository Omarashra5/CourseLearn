'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCoursesByCategory } from '@/lib/youtube';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { SectionHeading } from '@/components/section-heading';
import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';
import { Suspense } from 'react';

const allCategories: { name: Category; icon: string; gradient: string; desc: string }[] = [
  { name: 'Web Development', icon: '🌐', gradient: 'from-blue-500 to-cyan-500', desc: 'Full-stack web with modern frameworks.' },
  { name: 'Frontend', icon: '🎨', gradient: 'from-pink-500 to-rose-500', desc: 'UI, CSS, and client-side frameworks.' },
  { name: 'Backend', icon: '⚙️', gradient: 'from-emerald-500 to-teal-500', desc: 'APIs, databases, and server logic.' },
  { name: 'Data Science', icon: '📊', gradient: 'from-amber-500 to-orange-500', desc: 'Analysis, visualization, and statistics.' },
  { name: 'Machine Learning', icon: '🤖', gradient: 'from-violet-500 to-purple-500', desc: 'ML, deep learning, and AI.' },
  { name: 'DevOps', icon: '🚀', gradient: 'from-sky-500 to-indigo-500', desc: 'CI/CD, containers, and cloud.' },
  { name: 'Mobile Development', icon: '📱', gradient: 'from-fuchsia-500 to-pink-500', desc: 'iOS, Android, and cross-platform.' },
  { name: 'Algorithms', icon: '🧮', gradient: 'from-lime-500 to-green-500', desc: 'Data structures and interview prep.' },
  { name: 'Game Development', icon: '🎮', gradient: 'from-red-500 to-orange-500', desc: 'Unity, Unreal, and game design.' },
  { name: 'Security', icon: '🔒', gradient: 'from-slate-500 to-gray-600', desc: 'Ethical hacking and secure coding.' },
];

function CategoriesContent() {
  const params = useSearchParams();
  const active = params.get('cat') as Category | null;

  const { data, isLoading } = useQuery({
    queryKey: ['category', active],
    queryFn: () => getCoursesByCategory(active as Category),
    enabled: !!active,
  });

  if (!active) {
    return (
      <div className="pt-28 container mx-auto px-4 min-h-screen">
        <SectionHeading
          eyebrow="Browse"
          title="Categories"
          description="Pick a topic and dive into curated courses."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href={`/categories?cat=${encodeURIComponent(cat.name)}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass-card p-6 group hover:glow hover:border-primary/40 transition-all duration-300"
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <a href="/categories" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
        ← All categories
      </a>
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
        {active}
      </h1>
      <p className="text-muted-foreground text-lg mb-8">
        {allCategories.find((c) => c.name === active)?.desc}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
          : data?.courses.map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="pt-28 container mx-auto px-4">Loading…</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
