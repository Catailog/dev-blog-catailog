// src/components/Header.tsx
/**
 * 헤더 컴포넌트
 *
 * props 대신 Zustand 스토어에서 직접 user 정보를 가져옵니다.
 * 이제 어디서든 useAuthStore()로 인증 상태에 접근할 수 있습니다!
 */
import Button from '@/components/Button';
import LinkButton from '@/components/LinkButton';
import { logout } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  // Zustand 스토어에서 user 가져오기
  const user = useAuthStore((state) => state.user);

  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm transition-colors dark:bg-gray-700 dark:shadow-gray-500">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex h-16 items-center justify-between">
          <LinkButton to="/" className="text-xl font-bold">
            📝 My Dev Blog
          </LinkButton>

          {/* 네비게이션 & 인증 버튼 */}
          <div className="flex items-center gap-4">
            {user ? (
              // 로그인 상태
              <>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {user.displayName || user.email}
                </span>
                <Button onClick={handleLogout} className="px-4 py-2 text-sm">
                  로그아웃
                </Button>
              </>
            ) : (
              // 비로그인 상태
              <>
                <LinkButton to="/login" className="px-4 py-2 text-sm">
                  로그인
                </LinkButton>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  회원가입
                </Link>
              </>
            )}

            {/* 테마 버튼 */}
            <Button onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
