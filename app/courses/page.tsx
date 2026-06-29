'use client';

import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchCourses } from '@/lib/youtube';
import { CourseCard, CourseCardSkeleton } from '@/components/course-card';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { SortOption, FilterLevel } from '@/lib/types';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'views', label: 'Most Viewed' },
];

const levels: FilterLevel[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [sort, setSort] = useState<SortOption>('relevance');
  const [level, setLevel] = useState<FilterLevel>('All');

  const { data, fetchNextPage, hasNextPage, isFetching, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['courses-all'],
      queryFn: ({ pageParam }) => searchCourses('programming tutorial', pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (last) => last.nextPageToken,
    });

  const loadMore = useCallback(async () => {
    await fetchNextPage();
  }, [fetchNextPage]);

  const { sentinelRef, loading } = useInfiniteScroll(loadMore, !!hasNextPage);

  const allCourses = data?.pages.flatMap((p) => p.courses) ?? [];

  const filtered = allCourses
    .filter((c) => level === 'All' || c.level === level)
    .sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popular':
          return (b.likeCount ?? 0) - (a.likeCount ?? 0);
        case 'views':
          return (b.viewCount ?? 0) - (a.viewCount ?? 0);
        default:
          return 0;
      }
    });

  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          All Courses
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse our complete catalog of programming courses.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8 glass-card p-4 rounded-2xl">
        <span className="text-sm font-medium text-muted-foreground">Sort by</span>
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm font-medium text-muted-foreground ml-2">Level</span>
        <div className="flex gap-1">
          {levels.map((l) => (
            <Button
              key={l}
              size="sm"
              variant={level === l ? 'default' : 'outline'}
              onClick={() => setLevel(l)}
            >
              {l}
            </Button>
          ))}
        </div>

        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} courses
        </span>
      </div>

      {isError ? (
        <div className="glass-card p-10 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">We couldn't load courses. Please try again.</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.length === 0 && isFetching
              ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
              : filtered.map((c, i) => <CourseCard key={c.videoId} course={c} index={i} />)}
          </div>

          {(loading || isFetching) && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          )}

          <div ref={sentinelRef} className="h-20" />

          {!hasNextPage && filtered.length > 0 && (
            <p className="text-center text-muted-foreground py-10">
              You've reached the end. 🎉
            </p>
          )}
        </>
      )}
    </div>
  );
}
