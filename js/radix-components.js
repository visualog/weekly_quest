/**
 * Radix UI 컴포넌트 통합 모듈
 */

// Radix UI 컴포넌트 초기화
export function initRadixComponents() {
  initTabs();
  initDialogs();
  initToasts();
  initDropdownMenus();
}

// Tabs 컴포넌트 초기화
function initTabs() {
  const tabsContainer = document.querySelector('[data-radix-tabs-root]');
  if (!tabsContainer) return;
  
  const tabTriggers = tabsContainer.querySelectorAll('[data-radix-tabs-trigger]');
  const tabContents = tabsContainer.querySelectorAll('[data-radix-tabs-content]');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const value = trigger.getAttribute('data-value');
      
      // 모든 트리거 비활성화
      tabTriggers.forEach(t => {
        t.setAttribute('data-state', 'inactive');
        t.setAttribute('aria-selected', 'false');
      });
      
      // 클릭된 트리거 활성화
      trigger.setAttribute('data-state', 'active');
      trigger.setAttribute('aria-selected', 'true');
      
      // 모든 콘텐츠 숨기기
      tabContents.forEach(content => {
        content.setAttribute('data-state', 'inactive');
        content.classList.add('hidden');
      });
      
      // 선택된 콘텐츠 표시
      const selectedContent = tabsContainer.querySelector(`[data-radix-tabs-content][data-value="${value}"]`);
      if (selectedContent) {
        selectedContent.setAttribute('data-state', 'active');
        selectedContent.classList.remove('hidden');
      }
    });
  });
}

// Dialog 컴포넌트 초기화
function initDialogs() {
  const dialogTriggers = document.querySelectorAll('[data-radix-dialog-trigger]');
  
  dialogTriggers.forEach(trigger => {
    const dialogId = trigger.getAttribute('data-dialog-id');
    const dialog = document.querySelector(`[data-radix-dialog-content][data-dialog-id="${dialogId}"]`);
    const closeButtons = dialog ? dialog.querySelectorAll('[data-radix-dialog-close]') : [];
    const overlay = document.querySelector(`[data-radix-dialog-overlay][data-dialog-id="${dialogId}"]`);
    
    if (!dialog) return;
    
    // 다이얼로그 열기
    trigger.addEventListener('click', () => {
      dialog.classList.remove('hidden');
      dialog.setAttribute('data-state', 'open');
      if (overlay) overlay.classList.remove('hidden');
      
      // 포커스 트랩 설정
      dialog.setAttribute('tabindex', '0');
      dialog.focus();
      
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    });
    
    // 다이얼로그 닫기
    closeButtons.forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        dialog.classList.add('hidden');
        dialog.setAttribute('data-state', 'closed');
        if (overlay) overlay.classList.add('hidden');
        
        // 스크롤 복원
        document.body.style.overflow = '';
      });
    });
    
    // 오버레이 클릭 시 닫기
    if (overlay) {
      overlay.addEventListener('click', () => {
        dialog.classList.add('hidden');
        dialog.setAttribute('data-state', 'closed');
        overlay.classList.add('hidden');
        
        // 스크롤 복원
        document.body.style.overflow = '';
      });
    }
  });
}

// Toast 컴포넌트 초기화
function initToasts() {
  const toastContainer = document.querySelector('[data-radix-toast-region]');
  if (!toastContainer) return;
  
  // 토스트 표시 함수
  window.showToast = function(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.setAttribute('data-radix-toast', '');
    toast.setAttribute('data-state', 'open');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    // 토스트 타입에 따른 스타일 적용
    let bgColor = 'bg-gray-800';
    let icon = '';
    
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500';
        icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        break;
      case 'error':
        bgColor = 'bg-red-500';
        icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
        break;
      default:
        bgColor = 'bg-primary-500';
        icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
    
    toast.className = `${bgColor} text-white p-3 rounded-lg shadow-lg flex items-center gap-2 mb-2 transform translate-y-0 opacity-100 transition-all duration-300`;
    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
      <button data-radix-toast-close class="ml-auto text-white">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // 닫기 버튼 이벤트
    const closeBtn = toast.querySelector('[data-radix-toast-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeToast(toast);
      });
    }
    
    // 자동 닫기
    setTimeout(() => {
      closeToast(toast);
    }, duration);
  };
  
  function closeToast(toast) {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
}

// 드롭다운 메뉴 초기화
function initDropdownMenus() {
  const dropdownTriggers = document.querySelectorAll('[data-radix-dropdown-trigger]');
  
  dropdownTriggers.forEach(trigger => {
    const dropdownId = trigger.getAttribute('data-dropdown-id');
    const dropdown = document.querySelector(`[data-radix-dropdown-content][data-dropdown-id="${dropdownId}"]`);
    
    if (!dropdown) return;
    
    // 드롭다운 토글
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.getAttribute('data-state') === 'open';
      
      if (isOpen) {
        dropdown.classList.add('hidden');
        dropdown.setAttribute('data-state', 'closed');
      } else {
        dropdown.classList.remove('hidden');
        dropdown.setAttribute('data-state', 'open');
        
        // 위치 조정
        const triggerRect = trigger.getBoundingClientRect();
        dropdown.style.top = `${triggerRect.bottom + window.scrollY}px`;
        dropdown.style.left = `${triggerRect.left + window.scrollX}px`;
      }
    });
    
    // 드롭다운 메뉴 아이템 이벤트
    const menuItems = dropdown.querySelectorAll('[data-radix-dropdown-item]');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.add('hidden');
        dropdown.setAttribute('data-state', 'closed');
      });
    });
    
    // 외부 클릭 시 닫기
    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
      dropdown.setAttribute('data-state', 'closed');
    });
  });
}
