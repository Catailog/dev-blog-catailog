// src/hooks/mutations/useDeletePost.ts
/**
 * 게시글 삭제 뮤테이션
 *
 * Day 1 요구사항: POST-005
 */
import { queryKeys } from '@/hooks/queries/keys';
import { deletePost } from '@/lib/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),

    // 성공 시 목록 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
    },
  });
}
