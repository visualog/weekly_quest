/**
 * 테마 전환 기능 구현
 * Tailwind CSS 다크 모드 문서 참조: https://tailwindcss.com/docs/dark-mode
 */

// 시스템 다크 모드 감지 기능
const systemDarkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * 현재 테마 상태 확인 함수
 * @returns {boolean} 다크 모드 상태 여부
 */
function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

/**
 * 테마 토글 버튼 아이콘 업데이트 함수
 */
function updateThemeToggleButton() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) {
    console.error('테마 토글 버튼을 찾을 수 없습니다.');
    return;
  }
  
  const isDark = isDarkMode();
  
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
 * 테마 전환 함수
 * @param {string} theme 'dark', 'light', 또는 'system'
 */
function setTheme(theme) {
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else if (theme === 'system') {
    localStorage.removeItem('theme');
    const systemIsDark = systemDarkModeMediaQuery.matches;
    html.classList.toggle('dark', systemIsDark);
  }
  
  // 버튼 아이콘 업데이트
  updateThemeToggleButton();
  
  // 현재 테마 상태 로깅
  console.log('현재 테마 상태:', isDarkMode() ? '다크 모드' : '라이트 모드');
}

/**
 * 테마 토글 함수 - 현재 테마의 반대로 전환
 */
function toggleTheme() {
  const isDark = isDarkMode();
  setTheme(isDark ? 'light' : 'dark');
  
  // 토스트 메시지 표시 시도
  try {
    const message = isDarkMode() ? '다크 모드로 전환되었습니다.' : '라이트 모드로 전환되었습니다.';
    if (typeof showToast === 'function') {
      showToast(message, 'info');
    } else {
      console.log('토스트 메시지:', message);
    }
  } catch (error) {
    console.error('토스트 표시 오류:', error);
  }
}

// 문서 로드 완료 시 실행될 코드
document.addEventListener('DOMContentLoaded', () => {
  console.log('테마 스위처 스크립트 초기화');
  
  // 테마 토글 버튼 이벤트 리스너 설정
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('테마 토글 버튼 클릭됨');
      toggleTheme();
    });
    
    // 초기 버튼 상태 설정
    updateThemeToggleButton();
    console.log('테마 토글 버튼 초기화 완료');
  } else {
    console.error('테마 토글 버튼을 찾을 수 없습니다.');
  }
  
  // 시스템 테마 변경 감지
  systemDarkModeMediaQuery.addEventListener('change', (e) => {
    const newColorScheme = e.matches ? 'dark' : 'light';
    console.log('시스템 테마 변경 감지:', newColorScheme);
    
    // 사용자가 직접 설정한 경우는 자동 변경 안함
    if (!localStorage.getItem('theme')) {
      setTheme('system');
    }
  });
});
  console.log('DOM 로드 완료 - 테마 전환 버튼 이벤트 설정');
  
  // 테마 전환 버튼 이벤트 리스너 설정
  const themeToggleBtn = document.getElementById('theme-toggle');
  console.log('테마 전환 버튼 찾기 (DOMContentLoaded 내부):', themeToggleBtn);
  
  if (themeToggleBtn) {
    // 클릭 이벤트 리스너
    themeToggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('테마 전환 버튼 클릭됨');
      
      // 다크 모드 토글
      const html = document.documentElement;
      html.classList.toggle('dark');
      
      // 로컬 스토리지에 설정 저장
      const isDark = html.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      console.log('현재 테마 상태:', isDark ? '다크 모드' : '라이트 모드');
      console.log('HTML 클래스:', html.className);
      
      // 버튼 아이콘 업데이트
      updateThemeToggleButton();
      
      // 토스트 메시지 표시 시도
      try {
        const message = isDark ? '다크 모드로 전환되었습니다.' : '라이트 모드로 전환되었습니다.';
        if (typeof showToast === 'function') {
          showToast(message, 'info');
        } else {
          console.log('토스트 메시지:', message);
        }
      } catch (error) {
        console.error('토스트 표시 오류:', error);
      }
    });
    
    console.log('테마 전환 버튼 이벤트 리스너 설정 완료');
  } else {
    console.error('테마 전환 버튼을 찾을 수 없습니다 (DOMContentLoaded 내부)');
  }
  
  // 시스템 테마 변경 감지
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? 'dark' : 'light';
    console.log('시스템 테마 변경 감지:', newColorScheme);
    
    // 사용자가 직접 설정한 경우는 자동 변경 안함
    if (!localStorage.getItem('theme')) {
      if (newColorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateThemeToggleButton();
    }
  });
}
  
  // 테마 토글 버튼 아이콘 업데이트 함수
  function updateThemeToggleButton() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    const isDark = document.documentElement.classList.contains('dark');
    
    // 버튼 아이콘 업데이트
    if (isDark) {
      themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>';
      themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
    } else {
      themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
      themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
    }
  }
  
  // 시스템 테마 변경 감지
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateThemeToggleButton();
    }
  });
});

// 토스트 메시지 표시 함수 (interactions.js에 이미 있다면 제거)
function showToast(message, type = 'info') {
  if (window.showToast) {
    window.showToast(message, type);
  }
}
