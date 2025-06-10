/**
 * 내비게이션 관련 기능을 담당하는 모듈
 */

// 화면 전환을 위한 상태 관리
let currentScreen = 'home';

/**
 * 내비게이션 초기화 함수
 */
export function initNavigation() {
  const mainContent = document.querySelector('main');
  const navItems = document.querySelectorAll('.nav-item');
  const screens = {
    home: document.getElementById('screen-home'),
    recipes: document.getElementById('screen-recipes'),
    community: document.getElementById('screen-community'),
    mypage: document.getElementById('screen-mypage'),
  };

  // 내비게이션 아이템 클릭 이벤트 처리
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const screenName = item.dataset.screen;
      switchScreen(screenName);
    });
    
    // 접근성 개선: ARIA 속성 추가
    item.setAttribute('role', 'tab');
    item.setAttribute('aria-selected', item.classList.contains('active') ? 'true' : 'false');
    item.setAttribute('tabindex', item.classList.contains('active') ? '0' : '-1');
  });
  
  // 커스텀 내비게이션 이벤트 리스너
  document.addEventListener('navigate', (e) => {
    switchScreen(e.detail.screen);
  });

  /**
   * 화면 전환 함수
   * @param {string} screenName - 전환할 화면 이름
   */
  function switchScreen(screenName) {
    // 이전 화면과 같으면 아무 작업도 하지 않음
    if (currentScreen === screenName) return;
    
    // 현재 화면 저장
    currentScreen = screenName;
    
    // 스크롤 위치 초기화
    mainContent.scrollTop = 0;
    
    // 모든 화면 숨기기
    Object.values(screens).forEach(screen => {
      if(screen) {
        screen.classList.add('hidden');
        screen.setAttribute('aria-hidden', 'true');
      }
    });
    
    // 선택된 화면 표시
    if (screens[screenName]) {
      screens[screenName].classList.remove('hidden');
      screens[screenName].setAttribute('aria-hidden', 'false');
      
      // 화면 전환 시 포커스 이동 (접근성 개선)
      const firstFocusableElement = screens[screenName].querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
    
    // 내비게이션 아이템 활성화 상태 업데이트
    navItems.forEach(item => {
      const isActive = item.dataset.screen === screenName;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      item.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    
    // 마이페이지 화면일 경우 특별한 애니메이션 처리
    if (screenName === 'mypage') {
      const xpBar = document.getElementById('xp-bar');
      if(xpBar) {
        setTimeout(() => { xpBar.style.width = '80%'; }, 100);
      }
    } else {
      const xpBar = document.getElementById('xp-bar');
      if(xpBar) xpBar.style.width = '20%';
    }
    
    // 화면 전환 이벤트 발생 (분석 등을 위해)
    dispatchScreenChangeEvent(screenName);
  }
  
  /**
   * 화면 전환 이벤트 발생 함수
   * @param {string} screenName - 전환된 화면 이름
   */
  function dispatchScreenChangeEvent(screenName) {
    const event = new CustomEvent('screenChanged', { 
      detail: { 
        screen: screenName,
        timestamp: new Date().getTime()
      } 
    });
    document.dispatchEvent(event);
  }
}
