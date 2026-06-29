'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { searchCourses, getTrendingCourses } from '@/lib/youtube';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestions = [
  'React', 'Next.js', 'TypeScript', 'Python', 'Machine Learning',
  'Docker', 'Rust', 'GraphQL', 'Tailwind CSS', 'Node.js',
];

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQuery = params.get('q') ?? '';
  const [input, setInput] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 350);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    if (debounced !== initialQuery) {
      router.replace(`/search?q=${encodeURIComponent(debounced)}`);
    }
  }, [debounced]);
  console.log("Query:", debounced);
  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ['search', debounced],
    queryFn: ({ pageParam }) => searchCourses(debounced, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextPageToken,
    enabled: debounced.length > 0,
  });

  const { data: trending } = useQuery({
    queryKey: ['trending-search'],
    queryFn: getTrendingCourses,
    enabled: debounced.length === 0,
  });

  const loadMore = useCallback(async () => {
    await fetchNextPage();
  }, [fetchNextPage]);
  const { sentinelRef, loading } = useInfiniteScroll(loadMore, !!hasNextPage);

  const results = data?.pages.flatMap((p) => p.courses) ?? [];
  console.log(results);
  const display = debounced.length === 0 ? trending?.courses ?? [] : results;

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(input.toLowerCase()) && input.length > 0
  ).slice(0, 5);

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
        Search
      </h1>
      <p className="text-muted-foreground text-lg mb-8">
        Find courses instantly with smart suggestions.
      </p>

      <div className="relative max-w-2xl mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search for React, Python, Docker…"
          className="h-14 pl-12 pr-12 text-base glass-card"
          aria-label="Search courses"
        />
        {input && (
          <button
            onClick={() => setInput('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full mt-2 inset-x-0 glass-strong rounded-2xl p-2 z-20"
            >
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => {
                    setInput(s);
                    setDebounced(s);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-left"
                >
                  <SearchIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{s}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {debounced.length === 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
            <TrendingUp className="h-4 w-4" /> Trending searches
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  setDebounced(s);
                }}
                className="px-4 py-2 rounded-full glass text-sm font-medium hover:glow hover:border-primary/40 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {isError && debounced.length > 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-muted-foreground">Search failed. Please try again.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {display.length === 0 && isFetching
              ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
              : display.map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
          </div>

          {(loading || isFetching) && display.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          )}

          <div ref={sentinelRef} className="h-20" />

          {!hasNextPage && display.length > 0 && debounced.length > 0 && (
            <p className="text-center text-muted-foreground py-10">
              No more results for "{debounced}".
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-28 container mx-auto px-4">Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
