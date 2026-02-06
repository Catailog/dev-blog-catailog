// src/hooks/usePost.ts
/**
 * 게시글 상세 조회 훅
 *
 * Day 1 요구사항: POST-003
 */
import { queryKeys } from '@/hooks/queries/keys';
import { getPost } from '@/lib/posts';
import { useQuery } from '@tanstack/react-query';

export function usePost(postId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId || ''),
    queryFn: () => {
      if (!postId) throw new Error('Post ID is required');
      return getPost(postId);
    },
    // postId가 있을 때만 쿼리 실행
    enabled: !!postId,
  });
}
