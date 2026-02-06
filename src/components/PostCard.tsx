/**
 * 게시글 카드 컴포넌트
 *
 * Day 1 컴포넌트 구조도: HomePage > PostList > PostCard
 * Day 1 기능명세서 FUNC-003 표시 데이터 참고
 */
import type { PostSummary } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: PostSummary;
}

function PostCard({ post }: PostCardProps) {
  /**
   * 날짜 포맷팅 - 이후 utils 폴더에 따로 구성
   *
   * Day 1 기능명세서: 작성일 YYYY.MM.DD 형식
   */
  const formatDate = (timestamp: { toDate: () => Date }) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  /**
   * 작성자 표시
   *
   * Day 1 기능명세서: 작성자 이메일 @ 앞부분
   */
  const getAuthorName = () => {
    if (post.authorDisplayName) {
      return post.authorDisplayName;
    }
    return post.authorEmail.split('@')[0];
  };

  return (
    <article className="rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-500">
      <Link to={`/posts/${post.id}`} className="block p-6">
        {/* 카테고리 태그 */}
        {post.category && (
          <span className="mb-3 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            {CATEGORY_LABELS[post.category]}
          </span>
        )}

        {/* 제목 (Day 1: 최대 50자, 초과 시 "..." 처리) */}
        <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
          {post.title}
        </h2>

        {/* 메타 정보 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-200">
          <span>{getAuthorName()}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
