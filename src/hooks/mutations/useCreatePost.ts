// src/hooks/mutations/useCreatePost.ts
/**
 * 게시글 작성 뮤테이션
 *
 * Day 1 요구사항: POST-001
 */
import { queryKeys } from '@/hooks/queries/keys';
import { createPost } from '@/lib/posts';
import type { PostInput, User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePostVariables {
  input: PostInput;
  user: User;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    // 뮤테이션 함수
    mutationFn: ({ input, user }: CreatePostVariables) =>
      createPost(input, user),

    // 성공 시 게시글 목록 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      });
    },
  });
}
