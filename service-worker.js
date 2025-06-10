/**
 * Weekly Quest App Service Worker
 * 오프라인 기능 및 캐싱을 위한 서비스 워커
 */

// 캐시 이름 설정 (버전 관리를 위해 v1 추가)
const CACHE_NAME = 'weekly-quest-cache-v1';

// 캐싱할 파일 목록
const CACHE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/styles.css',
  'js/app.js',
  'js/navigation.js',
  'js/interactions.js',
  'js/service-worker-reg.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-512x512.png'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('서비스 워커 설치 중...');
  
  // 캐시 설치 및 파일 추가
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('파일을 캐시에 추가하는 중...');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        // 대기 중인 서비스 워커를 즉시 활성화
        return self.skipWaiting();
      })
  );
});

// 서비스 워커 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('서비스 워커 활성화 중...');
  
  // 이전 버전의 캐시 정리
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시 삭제 중:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 활성화된 서비스 워커가 모든 클라이언트를 제어하도록 설정
      return self.clients.claim();
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  // 네비게이션 요청 처리 (HTML 페이지)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 오프라인 상태일 때 캐시된 인덱스 페이지 제공
          return caches.match('index.html');
        })
    );
    return;
  }
  
  // 일반 리소스 요청 처리 (CSS, JS, 이미지 등)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에서 찾았으면 캐시된 응답 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크 요청 시도
        return fetch(event.request)
          .then((networkResponse) => {
            // 유효한 응답이 아니면 그냥 반환
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // 응답을 복제하여 캐시에 저장 (스트림은 한 번만 사용 가능)
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('네트워크 요청 실패:', error);
            
            // 이미지 요청이면 기본 이미지 제공
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('assets/images/offline-image.png');
            }
            
            // 기타 요청은 오프라인 페이지 제공
            return caches.match('offline.html');
          });
      })
  );
});

// 푸시 알림 이벤트
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const notificationData = event.data.json();
  const options = {
    body: notificationData.body,
    icon: 'assets/icons/icon-192x192.png',
    badge: 'assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // 이미 열린 창이 있으면 포커스
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 열린 창이 없으면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
