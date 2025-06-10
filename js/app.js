/**
 * Weekly Quest App
 * 메인 애플리케이션 JavaScript 파일
 */

// 모듈 가져오기
import { initNavigation } from './navigation.js';
import { initInteractions } from './interactions.js';
import { initServiceWorker } from './service-worker-reg.js';

/**
 * 앱 초기화 함수
 */
function initApp() {
  // DOM이 로드된 후 실행
  document.addEventListener('DOMContentLoaded', () => {
    // 내비게이션 초기화
    initNavigation();
    
    // 상호작용 초기화 (북마크, 좋아요 등)
    initInteractions();
    
    // 서비스 워커 등록 (PWA 지원)
    initServiceWorker();
    
    // 접근성 개선을 위한 키보드 내비게이션 초기화
    initKeyboardNavigation();
    
    // 앱 시작 시 홈 화면 표시
    navigateToScreen('home');
    
    // 다크 모드 감지 및 적용
    initDarkModeDetection();
  });
}

/**
 * 키보드 내비게이션 초기화
 */
function initKeyboardNavigation() {
  // 탭 키 내비게이션 개선
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // 포커스된 요소에 시각적 표시
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // 마우스 사용 시 키보드 내비게이션 스타일 제거
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

/**
 * 다크 모드 감지 및 적용
 */
function initDarkModeDetection() {
  // 시스템 다크 모드 감지
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // 다크 모드 변경 시 이벤트 처리
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  });
  
  // 초기 다크 모드 상태 적용
  if (darkModeMediaQuery.matches) {
    document.documentElement.classList.add('dark-mode');
  }
}

// 앱 초기화
initApp();

// 전역 함수 내보내기
export function navigateToScreen(screenName) {
  const event = new CustomEvent('navigate', { detail: { screen: screenName } });
  document.dispatchEvent(event);
}
