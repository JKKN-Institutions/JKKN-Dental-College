// Server Component Wrapper for College News
import { getActiveCollegeNews } from '@/app/admin/content/sections/[id]/edit/_actions/college-news-actions';
import CollegeNewsClient from './CollegeNewsClient';

export default async function CollegeNews() {
  // Fetch data on the server
  const result = await getActiveCollegeNews();
  const newsItems = result.success && result.data ? result.data : [];

  // Pass data to client component
  return <CollegeNewsClient newsItems={newsItems} />;
}
