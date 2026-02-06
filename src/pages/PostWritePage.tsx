/**
 * 글쓰기 페이지
 *
 * Day 1 요구사항: POST-001
 * "로그인한 사용자는 새 게시글을 작성할 수 있다"
 *
 * Day 1 사용자 스토리: US-003 (게시글 작성)
 */
import PostForm from '@/components/PostForm';
import { useCreatePost } from '@/hooks/mutations';
import { useAuthStore } from '@/store/authStore';
import type { PostInput } from '@/types';
import { useNavigate } from 'react-router-dom';

function PostWritePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // 생성 뮤테이션
  const createPostMutation = useCreatePost();

  /**
   * 게시글 작성 핸들러
   */
  const handleSubmit = async (data: PostInput) => {
    if (!user) return;

    createPostMutation.mutate(
      { input: data, user },
      {
        onSuccess: (postId) => {
          navigate(`/posts/${postId}`);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">새 글 작성</h1>

      <div className="rounded-lg bg-white p-6 text-gray-900 shadow dark:bg-gray-500 dark:text-gray-200">
        <PostForm
          onSubmit={handleSubmit}
          isLoading={createPostMutation.isPending}
        />
      </div>
    </div>
  );
}

export default PostWritePage;
