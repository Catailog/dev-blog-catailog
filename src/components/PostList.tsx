/**
 * 게시글 목록 컴포넌트
 *
 * Day 1 컴포넌트 구조도: HomePage > PostList
 * Day 1 기능명세서 FUNC-003 (게시글 목록 조회)
 */
import PostCard from '@/components/PostCard';
import type { PostSummary } from '@/types';

interface PostListProps {
  posts: PostSummary[];
  isLoading?: boolean;
}

function PostList({ posts, isLoading = false }: PostListProps) {
  // 로딩 상태 (Day 1 기능명세서: 로딩 중 스켈레톤 UI 표시)
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  // 빈 목록 (Day 1 기능명세서: 게시글 없음 표시)
  if (posts.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-500 dark:text-gray-200">
        <p className="text-lg text-gray-500 dark:text-gray-100">
          아직 작성된 글이 없습니다.
        </p>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
          첫 번째 글을 작성해보세요!
        </p>
      </div>
    );
  }

  // 게시글 목록
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
