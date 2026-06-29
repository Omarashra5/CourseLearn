import { getCourseDetails } from '@/lib/youtube';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CourseDetailClient } from './course-detail-client';

interface PageProps {
  params: { videoId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getCourseDetails(params.videoId);
  if (!course) return { title: 'Course Not Found' };
  return {
    title: course.title,
    description: course.description.slice(0, 160),
    openGraph: {
      title: course.title,
      description: course.description.slice(0, 160),
      images: [{ url: course.thumbnail }],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const course = await getCourseDetails(params.videoId);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
