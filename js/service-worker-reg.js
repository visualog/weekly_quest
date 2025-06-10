/**
 * 서비스 워커 등록 모듈
 * PWA 기능을 위한 서비스 워커 등록을 담당합니다.
 */

/**
 * 서비스 워커 초기화 함수
 */
export function initServiceWorker() {
  // 서비스 워커가 지원되는 브라우저인지 확인
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  } else {
    console.log('이 브라우저에서는 서비스 워커와 PWA 기능이 지원되지 않습니다.');
  }
}

/**
 * 서비스 워커 등록 함수
 */
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('service-worker.js');
    console.log('서비스 워커가 성공적으로 등록되었습니다:', registration.scope);
    
    // 앱 설치 이벤트 리스너 등록
    initInstallPrompt();
  } catch (error) {
    console.error('서비스 워커 등록 중 오류가 발생했습니다:', error);
  }
}

/**
 * PWA 설치 프롬프트 초기화 함수
 */
function initInstallPrompt() {
  // 설치 이벤트를 저장할 변수
  let deferredPrompt;
  
  // beforeinstallprompt 이벤트 리스너 등록
  window.addEventListener('beforeinstallprompt', (e) => {
    // 기본 브라우저 설치 프롬프트 방지
    e.preventDefault();
    
    // 이벤트 저장
    deferredPrompt = e;
    
    // 설치 버튼 표시
    showInstallButton();
  });
  
  /**
   * 설치 버튼 표시 함수
   */
  function showInstallButton() {
    // 이미 설치 버튼이 있는지 확인
    if (document.getElementById('install-button')) return;
    
    // 설치 버튼 생성
    const installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.className = 'install-btn fixed bottom-4 left-4 bg-white text-primary-color px-4 py-2 rounded-full shadow-lg flex items-center z-50';
    installButton.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      앱 설치하기
    `;
    
    // 설치 버튼 클릭 이벤트 처리
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      // 설치 프롬프트 표시
      deferredPrompt.prompt();
      
      // 사용자 응답 대기
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`사용자 선택: ${outcome}`);
      
      // 설치 프롬프트는 한 번만 사용 가능
      deferredPrompt = null;
      
      // 설치 버튼 숨기기
      installButton.style.display = 'none';
    });
    
    // 설치 버튼을 body에 추가
    document.body.appendChild(installButton);
  }
  
  // appinstalled 이벤트 리스너 등록
  window.addEventListener('appinstalled', (e) => {
    console.log('앱이 성공적으로 설치되었습니다.');
    
    // 설치 버튼 숨기기
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
    
    // 설치 완료 토스트 메시지 표시
    showToast('앱이 성공적으로 설치되었습니다!');
  });
}

/**
 * 토스트 메시지 표시 함수
 * @param {string} message - 표시할 메시지
 * @param {number} duration - 표시 시간 (ms)
 */
function showToast(message, duration = 3000) {
  // 이미 토스트가 있는지 확인
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 토스트 요소 생성
  const toast = document.createElement('div');
  toast.className = 'toast-message fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50';
  toast.textContent = message;
  
  // 토스트 요소를 body에 추가
  document.body.appendChild(toast);
  
  // 지정된 시간 후 토스트 제거
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}
