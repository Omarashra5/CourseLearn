  import type {
    Course,
    CourseSearchResult,
    Category,
  } from '@/lib/types';
  import sampleCourses from '@/data/courses.json';

  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const BASE_URL = 'https://www.googleapis.com/youtube/v3';

  const CATEGORY_KEYWORDS: Record<Category, string> = {
    'Web Development': 'web development tutorial',
    'Mobile Development': 'mobile app development tutorial',
    'Data Science': 'data science tutorial',
    'Machine Learning': 'machine learning tutorial',
    DevOps: 'devops tutorial',
    'Game Development': 'game development tutorial',
    Backend: 'backend development tutorial',
    Frontend: 'frontend development tutorial',
    Algorithms: 'algorithms and data structures',
    Security: 'cybersecurity tutorial',
  };

  function inferCategory(title: string, tags: string[]): Category {
    const text = `${title} ${tags.join(' ')}`.toLowerCase();
    if (/react|vue|angular|css|html|frontend|tailwind/.test(text))
      return 'Frontend';
    if (/node|express|api|graphql|backend|database|sql/.test(text))
      return 'Backend';
    if (/web|javascript|typescript|next\.?js/.test(text)) return 'Web Development';
    if (/android|ios|flutter|react native|mobile/.test(text))
      return 'Mobile Development';
    if (/data science|pandas|numpy|analysis/.test(text)) return 'Data Science';
    if (/machine learning|ml|tensorflow|pytorch|neural/.test(text))
      return 'Machine Learning';
    if (/devops|docker|kubernetes|ci\/cd|terraform/.test(text)) return 'DevOps';
    if (/game|unity|unreal|godot/.test(text)) return 'Game Development';
    if (/algorithm|data structure|leetcode|complexity/.test(text))
      return 'Algorithms';
    if (/security|hacking|penetration|exploit/.test(text)) return 'Security';
    return 'Web Development';
  }

  function inferLevel(title: string): Course['level'] {
    const t = title.toLowerCase();
    if (/beginner|intro|basics|crash course|fundamental|101/.test(t))
      return 'Beginner';
    if (/advanced|expert|master|deep dive|production/.test(t)) return 'Advanced';
    return 'Intermediate';
  }

  function parseDuration(iso8601?: string): string | undefined {
    if (!iso8601) return undefined;
    const m = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return undefined;
    const [, h, min, sec] = m;
    const parts = [
      h ? String(h).padStart(2, '0') : '',
      min ? String(min).padStart(2, '0') : h ? '00' : '',
      sec ? String(sec).padStart(2, '0') : '00',
    ].filter(Boolean);
    return parts.join(':');
  }

  function formatLocalCourses(): Course[] {
    return (sampleCourses as Array<Omit<Course, 'category' | 'level' | 'tags'>>).map(
      (c) => ({
        ...c,
        category: inferCategory(c.title, []),
        level: inferLevel(c.title),
        tags: [],
      })
    );
  }

  let localCursor = 0;
  function localSearch(
    query: string,
    pageSize = 12
  ): CourseSearchResult {
    const all = formatLocalCourses();
    const q = query.toLowerCase().trim();
    const filtered = q
      ? all.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.channelTitle.toLowerCase().includes(q)
        )
      : all;
    const page = filtered.slice(localCursor, localCursor + pageSize);
    localCursor += page.length;
    const hasMore = localCursor < filtered.length;
    return {
      courses: page,
      nextPageToken: hasMore ? `local-${localCursor}` : undefined,
      totalResults: filtered.length,
    };
  }

  function localByCategory(category: Category): CourseSearchResult {
    const all = formatLocalCourses();
    const filtered = all.filter((c) => c.category === category);
    return {
      courses: filtered,
      totalResults: filtered.length,
    };
  }

  function localTrending(): CourseSearchResult {
    const all = formatLocalCourses().sort(
      (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
    );
    return { courses: all.slice(0, 12), totalResults: all.length };
  }

  function localDetails(videoId: string): Course | null {
    return formatLocalCourses().find((c) => c.videoId === videoId) ?? null;
  }

  export async function searchCourses(
    query: string,  
    pageToken?: string
  ): Promise<CourseSearchResult> {
    console.log("API_KEY =", API_KEY);
    if (!API_KEY) return localSearch(query);
    try {
      const url = new URL(`${BASE_URL}/search`);
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('maxResults', '12');
      url.searchParams.set('q', `${query} programming tutorial`);
      url.searchParams.set('key', API_KEY);
      if (pageToken) url.searchParams.set('pageToken', pageToken);

      const res = await fetch(url, { next: { revalidate: 3600 } });


      if (!res.ok) throw new Error(`YouTube search failed: ${res.status}`);

      const data = await res.json();
      console.log("Request URL:", url.toString());
      console.log("YouTube Response:", data);
      const videoIds = data.items
        .map((i: { id?: { videoId?: string } }) => i.id?.videoId)
        .filter(Boolean) as string[];
      const details = await getVideoDetails(videoIds);

      const courses: Course[] = data.items
        .map((item: any) => {
          const videoId = item.id?.videoId;
          const detail = details.find((d) => d.videoId === videoId);
          const title = item.snippet?.title ?? '';
          return {
            id: videoId,
            videoId,
            title,
            description: item.snippet?.description ?? '',
            thumbnail:
              item.snippet?.thumbnails?.high?.url ??
              item.snippet?.thumbnails?.default?.url ??
              '',
            channelTitle: item.snippet?.channelTitle ?? '',
            channelId: item.snippet?.channelId ?? '',
            publishedAt: item.snippet?.publishedAt ?? '',
            duration: detail?.duration,
            viewCount: detail?.viewCount,
            likeCount: detail?.likeCount,
            category: inferCategory(title, []),
            tags: [],
            level: inferLevel(title),
          } as Course;
        })
        .filter((c: Course) => c.videoId);

      return {
        courses,
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo?.totalResults ?? courses.length,
      };
    } catch (err) {
      console.warn('[youtube] searchCourses falling back to local data:', err);
      return localSearch(query);
    }
  }

  async function getVideoDetails(
    videoIds: string[]
  ): Promise<Course[]> {
    if (!videoIds.length || !API_KEY) return [];
    try {
      const url = new URL(`${BASE_URL}/videos`);
      url.searchParams.set('part', 'snippet,statistics,contentDetails');
      url.searchParams.set('id', videoIds.join(','));
      url.searchParams.set('key', API_KEY);
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`YouTube videos failed: ${res.status}`);
      const data = await res.json();
      return data.items.map((item: any) => ({
        videoId: item.id,
        duration: parseDuration(item.contentDetails?.duration),
        viewCount: Number(item.statistics?.viewCount ?? 0),
        likeCount: Number(item.statistics?.likeCount ?? 0),
      })) as Course[];
    } catch (err) {
      console.warn('[youtube] getVideoDetails failed:', err);
      return [];
    }
  }

  export async function getCourseDetails(
    videoId: string
  ): Promise<Course | null> {
    if (!API_KEY) return localDetails(videoId);
    try {
      const url = new URL(`${BASE_URL}/videos`);
      url.searchParams.set('part', 'snippet,statistics,contentDetails');
      url.searchParams.set('id', videoId);
      url.searchParams.set('key', API_KEY);
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`YouTube videos failed: ${res.status}`);
      const data = await res.json();
      const item = data.items?.[0];
      if (!item) return null;
      const title = item.snippet?.title ?? '';
      return {
        id: item.id,
        videoId: item.id,
        title,
        description: item.snippet?.description ?? '',
        thumbnail:
          item.snippet?.thumbnails?.maxres?.url ??
          item.snippet?.thumbnails?.high?.url ??
          '',
        channelTitle: item.snippet?.channelTitle ?? '',
        channelId: item.snippet?.channelId ?? '',
        publishedAt: item.snippet?.publishedAt ?? '',
        duration: parseDuration(item.contentDetails?.duration),
        viewCount: Number(item.statistics?.viewCount ?? 0),
        likeCount: Number(item.statistics?.likeCount ?? 0),
        category: inferCategory(title, []),
        tags: item.snippet?.tags ?? [],
        level: inferLevel(title),
      };
    } catch (err) {
      console.warn('[youtube] getCourseDetails falling back:', err);
      return localDetails(videoId);
    }
  }

  export async function getTrendingCourses(): Promise<CourseSearchResult> {
    if (!API_KEY) return localTrending();
    try {
      const url = new URL(`${BASE_URL}/videos`);
      url.searchParams.set('part', 'snippet,statistics,contentDetails');
      url.searchParams.set('chart', 'mostPopular');
      url.searchParams.set('videoCategoryId', '28'); // Science & Technology
      url.searchParams.set('maxResults', '12');
      url.searchParams.set('key', API_KEY);
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`YouTube trending failed: ${res.status}`);
      const data = await res.json();
      const courses: Course[] = data.items.map((item: any) => {
        const title = item.snippet?.title ?? '';
        return {
          id: item.id,
          videoId: item.id,
          title,
          description: item.snippet?.description ?? '',
          thumbnail:
            item.snippet?.thumbnails?.maxres?.url ??
            item.snippet?.thumbnails?.high?.url ??
            '',
          channelTitle: item.snippet?.channelTitle ?? '',
          channelId: item.snippet?.channelId ?? '',
          publishedAt: item.snippet?.publishedAt ?? '',
          duration: parseDuration(item.contentDetails?.duration),
          viewCount: Number(item.statistics?.viewCount ?? 0),
          likeCount: Number(item.statistics?.likeCount ?? 0),
          category: inferCategory(title, []),
          tags: item.snippet?.tags ?? [],
          level: inferLevel(title),
        } as Course;
      });
      return { courses, totalResults: courses.length };
    } catch (err) {
      console.warn('[youtube] getTrendingCourses falling back:', err);
      return localTrending();
    }
  }

  export async function getCoursesByCategory(
    category: Category
  ): Promise<CourseSearchResult> {
    if (!API_KEY) return localByCategory(category);
    try {
      const keyword = CATEGORY_KEYWORDS[category];
      const url = new URL(`${BASE_URL}/search`);
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('maxResults', '12');
      url.searchParams.set('q', keyword);
      url.searchParams.set('key', API_KEY);
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`YouTube category failed: ${res.status}`);
      const data = await res.json();
      const videoIds = data.items
        .map((i: { id?: { videoId?: string } }) => i.id?.videoId)
        .filter(Boolean) as string[];
      const details = await getVideoDetails(videoIds);
      const courses: Course[] = data.items
        .map((item: any) => {
          const videoId = item.id?.videoId;
          const detail = details.find((d) => d.videoId === videoId);
          const title = item.snippet?.title ?? '';
          return {
            id: videoId,
            videoId,
            title,
            description: item.snippet?.description ?? '',
            thumbnail:
              item.snippet?.thumbnails?.high?.url ??
              item.snippet?.thumbnails?.default?.url ??
              '',
            channelTitle: item.snippet?.channelTitle ?? '',
            channelId: item.snippet?.channelId ?? '',
            publishedAt: item.snippet?.publishedAt ?? '',
            duration: detail?.duration,
            viewCount: detail?.viewCount,
            likeCount: detail?.likeCount,
            category,
            tags: [],
            level: inferLevel(title),
          } as Course;
        })
        .filter((c: Course) => c.videoId);
      return { courses, totalResults: courses.length };
    } catch (err) {
      console.warn('[youtube] getCoursesByCategory falling back:', err);
      return localByCategory(category);
    }
  }

  export function resetLocalCursor() {
    localCursor = 0;
  }
