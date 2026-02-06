/**
 * 게시글 수정 페이지
 *
 * Day 1 요구사항: POST-004
 * "작성자는 자신의 게시글을 수정할 수 있다"
 *
 * Day 1 사용자 스토리: US-005 (내 글 수정)
 */
import PostForm from '@/components/PostForm';
import { useUpdatePost } from '@/hooks/mutations';
import { usePost } from '@/hooks/queries';
import { useAuthStore } from '@/store/authStore';
import type { PostInput } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';

function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  // 기존 게시글 조회
  const { data: post, isLoading, error } = usePost(id);

  // 수정 뮤테이션
  const updatePostMutation = useUpdatePost();

  /**
   * 게시글 수정 핸들러
   */
  const handleSubmit = async (data: PostInput) => {
    if (!id) return;

    updatePostMutation.mutate(
      { postId: id, input: data },
      {
        onSuccess: () => {
          navigate(`/posts/${id}`);
        },
      },
    );
  };

  // 권한 체크
  const hasPermission = user && post && user.uid === post.authorId;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="animate-pulse rounded-lg bg-white p-6 shadow">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="mb-4 h-12 rounded bg-gray-200"></div>
          <div className="mb-4 h-12 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !post || !hasPermission) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="mb-4 text-red-600">
            {error ? '게시글을 찾을 수 없습니다.' : '수정 권한이 없습니다.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">글 수정</h1>

      <div className="rounded-lg bg-white p-6 shadow">
        <PostForm
          initialData={{
            title: post.title,
            content: post.content,
            category: post.category,
          }}
          onSubmit={handleSubmit}
          submitLabel="수정하기"
          isLoading={updatePostMutation.isPending}
        />
      </div>
    </div>
  );
}

export default PostEditPage;
