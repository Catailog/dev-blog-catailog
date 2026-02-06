/**
 * 게시글 상세 페이지
 *
 * Day 1 요구사항: POST-003, POST-004, POST-005
 * Day 1 사용자 스토리: US-005 (내 글 수정), US-006 (내 글 삭제)
 * Day 1 컴포넌트 구조도: PostDetailPage > PostHeader, PostContent
 */
import LinkButton from '@/components/LinkButton';
import { useDeletePost } from '@/hooks/mutations';
import { usePost } from '@/hooks/queries';
import { useAuthStore } from '@/store/authStore';
import { CATEGORY_LABELS } from '@/types';
import { Link, useNavigate, useParams } from 'react-router-dom';

function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // TanStack Query로 게시글 조회
  const { data: post, isLoading, error } = usePost(id);

  // 삭제 뮤테이션
  const deletePostMutation = useDeletePost();

  /**
   * 게시글 삭제 핸들러
   */
  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    deletePostMutation.mutate(id, {
      onSuccess: () => {
        navigate('/');
      },
      onError: () => {
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (timestamp: { toDate: () => Date }) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * 작성자 본인 여부 확인
   *
   * Day 1 사용자 스토리 US-005, US-006:
   * - 내가 쓴 글에만 수정/삭제 버튼이 보인다
   */
  const isAuthor = user && post && user.uid === post.authorId;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="animate-pulse rounded-lg bg-white p-8 shadow">
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-8 h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="mb-4 text-lg text-gray-500">
            {error?.message || '게시글을 찾을 수 없습니다.'}
          </p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <article className="rounded-lg bg-white shadow transition-shadow hover:shadow-md dark:bg-gray-500">
        {/* 게시글 헤더 */}
        <header className="border-b p-6">
          {/* 카테고리 */}
          {post.category && (
            <span className="mb-3 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {CATEGORY_LABELS[post.category]}
            </span>
          )}

          {/* 제목 */}
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-200">
              <span>
                {post.authorDisplayName || post.authorEmail.split('@')[0]}
              </span>
              <span className="mx-2">·</span>
              <span>{formatDate(post.createdAt)}</span>
              {/* 수정됨 표시 */}
              {post.updatedAt.toMillis() !== post.createdAt.toMillis() && (
                <span className="ml-2 text-gray-400">(수정됨)</span>
              )}
            </div>

            {/* 수정/삭제 버튼 (작성자만 표시) */}
            {isAuthor && (
              <div className="flex gap-2">
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="rounded border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deletePostMutation.isPending}
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:text-white"
                >
                  {deletePostMutation.isPending ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 게시글 본문 */}
        <div className="p-6">
          <div className="prose max-w-none">
            {/* 줄바꿈 유지하여 표시 */}
            {post.content.split('\n').map((line, index) => (
              <p key={index} className="mb-4">
                {line || <br />}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* 목록으로 돌아가기 */}
      <div className="mt-6">
        <LinkButton to="/" className="text-gray-600">
          ← 목록으로
        </LinkButton>
      </div>
    </div>
  );
}

export default PostDetailPage;
