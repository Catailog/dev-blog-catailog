// src/layout/MainLayout.tsx
/**
 * 공통 레이아웃 컴포넌트
 *
 * props 대신 Zustand 스토어에서 직접 user 정보를 가져옵니다.
 */
import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-gray-700 dark:text-gray-200">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white transition-colors dark:bg-gray-700">
        <div className="mx-auto max-w-4xl px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-200">
          © 2025 My Dev Blog. Built with React + Firebase
        </div>
      </footer>
    </div>
  );
}

export default Layout;
