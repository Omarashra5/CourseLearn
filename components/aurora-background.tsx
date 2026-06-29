'use client';

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 aurora-bg opacity-70 dark:opacity-40" />

      {/* Floating orbs */}
      <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-[120px] animate-float" />
      <div
        className="absolute top-1/3 -right-40 h-[35rem] w-[35rem] rounded-full bg-accent/20 blur-[120px] animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-chart-4/10 blur-[120px] animate-float"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[25rem] w-[25rem] rounded-full bg-chart-2/10 blur-[100px] animate-float"
        style={{ animationDelay: '1s' }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dots-pattern opacity-[0.02] dark:opacity-[0.04]" />

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/50 to-transparent" />
    </div>
  );
}
