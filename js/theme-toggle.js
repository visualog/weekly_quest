/**
 * 다크 모드 토글 기능 구현
 * Tailwind CSS 다크 모드 문서 참조: https://tailwindcss.com/docs/dark-mode
 */

// 문서 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', () => {
  console.log('테마 토글 스크립트 초기화');
  
  // 테마 토글 버튼 찾기
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  if (themeToggleBtn) {
    console.log('테마 토글 버튼 찾음');
    
    // 초기 버튼 상태 설정
    updateThemeToggleIcon();
    
    // 클릭 이벤트 리스너 설정
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('테마 토글 버튼 클릭됨');
      toggleTheme();
    });
  } else {
    console.error('테마 토글 버튼을 찾을 수 없습니다.');
  }
  
  // 시스템 테마 변경 감지
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    console.log('시스템 테마 변경 감지:', e.matches ? '다크' : '라이트');
    
    // 사용자가 직접 설정한 경우는 자동 변경 안함
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
      updateThemeToggleIcon();
    }
  });
});

/**
 * 테마 토글 함수
 */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  // 다크 모드 토글
  html.classList.toggle('dark');
  
  // 로컬 스토리지에 설정 저장
  const newIsDark = html.classList.contains('dark');
  localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  
  // 버튼 아이콘 업데이트
  updateThemeToggleIcon();
  
  // 토스트 메시지 표시
  showThemeChangeToast(newIsDark);
  
  console.log('테마 변경됨:', newIsDark ? '다크 모드' : '라이트 모드');
}

/**
 * 테마 토글 버튼 아이콘 업데이트
 */
function updateThemeToggleIcon() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;
  
  const isDark = document.documentElement.classList.contains('dark');
  
  // 버튼 아이콘 업데이트
  if (isDark) {
    // 해 아이콘 (Light mode icon)
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    `;
    themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
  } else {
    // 달 아이콘 (Dark mode icon)
    themeToggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    `;
    themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
  }
}

/**
 * 테마 변경 토스트 메시지 표시
 */
function showThemeChangeToast(isDark) {
  try {
    const message = isDark ? '다크 모드로 전환되었습니다.' : '라이트 모드로 전환되었습니다.';
    
    // 전역 showToast 함수가 있으면 사용
    if (typeof window.showToast === 'function') {
      window.showToast(message, 'info');
    } else {
      console.log('토스트 메시지:', message);
    }
  } catch (error) {
    console.error('토스트 표시 오류:', error);
  }
}
