// src/components/FirebaseStatus.tsx
/**
 * Firebase 연동 상태 확인 컴포넌트
 *
 * Firebase가 제대로 초기화되었는지 확인합니다.
 * 개발 중에만 사용하고, 배포 시에는 제거하거나 숨깁니다.
 */
import StatusItem from '@/components/StatusItem';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface ConnectionStatus {
  firebase: boolean;
  auth: boolean;
  firestore: boolean;
}

function FirebaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    firebase: false,
    auth: false,
    firestore: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Firebase App 확인 (객체 존재 여부)
        const firebaseOk = auth.app !== null;

        // Auth 서비스 확인 (객체 존재 여부)
        const authOk = auth !== null;

        // Firestore 실제 연결 확인 - 서버에 쿼리 시도
        let firestoreOk = false;
        try {
          await getDocs(query(collection(db, 'posts'), limit(1)));
          firestoreOk = true;
        } catch (e) {
          // 권한 오류(permission-denied)는 "연결은 됨"으로 간주
          if (e instanceof Error && e.message.includes('permission')) {
            firestoreOk = true;
          }
        }

        setStatus({
          firebase: firebaseOk,
          auth: authOk,
          firestore: firestoreOk,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    checkConnection();
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 className="mb-2 font-semibold text-red-800">
          ❌ Firebase 연결 오류
        </h3>
        <p className="text-sm text-red-600">{error}</p>
        <p className="mt-2 text-xs text-red-500">
          .env 파일의 Firebase 설정을 확인해주세요.
        </p>
      </div>
    );
  }

  const allConnected = status.firebase && status.auth && status.firestore;

  return (
    <div
      className={`rounded-lg border p-4 ${
        allConnected
          ? 'border-green-200 bg-green-50'
          : 'border-yellow-200 bg-yellow-50'
      }`}
    >
      <h3
        className={`mb-3 font-semibold ${
          allConnected ? 'text-green-800' : 'text-yellow-800'
        }`}
      >
        {allConnected
          ? '✅ Firebase 연동 완료!'
          : '⏳ Firebase 연동 확인 중...'}
      </h3>

      <div className="space-y-2">
        <StatusItem label="Firebase App" isConnected={status.firebase} />
        <StatusItem label="Authentication" isConnected={status.auth} />
        <StatusItem label="Firestore" isConnected={status.firestore} />
      </div>

      {allConnected && (
        <p className="mt-3 text-xs text-green-600">
          모든 Firebase 서비스가 정상적으로 연결되었습니다.
        </p>
      )}

      {/* 환경 변수 확인 (개발용) */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-gray-500">
          환경 변수 확인 (개발용)
        </summary>
        <div className="mt-2 rounded bg-gray-100 p-2 font-mono text-xs">
          <p>
            Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || '(없음)'}
          </p>
          <p>
            Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '(없음)'}
          </p>
        </div>
      </details>
    </div>
  );
}

export default FirebaseStatus;
