import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow mx-auto mb-6">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-6xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-muted-foreground text-lg mb-8">
          This page drifted off into the Courses. Let's get you back.
        </p>
        <Button asChild size="lg" className="glow">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
