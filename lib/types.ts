export type Category =
  | 'Web Development'
  | 'Mobile Development'
  | 'Data Science'
  | 'Machine Learning'
  | 'DevOps'
  | 'Game Development'
  | 'Backend'
  | 'Frontend'
  | 'Algorithms'
  | 'Security';

export interface Course {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  channelAvatar?: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
  subscriberCount?: number;
  category: Category;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CourseSearchResult {
  courses: Course[];
  nextPageToken?: string;
  totalResults: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export type SortOption =
  | 'relevance'
  | 'newest'
  | 'popular'
  | 'rating'
  | 'views';

export type FilterLevel = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
