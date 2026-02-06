/**
 * 게시글 작성/수정 폼 컴포넌트
 *
 * Day 1 컴포넌트 구조도: PostWritePage > PostForm
 * Day 1 기능명세서: FUNC-002 (게시글 작성)
 *
 * 재사용 가능한 폼:
 * - 새 글 작성 시: initialData 없음
 * - 글 수정 시: initialData 있음
 */
import type { Category, PostInput } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { useState } from 'react';

interface PostFormProps {
  /** 수정 시 기존 데이터 */
  initialData?: PostInput;
  /** 제출 핸들러 */
  onSubmit: (data: PostInput) => Promise<void>;
  /** 제출 버튼 텍스트 */
  submitLabel?: string;
  /** 로딩 상태 */
  isLoading?: boolean;
}

function PostForm({
  initialData,
  onSubmit,
  submitLabel = '발행하기',
  isLoading = false,
}: PostFormProps) {
  // 폼 상태
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<Category | null>(
    initialData?.category || null,
  );
  const [error, setError] = useState<string | null>(null);

  /**
   * 폼 제출 핸들러
   *
   * Day 1 기능명세서 FUNC-002 기본 흐름:
   * 5. 시스템이 입력값 유효성을 검사한다
   * 6. 시스템이 Firestore에 게시글을 저장한다
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사 (Day 1 기능명세서 입력 데이터 참고)
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (title.length > 100) {
      setError('제목은 100자 이내로 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
      });
    } catch (err) {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
      console.error('PostForm handleSubmit error:', err);
    }
  };

  // 카테고리 목록 (Day 1 데이터 모델 참고)
  const categories: Category[] = [
    'javascript',
    'typescript',
    'react',
    'firebase',
    'etc',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 제목 입력 */}
      <div className="text-gray-700 dark:text-white">
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
          maxLength={100}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-right text-xs">{title.length}/100</p>
      </div>

      {/* 카테고리 선택 */}
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          카테고리 (선택)
        </label>
        <select
          id="category"
          value={category || ''}
          onChange={(e) =>
            setCategory(e.target.value ? (e.target.value as Category) : null)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" className="dark:bg-gray-700">
            카테고리 선택
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="dark:bg-gray-700">
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* 내용 입력 */}
      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="게시글 내용을 입력하세요"
          rows={15}
          className="min-h-75 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
