// src/pages/SignUpPage.tsx
/**
 * 회원가입 페이지
 *
 * Day 1 요구사항: AUTH-001
 * Day 1 사용자 스토리: US-001 (회원가입)
 * Day 1 기능명세서: FUNC-001 (회원가입)
 *
 * 인수 조건:
 * - 이메일과 비밀번호 입력 폼이 있다
 * - 비밀번호는 6자 이상이어야 한다
 * - 가입 완료 시 자동으로 로그인된다
 * - 이미 가입된 이메일로는 가입할 수 없다
 */
import LinkButton from '@/components/LinkButton';
import { getAuthErrorMessage, signUp } from '@/lib/auth';
import { type SyntheticEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPage() {
  // 폼 입력값 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /**
   * 폼 제출 핸들러
   *
   * Day 1 기능명세서 FUNC-001 기본 흐름:
   * 1. 사용자가 이메일을 입력한다
   * 2. 사용자가 비밀번호를 입력한다
   * 3. 사용자가 비밀번호 확인을 입력한다
   * 4. 사용자가 "가입하기" 버튼을 클릭한다
   * 5. 시스템이 입력값 유효성을 검사한다
   * 6. 시스템이 Firebase에 계정을 생성한다
   * 7. 시스템이 사용자를 메인 페이지로 이동시킨다
   */

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 에러 초기화
    setError(null);

    // 유효성 검사 (Day 1 기능명세서 입력 데이터 참고)
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // Firebase에 계정 생성
      await signUp(email, password);

      // 메인 페이지로 이동 (Day 1 기능명세서 7번)
      navigate('/');
    } catch (err: unknown) {
      // 에러 처리 (Day 1 기능명세서 예외 흐름)
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        setError(getAuthErrorMessage(firebaseError.code));
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <LinkButton to="/" className="text-3xl font-bold text-gray-900">
            📝 My Dev Blog
          </LinkButton>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-gray-600">
            계정을 만들어 블로그를 시작하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 에러 메시지 */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상 입력하세요"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 비밀번호 확인 입력 */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? '가입 중...' : '가입하기'}
          </button>

          {/* 로그인 링크 */}
          <p className="text-center text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
