'use client';

import { SectionHeading } from '@/components/section-heading';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Zap, Globe, Users } from 'lucide-react';

const values = [
  { icon: Target, title: 'Mission', desc: 'Make world-class programming education accessible to everyone, beautifully.' },
  { icon: Eye, title: 'Vision', desc: 'A future where anyone can learn to code through a delightful, premium experience.' },
  { icon: Heart, title: 'Values', desc: 'Craftsmanship, accessibility, and relentless attention to detail.' },
];

const stats = [
  { icon: Zap, value: '95+', label: 'Lighthouse Score' },
  { icon: Globe, value: '10', label: 'Categories' },
  { icon: Users, value: '24/7', label: 'Learning' },
];

const tech = ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'GSAP', 'Framer Motion', 'Three.js', 'React Three Fiber', 'Zustand', 'TanStack Query', 'React Hook Form', 'Zod'];

export default function AboutPage() {
  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <SectionHeading
        eyebrow="Our story"
        title="Built for learners who care about craft"
        description="Courses is a premium programming courses platform that brings together the best video content from across the web into one beautiful, futuristic experience."
        align="center"
      />

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
              <v.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-6 text-center"
          >
            <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl md:text-4xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <SectionHeading eyebrow="Built with" title="Modern technology stack" align="center" />
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {tech.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="px-4 py-2 rounded-full glass text-sm font-medium"
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
